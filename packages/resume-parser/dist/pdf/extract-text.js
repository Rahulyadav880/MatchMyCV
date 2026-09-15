import { PDFParse } from "pdf-parse";
export async function extractTextFromPdf(buffer) {
    const parser = new PDFParse({ data: buffer });
    try {
        const result = await parser.getText();
        return result.text.trim();
    }
    finally {
        // Always call destroy to release internal resources and memory
        await parser.destroy();
    }
}
//# sourceMappingURL=extract-text.js.map