import { Group } from "@/services/Group";
import { create } from "zustand";

interface GroupState {
  groups: Group[];
  selectedGroup: Group | undefined;
}

interface GroupActions {
  setSelectedGroup: (group: Group) => void;
  clearSelectedGroup: () => void;
  setGroups: (groups: Group[]) => void;
  updateGrup: (group: Group) => void;
  removeGroup: (groupId: string) => void;
  updateSelectedGroupCustomerId: (customerId: string) => void; // Tambahkan fungsi updateSelectedGroupCustomerId
}

type GroupStore = GroupState & GroupActions;

const useGroupStore = create<GroupStore>((set) => ({
  selectedGroup: {} as Group,
  groups: [],
  setGroups: (groups: Group[]) => set({ groups }),
  updateGrup: (group: Group) =>
    set((state) => ({
      groups: state.groups.some((g) => g.id === group.id)
        ? state.groups.map((g) => (g.id === group.id ? group : g))
        : [group, ...state.groups],
    })),
  setSelectedGroup: (group: Group) => set({ selectedGroup: group }),
  clearSelectedGroup: () => set({ selectedGroup: {} as Group }),
  removeGroup: (groupId: string) =>
    set((state) => ({
      groups: state.groups.filter((g) => g.id !== groupId),
    })),
  updateSelectedGroupCustomerId: (customerId: string) =>
    set((state) => ({
      selectedGroup: state.selectedGroup
        ? { ...state.selectedGroup, customerId }
        : undefined,
    })), // Implementasi fungsi updateSelectedGroupCustomerId
}));

// 3. Export type untuk memudahkan penggunaan di komponen
export type GroupStoreProps = GroupStore;
export default useGroupStore;
