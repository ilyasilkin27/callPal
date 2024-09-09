import puppeteer from "puppeteer";
import dotenv from "dotenv";
import wait from "./utils/wait.js";

dotenv.config();

const loginToAmoCRM = async (page) => {
  const { AMOCRM_URL, AMOCRM_EMAIL, AMOCRM_PASSWORD } = process.env;

  await page.goto(AMOCRM_URL);
  await page.type("#session_end_login", AMOCRM_EMAIL);
  await page.type("#password", AMOCRM_PASSWORD);
  await page.click("#auth_submit");

  await page.waitForNavigation({ waitUntil: "networkidle2" });
};

const searchDeals = async (page, email) => {
  await page.waitForSelector("#search_input", { visible: true });
  await page.click("#search_input");
  await page.type("#search_input", email);

  await wait(2000);

  try {
    await page.waitForFunction(
      () => {
        const container = document.querySelector(
          "#search-suggest-drop-down-menu_container"
        );
        if (!container) return false;
        const results = container.querySelectorAll(
          ".search-results__row-section__right-column__result.js-search-suggest-result"
        );
        const noResults = container.querySelector(".no-result");
        return results.length > 0 || noResults;
      },
      { timeout: 15000 }
    );
  } catch (error) {
    console.error(`Ошибка ожидания результатов для ${email}: ${error.message}`);
    return null;
  }

  const noResult = await page.$(".no-result");
  if (noResult) {
    console.log(`По запросу ${email} сделок не найдено`);
    return `По запросу ${email} сделок не найдено`;
  }

  const firstDealLink = await page
    .$eval(".js-navigate-link-search-suggest", (link) => link.href)
    .catch(() => null);

  if (firstDealLink) {
    console.log("Ссылка на первую сделку:", firstDealLink);
    return firstDealLink;
  } else {
    console.log("Результаты не найдены");
    return null;
  }
};

export default async (emails) => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const dealLinks = [];

  await loginToAmoCRM(page);

  for (const email of emails) {
    const dealLink = await searchDeals(page, email);
    if (dealLink) {
      dealLinks.push(dealLink);
    }

    await page.evaluate(() => {
      const searchInput = document.querySelector("#search_input");
      if (searchInput) searchInput.value = "";
    });

    await wait(3000);
  }

  await browser.close();
  console.log("Финальный массив ссылок на сделки:", dealLinks);
  return dealLinks;
};
