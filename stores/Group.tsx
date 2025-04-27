import { Group } from "@/services/Group";
import { create } from "zustand";

interface GroupState {
  selectedGroup: Group;
}

interface GroupActions {
  setSelectedGroup: (group: Group) => void;
  clearSelectedGroup: () => void;
}

type GroupStore = GroupState & GroupActions;

const useGroupStore = create<GroupStore>((set) => ({
  selectedGroup: {} as Group,
  setSelectedGroup: (group: Group) => set({ selectedGroup: group }),
  clearSelectedGroup: () => set({ selectedGroup: {} as Group }),
}));

// 3. Export type untuk memudahkan penggunaan di komponen
export type GroupStoreProps = GroupStore;
export default useGroupStore;
