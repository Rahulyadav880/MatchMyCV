import { PDFParse } from "pdf-parse";

export async function extractTextFromPdf(
  buffer: Buffer,
): Promise<string> {
  const parser = new PDFParse({ data: buffer });
  
  try {
    const result = await parser.getText();
    return result.text.trim();
  } finally {
    // Always call destroy to release internal resources and memory
    await parser.destroy();
  }
}