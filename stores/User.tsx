import { UserProfile } from "@/services/User";
import { create } from "zustand";

interface UserState {
  users: UserProfile[];
  currentUser: UserProfile;
}

interface UserActions {
  setCurrentUser: (currentUser: UserProfile) => void;
  clearSelectedUser: () => void;
  setUsers: (users: UserProfile[]) => void;
  updateUser: (currentUser: UserProfile) => void;
}

type UserStore = UserState & UserActions;

const useUserStore = create<UserStore>((set) => ({
  currentUser: {} as UserProfile,
  users: [],
  setUsers: (users: UserProfile[]) => set({ users }),
  updateUser: (currentUser: UserProfile) =>
    set((state) => ({
      users: state.users.map((u) =>
        u.id === currentUser.id ? currentUser : u
      ),
    })),
  setCurrentUser: (currentUser: UserProfile) => set({ currentUser }),
  clearSelectedUser: () => set({ currentUser: {} as UserProfile }),
}));

// Export type untuk memudahkan penggunaan di komponen
export type UserStoreProps = UserStore;
export default useUserStore;
