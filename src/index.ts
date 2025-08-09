import OpenAI from "./utils/open-ai";
import { getRelevantLinks } from "./utils/ai.helper";
import { scrapeWebsite } from "./utils/playwright";

const main = async () => {
  const data = await scrapeWebsite("https://www.google.com");

  console.log("Content after scraping: ", data?.content);

  const links = data?.links || [];
  const title = data?.meta.title;
  const description = data?.meta.description;
  const relevantLinks = await getRelevantLinks(
    title || "",
    description || "",
    links
  );
  console.log("Relevant links: ", relevantLinks);
};

main();
