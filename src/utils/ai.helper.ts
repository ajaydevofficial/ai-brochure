import OpenAI from "./open-ai";

export const getRelevantLinks = async (
  websiteURL: string,
  description: string,
  links: string[]
) => {
  const response = await OpenAI.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant who has a deep understanding of links and their relevance to a given website. You will be given a list of links, title and description of the website. You will need to return a list of links that are most relevant to the website content which can be added in the brochure of this website.",
      },
      {
        role: "user",
        content: `Here is the list of links from ${websiteURL}, with a description: ${description}  and links ${links.join(
          ", "
        )}. Now give me the relevant links that can be added in the brochure of this website. Return only the links in the format of a JSON.`,
      },
    ],
    response_format: { type: "json_object" },
  });
  const content = response.choices[0].message.content;
  console.log("Content from getRelevantLinks", content);
  if (!content) return [];
  return JSON.parse(content);
};
