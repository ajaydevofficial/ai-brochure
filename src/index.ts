import { generateBrochure, getRelevantLinks } from "./utils/ai.helper";

import { scrapeWebsite } from "./utils/playwright";
import { writeHtmlFile } from "./utils/file";

const brochureGenerator = async (url: string) => {
  const data = await scrapeWebsite(url);
  const links = data?.links || [];
  const title = data?.meta.title;
  const description = data?.meta.description;
  const relevantLinks = await getRelevantLinks(
    title || "",
    description || "",
    links
  );

  const contentsFromAllLinks = await Promise.all(
    relevantLinks?.relevant_links?.map(async (link: string) => {
      const data = await scrapeWebsite(link);
      return data.content;
    })
  );
  const combinedContent = `
  ${data?.content}
  ${contentsFromAllLinks.join("\n")}
  `;

  const finalResponse = await generateBrochure(
    data?.meta.title || "",
    description || "",
    combinedContent
  );
  console.log("HTML: ", finalResponse);

  await writeHtmlFile(finalResponse?.html || "", {
    overwrite: true,
    directory: "brochures",
    fileName: `${data?.meta.title}-${Date.now()}.html`,
  });

  console.log("Finished");
};

const url = "https://www.gohighlevel.com/78476a2";
brochureGenerator(url);
