import puppeteer from "puppeteer";
import dotenv from "dotenv";
import wait from "./utils/wait.js";

dotenv.config();

const login = async (page) => {
  const { REVVY_LOGIN, REVVY_PASS } = process.env;

  try {
    await page.goto("http://5.182.226.179:20000/");

    await page.waitForSelector("#input-email");
    await page.type("#input-email", REVVY_LOGIN);

    await page.waitForSelector("#input-password");
    await page.type("#input-password", REVVY_PASS);
    await page.waitForSelector(
      'button[nbbutton][status="primary"][size="large"]'
    );
    await page.click('button[nbbutton][status="primary"][size="large"]');
    await page.waitForNavigation();

    await page.waitForSelector('a[title="Управление доступом"]');
    await page.click('a[title="Управление доступом"]');
  } catch (error) {
    console.error("Error during login:", error);
  }
};

const typeId = async (page, id) => {
  await page.waitForSelector('input[placeholder="Id организации"]');

  await page.evaluate(() => {
    const input = document.querySelector('input[placeholder="Id организации"]');
    if (input) {
      input.value = "";
      input.dispatchEvent(new Event("input", { bubbles: true }));
    }
  });

  await page.click('input[placeholder="Id организации"]');
  await page.type('input[placeholder="Id организации"]', id);
  await wait (1000);
};

const clickButtonWithText = async (page, buttonText) => {
  await page.evaluate((text) => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const button = buttons.find((b) => b.textContent.includes(text));
    if (button) {
      button.click();
    }
  }, buttonText);
};

const goToOrg = async (page) => {
  await clickButtonWithText(page, "Зайти под сотрудником");
  await page.waitForNavigation();
};

const checkPhoneStatus = async (page, ids) => {
  const results = [];

  for (const id of ids) {
    await page.waitForSelector('a[title="Настройки"]');
    await page.click('a[title="Настройки"]');
    await wait(500);
    await page.waitForSelector('a[title="Настройка каналов"]');
    await page.click('a[title="Настройка каналов"]');
    await wait(500);
    await page.waitForSelector('a[title="WhatsApp аккаунты"]');
    await page.click('a[title="WhatsApp аккаунты"]');
    await wait(500);

    const connectionStatus = await page.evaluate(() => {
      const statusElement = Array.from(document.querySelectorAll("p")).find(
        (el) => el.textContent.includes("Статус подключения:")
      );

      if (statusElement) {
        const statusText = statusElement.nextElementSibling;
        return statusText ? statusText.textContent.trim() : "Не найдено";
      }

      return "Не найдено";
    });

    if (!connectionStatus.includes("Работает")) {
      results.push({ id, status: connectionStatus });
      console.log(`ID: ${id} - Status: ${connectionStatus} (не работает)`);
    } else {
      console.log(`ID: ${id} - Status: работает`);
    }
  }

  return results;
};

const goBack = async (page) => {
  await page.waitForSelector('a.nb-transition[href*="organizationId"]');
  await wait(1500);
  await page.click('a.nb-transition[href*="organizationId"]');
  await page.waitForNavigation();
};

export default async (ids) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await login(page);

    for (const id of ids) {
      await typeId(page, id);
      await goToOrg(page);
      await checkPhoneStatus(page, [id]);
      await goBack(page);
    }
  } catch (error) {
    console.error("Error in getPhoneStatus function:", error);
  } finally {
    await browser.close();
  }
};
