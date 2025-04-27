import React, { createContext, Component, PropsWithChildren } from "react";

// Buat type untuk context
export interface DocumentContextType {
  title: string;
  documents: {
    id: number;
    category: string;
    image: string;
  }[];
  setTitle: (title: string) => void;
  updateDocumentCategory: (docId: number, category: string) => void;
}

// Buat context dengan nilai default
const DocumentContext = createContext<DocumentContextType | undefined>(
  undefined
);

class DocumentProvider extends Component<
  PropsWithChildren,
  DocumentContextType
> {
  // Method untuk update title
  setTitle = (title: string) => {
    this.setState({ title });
  };

  // Method untuk update kategori dokumen
  updateDocumentCategory = (docId: number, category: string) => {
    this.setState((prevState) => ({
      documents: prevState.documents.map((doc) =>
        doc.id === docId ? { ...doc, category } : doc
      ),
    }));
  };

  state: DocumentContextType = {
    title: "141002212997",
    documents: [
      // {
      //   id: 1,
      //   category: "Surat Tugas",
      //   image:
      //     "https://i2.wp.com/www.digitallycredible.com/wp-content/uploads/2019/03/Free-Printable-Lined-Notebook-Paper.jpg",
      // },
      // {
      //   id: 2,
      //   category: "Surat Tugas",
      //   image:
      //     "https://i2.wp.com/www.digitallycredible.com/wp-content/uploads/2019/03/Free-Printable-Lined-Notebook-Paper.jpg",
      // },
      // {
      //   id: 3,
      //   category: "Surat Tugas",
      //   image:
      //     "https://i2.wp.com/www.digitallycredible.com/wp-content/uploads/2019/03/Free-Printable-Lined-Notebook-Paper.jpg",
      // },
      // {
      //   id: 4,
      //   category: "Surat Tugas",
      //   image:
      //     "https://i2.wp.com/www.digitallycredible.com/wp-content/uploads/2019/03/Free-Printable-Lined-Notebook-Paper.jpg",
      // },
    ],
    setTitle: this.setTitle,
    updateDocumentCategory: this.updateDocumentCategory,
  };

  render() {
    return (
      <DocumentContext.Provider value={this.state}>
        {this.props.children}
      </DocumentContext.Provider>
    );
  }
}

export { DocumentContext, DocumentProvider };
