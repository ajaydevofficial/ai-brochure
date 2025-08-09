import { promises as fs } from "fs";
import path from "path";

export interface WriteHtmlOptions {
  directory?: string; // directory to save file in; defaults to "output"
  fileName?: string; // desired file name; defaults to generated timestamped name
  overwrite?: boolean; // overwrite if file exists; defaults to true
  wrapIfBareHtmlFragment?: boolean; // wrap content in basic HTML if it lacks <html>; defaults to true
}

/**
 * Writes the provided HTML content to a local .html file and returns the absolute file path.
 */
export async function writeHtmlFile(
  htmlContent: string,
  options: WriteHtmlOptions = {}
): Promise<string> {
  const {
    directory = "output",
    fileName,
    overwrite = true,
    wrapIfBareHtmlFragment = true,
  } = options;

  // Ensure content is a full document when requested
  const content =
    wrapIfBareHtmlFragment && !/\<html[\s>]/i.test(htmlContent)
      ? `<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8" />\n<meta name="viewport" content="width=device-width, initial-scale=1" />\n<title>Document</title>\n</head>\n<body>\n${htmlContent}\n</body>\n</html>\n`
      : htmlContent;

  // Generate a default filename if not supplied
  const timestamp = new Date()
    .toISOString()
    .replace(/[:.]/g, "-")
    .replace("T", "-")
    .replace("Z", "");
  const safeBase =
    fileName?.replace(/[^a-z0-9-_\.]/gi, "_") || `page-${timestamp}.html`;
  const finalFileName = safeBase.toLowerCase().endsWith(".html")
    ? safeBase
    : `${safeBase}.html`;

  const outDir = path.resolve(process.cwd(), directory);
  const outPath = path.join(outDir, finalFileName);

  await fs.mkdir(outDir, { recursive: true });

  if (!overwrite) {
    try {
      await fs.access(outPath);
      // If exists, add a numeric suffix
      const { name, ext } = path.parse(outPath);
      let counter = 1;
      let candidate = path.join(
        outDir,
        `${path.basename(name)}-${counter}${ext}`
      );
      // eslint-disable-next-line no-constant-condition
      while (true) {
        try {
          await fs.access(candidate);
          counter += 1;
          candidate = path.join(
            outDir,
            `${path.basename(name)}-${counter}${ext}`
          );
        } catch {
          break;
        }
      }
      await fs.writeFile(candidate, content, "utf8");
      return candidate;
    } catch {
      // Does not exist, safe to write to outPath
    }
  }

  await fs.writeFile(outPath, content, "utf8");
  return outPath;
}
