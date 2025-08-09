import OpenAI from "./open-ai";

export const getRelevantLinks = async (
  websiteURL: string,
  description: string,
  links: string[]
) => {
  const options: any = {
    model: "gpt-4.1",
    input: [
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
    Now give me the top 3 links that can be added in the brochure of this website. Return only the links in as strict format of a JSON without any other text or indicator.
          
    Example of good responses?
    {
        "relevant_links": [
            "https://www.google.com",
            "https://www.facebook.com",
            "https://www.twitter.com"
        ]
    }
    
   Example of bad responses?
    
    Here is your json
     {
        "relevant_links": [
            "https://www.google.com",
            "https://www.facebook.com",
            "https://www.twitter.com"
        ]
    }

    JSON
    {
        "relevant_links": [
            "https://www.google.com",
            "https://www.facebook.com",
            "https://www.twitter.com"
        ]
    }

    json
    {
        "relevant_links": [
            "https://www.google.com",
            "https://www.facebook.com",
            "https://www.twitter.com"
        ]
    }

    Why these are considered as bad responses?
    - They are not in JSON format
    - They contain extra text or indicator
    - They cannot be directly parsed as JSON using JSON.parse()
    `,
      },
    ],
  };
  const stream = OpenAI.responses
    .stream(options)
    .on("response.refusal.delta", (event) => {
      process.stdout.write(event.delta);
    })
    .on("response.output_text.delta", (event) => {
      process.stdout.write(event.delta);
    })
    .on("response.output_text.done", () => {
      process.stdout.write("\n");
    })
    //@ts-ignore
    .on("response.error", (event) => {
      console.error(event.error);
    });

  const response = await stream.finalResponse();
  //@ts-ignore
  const data = JSON.parse(response?.output?.[0]?.content[0]?.text || "{}");
  return data;
};

export const generateBrochure = async (
  websiteURL: string,
  description: string,
  content: string
) => {
  console.log("Sending Request to OpenAI");
  const options: any = {
    model: "gpt-4.1",
    input: [
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

            What is good example of response?
            {
              "html": "<html>...</html>"
            }
            
            What is bad example of response?
            
            Here is your json
            {
              "html": "<html>...</html>"
            }

            json
            {
              "html": "<html>...</html>"
            }

            JSON
            {
              "html": "<html>...</html>"
            }
            
            Why this is considered as bad response?
            - It is not in JSON format
            - It contains extra text or indicator
            - It cannot be directly parsed as JSON using JSON.parse()
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
  };
  const stream = OpenAI.responses
    .stream(options)
    .on("response.refusal.delta", (event) => {
      process.stdout.write(event.delta);
    })
    .on("response.output_text.delta", (event) => {
      process.stdout.write(event.delta);
    })
    .on("response.output_text.done", () => {
      process.stdout.write("\n");
    })
    //@ts-ignore
    .on("response.error", (event) => {
      console.error(event.error);
    });

  const response = await stream.finalResponse();
  //@ts-ignore
  const data = JSON.parse(response?.output?.[0]?.content[0]?.text || "{}");
  return data;
};
