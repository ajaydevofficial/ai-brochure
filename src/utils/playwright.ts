import { Page, chromium } from "playwright";

interface Meta {
  title?: string | null;
  links?: string[] | null;
  description?: string | null;
  keywords?: string | null;
  author?: string | null;
  robots?: string | null;
  canonical?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: string | null;
  ogUrl?: string | null;
  ogType?: string | null;
  ogSiteName?: string | null;
  ogLocale?: string | null;
  ogLocaleAlternate?: string | null;
}

export const getVisibleTextExcludingCode = async (
  page: Page
): Promise<string> => {
  return page.evaluate(() => {
    const clone = document.body.cloneNode(true) as HTMLElement;
    clone
      .querySelectorAll("script,style,noscript,template")
      .forEach((el) => el.remove());

    // Insert a newline after each element to ensure separation between different HTML elements
    clone.querySelectorAll("*").forEach((el) => {
      el.insertAdjacentText("afterend", "\n");
    });

    const text = (clone.innerText || "").trim();
    return text
      .replace(/\u00A0/g, " ")
      .replace(/[\t ]+/g, " ")
      .replace(/\n[\t ]*/g, "\n")
      .replace(/\n{2,}/g, "\n");
  });
};

export const scrapeWebsite = async (
  url: string
): Promise<{
  content: string;
  meta: Meta;
  links: string[];
}> => {
  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto(url);

    console.log("page", await page.evaluate(() => document.title));
    const content = await getVisibleTextExcludingCode(page);
    console.log("content", content);

    const data = await page.evaluate(async () => {
      // Get all links in the page
      const links = Array.from(document.querySelectorAll("a")).map(
        (a) => a.href
      );

      // Get all meta tags
      const title = document.title;
      const description = document
        .querySelector('meta[name="description"]')
        ?.getAttribute("content");
      const keywords = document
        .querySelector('meta[name="keywords"]')
        ?.getAttribute("content");
      const author = document
        .querySelector('meta[name="author"]')
        ?.getAttribute("content");

      const allMeta: Meta = {
        links,
        title,
        description,
        keywords,
        author,
      };

      const availableMeta: Meta = {};

      Object.keys(allMeta).forEach((key: string) => {
        if (allMeta[key as keyof Meta])
          //@ts-ignore
          availableMeta[key as keyof Meta] = allMeta[key as keyof Meta];
      });

      return availableMeta;
    });
    await browser.close();
    return { content, meta: data, links: data.links || [] };
  } catch (error) {
    console.error("Error scraping website", error);
    return { content: "", meta: {}, links: [] };
  }
};
