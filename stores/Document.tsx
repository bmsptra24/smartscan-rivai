import { Document } from "@/services/Document";
import { create } from "zustand";

interface DocumentState {
  title: string;
  documents: Document[];
}

interface DocumentActions {
  setTitle: (title: string) => void;
  updateDocumentCategory: (docId: string, category: string) => void;
  addDocuments: (newDocuments: Document[]) => void;
}

type DocumentStore = DocumentState & DocumentActions;

const useDocumentStore = create<DocumentStore>((set) => ({
  title: "",
  documents: [],
  setTitle: (title) => set({ title }),
  addDocuments: (newDocuments: Document[]) => {
    set((state) => ({
      documents: [...state.documents, ...newDocuments],
    }));
  },
  updateDocumentCategory: (docId, category) => {
    set((state) => ({
      documents: state.documents.map((doc) =>
        doc.id === docId ? { ...doc, category } : doc
      ),
    }));
  },
}));

// 3. Export type untuk memudahkan penggunaan di komponen
export type DocumentStoreProps = DocumentStore;
export default useDocumentStore;
