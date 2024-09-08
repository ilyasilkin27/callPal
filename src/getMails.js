import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export default async (ids) => {
  const config = {
    API_URL: process.env.API_URL,
    API_KEY: process.env.API_KEY,
  };  

  const emails = [];

  try {
    const response = await axios.get(config.API_URL, {
      headers: {
        Authorization: `Bearer ${config.API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    const organizations = response.data;

    ids.forEach((id) => {
      const org = organizations.find((org) => org.id === id);
      if (org) {
        emails.push(org.email);
        console.log(`Email для ID ${id}: ${org.email}`);
      } else {
        console.log(`Нет данных для ID ${id}`);
      }
    });
  } catch (error) {
    console.error(`Ошибка при запросе данных: ${error.message}`);
  }

  return emails;
};

