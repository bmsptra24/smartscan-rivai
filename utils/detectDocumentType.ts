import { DOC_TYPE_WITH_KEYWORDS, DocumentTypeKeywords } from "@/constants/Config";




// Fungsi untuk mempersiapkan teks OCR
function prepareText(text: string): string {
    return text.toLowerCase();
}

// Fungsi untuk menghitung skor berdasarkan kata kunci
function calculateScores(ocrText: string, DOC_TYPE_WITH_KEYWORDS: DocumentTypeKeywords): { [docType: string]: number } {
    const preparedText = prepareText(ocrText);
    const scores: { [docType: string]: number } = {};

    for (const docType in DOC_TYPE_WITH_KEYWORDS) {
        scores[docType] = 0;
        for (const { keyword, weight } of DOC_TYPE_WITH_KEYWORDS[docType]) {
            if (preparedText.includes(keyword)) {
                scores[docType] += weight;
            }
        }
    }

    return scores;
}

// Fungsi untuk menentukan jenis dokumen berdasarkan skor tertinggi
function determineDocumentType(ocrText: string, DOC_TYPE_WITH_KEYWORDS: DocumentTypeKeywords): string {
    const scores = calculateScores(ocrText, DOC_TYPE_WITH_KEYWORDS);
    let maxScore = 0;
    let detectedType = "Lainnya"; // jika jenis dokumen tidak dapat ditentukan

    for (const docType in scores) {
        if (scores[docType] > maxScore) {
            maxScore = scores[docType];
            detectedType = docType;
        }
    }

    return detectedType;
}

// Fungsi utama untuk mendeteksi jenis dokumen
export function detectDocumentType(ocrText: string): string {
    return determineDocumentType(ocrText, DOC_TYPE_WITH_KEYWORDS);
}
