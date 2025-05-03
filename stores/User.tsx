import { UserProfile } from "@/services/User";
import { create } from "zustand";

interface UserState {
  users: UserProfile[];
  currentUser: UserProfile;
  selectedUser: UserProfile | undefined; // Tambahkan selectedUser
}

interface UserActions {
  setCurrentUser: (currentUser: UserProfile) => void;
  clearSelectedUser: () => void;
  setUsers: (users: UserProfile[]) => void;
  updateUser: (currentUser: UserProfile) => void;
  upsertUser: (user: UserProfile) => void;
  deleteUser: (userId: string) => void;
  setSelectedUser: (selectedUser: UserProfile) => void; // Tambahkan aksi setSelectedUser
  clearSelectedUserState: () => void; // Tambahkan aksi clearSelectedUserState
}

type UserStore = UserState & UserActions;

const useUserStore = create<UserStore>((set) => ({
  currentUser: {} as UserProfile,
  users: [],
  selectedUser: undefined, // Inisialisasi selectedUser
  setUsers: (users: UserProfile[]) => set({ users }),
  updateUser: (currentUser: UserProfile) =>
    set((state) => ({
      users: state.users.map((u) =>
        u.id === currentUser.id ? currentUser : u
      ),
    })),
  setCurrentUser: (currentUser: UserProfile) => set({ currentUser }),
  clearSelectedUser: () => set({ currentUser: {} as UserProfile }),
  upsertUser: (user: UserProfile) =>
    set((state) => {
      const userExists = state.users.some((u) => u.id === user.id);
      return {
        users: userExists
          ? state.users.map((u) => (u.id === user.id ? user : u))
          : [...state.users, user],
      };
    }),
  deleteUser: (userId: string) =>
    set((state) => ({
      users: state.users.filter((u) => u.id !== userId),
    })),
  setSelectedUser: (selectedUser: UserProfile) => set({ selectedUser }), // Implementasi setSelectedUser
  clearSelectedUserState: () => set({ selectedUser: undefined }), // Implementasi clearSelectedUserState
}));

// Export type untuk memudahkan penggunaan di komponen
export type UserStoreProps = UserStore;
export default useUserStore;
