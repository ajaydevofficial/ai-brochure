import OpenAI from "./open-ai";

export const getRelevantLinks = async (
  websiteURL: string,
  description: string,
  links: string[]
) => {
  console.log("Sending Request to OpenAI");
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
        content: `
Here is the list of links from ${websiteURL}, with a description: ${description}  and links ${links.join(
          ", "
        )}. 
Now give me the top 3 links that can be added in the brochure of this website. Return only the links in the format of a JSON.
    example: {
      "relevant_links": [
        "https://www.google.com",
        "https://www.facebook.com",
        "https://www.twitter.com"
      ]
    }
        `,
      },
    ],
    response_format: { type: "json_object" },
  });
  const content = response.choices[0].message.content;
  if (!content) return [];
  return JSON.parse(content);
};

export const generateBrochure = async (
  websiteURL: string,
  description: string,
  content: string
) => {
  console.log("Sending Request to OpenAI");
  const response = await OpenAI.chat.completions.create({
    model: "gpt-4.1",
    messages: [
      {
        role: "system",
        content: `
            You are a professional in creating very advanced and modern HTML content of any kind.
            You will be given a website URL, description and content from all relevant links of the website.
            You will create very beautiful, modern and advanced HTML content which represents the brochure of the website.
            The page can contain a subtle gradient as background, modern and advanced UI/UX, and should be very beautiful and modern.
            Choose the best colors for the background and text. Background colors and text colors should have a good contrast so that it is easy to read.
            Page should be responsive for mobile and tablet devices.
            Response should inn JSON format.

            HTML content should look like a PDF brochure and not a website

            What is allowed?
            - You can use any HTML tags and attributes
            - You can use any CSS properties and values
            - You can use any JavaScript code
            - You can use any images or icons
            - You can use any fonts
            - You can use any colors

            What is not allowed?
            - Content should not be a website, it should be a PDF brochure.
            - Images shouldn't be added in the entire brochure.

            example: {
              "html": "<html>...</html>"
            }
            `,
      },
      {
        role: "user",
        content: `
          Here is the website: ${websiteURL} which talks about ${description}
          The following is the content from all relevant links of the website
          ${content}
          Create a very beautiful and modern HTML content which represents the brochure of the website.
          `,
      },
    ],
    response_format: { type: "json_object" },
  });
  return JSON.parse(response.choices[0].message.content as string);
};
