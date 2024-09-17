import getMails from "./src/getMails.js";
import createIds from "./src/utils/ids.js";
import getLinks from "./src/getLinks.js";
import getPhoneStatus from "./src/getPhoneStatus.js";

const main = async () => {
  const ids = createIds();
  const mails = await getMails(ids);
  await getLinks(mails);
  await getPhoneStatus(ids);
};

main();
