import useDocumentStore, { DocumentStoreProps } from "./Document";
import hocMapper from "@/utils/hocMapper";
import useGroupStore, { GroupStoreProps } from "./Group";

export type StoreProps = {
  document: DocumentStoreProps;
  group: GroupStoreProps;
};
export const useStore = hocMapper({
  document: useDocumentStore,
  group: useGroupStore,
});
