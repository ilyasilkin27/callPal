import puppeteer from "puppeteer";
import dotenv from "dotenv";

dotenv.config();

const { AMOCRM_URL, AMOCRM_EMAIL, AMOCRM_PASSWORD } = process.env;

const loginToAmoCRM = async (page) => {
  await page.goto(AMOCRM_URL);
  await page.type("#session_end_login", AMOCRM_EMAIL);
  await page.type("#password", AMOCRM_PASSWORD);
  await page.click("#auth_submit");
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const searchDeals = async (page, email) => {
  await page.waitForSelector("#search_input", { visible: true });
  await page.click("#search_input");
  await page.type("#search_input", email);

  await page.waitForFunction(
    () => {
      const container = document.querySelector(
        "#search-suggest-drop-down-menu_container"
      );
      return (
        container &&
        (container.querySelectorAll(
          ".search-results__row-section__right-column__result.js-search-suggest-result"
        ).length > 0 ||
          container.querySelector(".no-result"))
      );
    },
    { timeout: 3000 }
  );

  await wait(3000);

  const noResult = await page.$(".no-result");
  if (noResult) {
    console.log(`По запросу ${email} сделок не найдено`);
    return `По запросу ${email} сделок не найдено`;
  }

  await wait(3000);

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

    await wait(3000);

    await page.evaluate(
      () => (document.querySelector("#search_input").value = "")
    );

    await wait(3000);
  }

  console.log("Финальный массив ссылок на сделки:", dealLinks);
  await browser.close();
  return dealLinks;
};
