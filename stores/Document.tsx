import { documentService } from "@/services";
import { Document } from "@/services/Document";
import { create } from "zustand";

interface DocumentState {
  documents: Document[];
}

interface DocumentActions {
  updateDocumentCategory: (docId: string, category: string) => void;
  updateCustomerId: (docId: string, customerId: string) => void;
  addDocuments: (newDocuments: Document[]) => void;
  clearDocuments: () => void;
  deleteDocument: (docId: string) => void;
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
  updateCustomerId: (docId: string, customerId: string) => {
    set((state) => ({
      documents: state.documents.map((doc) =>
        doc.id === docId ? ({ ...doc, customerId } as Document) : doc
      ),
    }));
  },
  deleteDocument: (docId) => {
    set((state) => ({
      documents: state.documents.filter((doc) => doc.id !== docId),
    }));
  },
  syncDocumentsFromFirestore: async (groupId) => {
    const documents = await documentService.getDocumentsByGroupId(groupId);
    set({ documents });
  },
}));

export type DocumentStoreProps = DocumentStore;
export default useDocumentStore;
