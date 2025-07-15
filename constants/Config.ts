export const APP_VERSION = '1.2.0';

// Definisi tipe untuk kata kunci dan bobotnya
export interface Keyword {
    keyword: string;
    weight: number;
}

export interface DocumentTypeKeywords {
    [docType: string]: Keyword[];
}

// Definisi kata kunci dan bobot untuk setiap jenis dokumen
export const DOC_TYPE_WITH_KEYWORDS: DocumentTypeKeywords = {
    "Surat Perubahan Data Pelanggan": [
        { keyword: "perubahan data pelanggan", weight: 10 },
        { keyword: "pan jang sl kdfasa", weight: 5 },
        { keyword: "jenis mutasi/koreksi", weight: 5 },
        { keyword: "trafo arus", weight: 3 },
        { keyword: "konstanta meter", weight: 3 },
        { keyword: "pln", weight: 2 }
    ],
    "Surat Berita Acara": [
        { keyword: "berita acara", weight: 10 },
        { keyword: "pada hari ini tanggal", weight: 5 },
        { keyword: "dasar", weight: 3 },
        { keyword: "no. agen", weight: 3 },
        { keyword: "jenis pekerjaan atau mufasi", weight: 5 },
        { keyword: "pln", weight: 2 }
    ],
    "Surat Perintah Kerja": [
        { keyword: "perintah kerja", weight: 10 },
        { keyword: "diperintahkan kepada", weight: 5 },
        { keyword: "untuk melaksanakan", weight: 5 },
        { keyword: "perubahan tarif", weight: 3 },
        { keyword: "perubahan daya", weight: 3 },
        { keyword: "pln", weight: 2 }
    ],
    "Surat Perjanjian Jual Beli Tenaga Listrik Pascabayar": [
        { keyword: "surat perjanjian jual beli tenaga listrik", weight: 10 },
        { keyword: "masa berlaku dan berakhir", weight: 10 },
        { keyword: "pasal", weight: 5 },
        { keyword: "pihak pertama", weight: 5 },
        { keyword: "pihak kedua", weight: 5 },
        { keyword: "penyelesaian perselisihan", weight: 3 },
        { keyword: "ruang lingkup", weight: 4 }
    ],
    "Surat Jawaban Persetujuan": [
        { keyword: "jawaban persetujuan", weight: 10 },
        { keyword: "demikian kami sampaikan", weight: 5 },
        { keyword: "sehubungan dengan pemintaan saudara", weight: 5 },
        { keyword: "dapat disetujui dengan ketentuan", weight: 4 },
        { keyword: "pln", weight: 2 }
    ],
    "Surat Permintaan Perubahan Daya": [
        { keyword: "permintaan perubahan daya", weight: 10 },
        { keyword: "yang bertanda tangan dibawah ini", weight: 5 },
        { keyword: "tidak dipungut biaya", weight: 5 },
        { keyword: "rekening listrik", weight: 4 },
        { keyword: "jawaban dapat diperoleh", weight: 3 },
        { keyword: "pln", weight: 2 }
    ]
};

export const DOCUMENT_TYPE = [...Object.keys(DOC_TYPE_WITH_KEYWORDS), 'Lainnya']

export const ROLE = ['admin', 'pengelola', 'pegawai']