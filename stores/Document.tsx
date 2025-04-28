import { documentService } from "@/services";
import { Document } from "@/services/Document";
import { create } from "zustand";

interface DocumentState {
  documents: Document[];
}

interface DocumentActions {
  updateDocumentCategory: (docId: string, category: string) => void;
  addDocuments: (newDocuments: Document[]) => void;
  clearDocuments: () => void;
  syncDocumentsFromFirestore: (groupId: string) => void;
}

type DocumentStore = DocumentState & DocumentActions;

const useDocumentStore = create<DocumentStore>((set) => ({
  title: "",
  documents: [],
  addDocuments: (newDocuments: Document[]) => {
    set((state) => ({
      documents: [...state.documents, ...newDocuments],
    }));
  },
  clearDocuments: () => {
    set({ documents: [] });
  },
  updateDocumentCategory: (docId, type) => {
    set((state) => ({
      documents: state.documents.map((doc) =>
        doc.id === docId ? ({ ...doc, type } as Document) : doc
      ),
    }));
  },
  syncDocumentsFromFirestore: async (groupId) => {
    const documents = await documentService.getDocumentsByGroupId(groupId);
    set({ documents });
  },
}));

// 3. Export type untuk memudahkan penggunaan di komponen
export type DocumentStoreProps = DocumentStore;
export default useDocumentStore;
