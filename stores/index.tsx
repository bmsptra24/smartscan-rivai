import useDocumentStore, { DocumentStoreProps } from "./Document";
import hocMapper from "@/utils/hocMapper";
import useGroupStore, { GroupStoreProps } from "./Group";
import useUserStore, { UserStoreProps } from "./User";

export type StoreProps = {
  documentStore: DocumentStoreProps;
  groupStore: GroupStoreProps;
  userStore: UserStoreProps;
};
export const useStore = hocMapper({
  documentStore: useDocumentStore,
  groupStore: useGroupStore,
  userStore: useUserStore,
});
