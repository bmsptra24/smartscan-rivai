import useDocumentStore, { DocumentStoreProps } from "./Document";
import hocMapper from "@/utils/hocMapper";
import useGroupStore, { GroupStoreProps } from "./Group";

export type StoreProps = {
  documentStore: DocumentStoreProps;
  groupStore: GroupStoreProps;
};
export const useStore = hocMapper({
  documentStore: useDocumentStore,
  groupStore: useGroupStore,
});
