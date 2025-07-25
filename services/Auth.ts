
import { storage } from "@/constants/MKKV";
import { router } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { UserProfile } from "./User";
import { createHashSHA1 } from "@/utils/generator";
import { Platform } from "react-native";
import { showAlert } from "@/utils/alert";
import firebaseInstance from "./Firebase";

interface LoginRequest {
    username: string;
    password: string;
}

class AuthService {
    private db: ReturnType<typeof firebaseInstance.getFirestoreInstance>;

    constructor() {
        this.db = firebaseInstance.getFirestoreInstance();
    }

    // Method untuk logout
    logout(): void {
        // Hapus data credential dari MMKV
        storage.delete('userData');
        router.push("/");
    }

    async login(requestBody: LoginRequest): Promise<void> {
        const { username, password } = requestBody;

        try {
            // Query ke Firestore untuk mencari user dengan username yang sesuai
            const usersRef = collection(this.db, "users");
            const q = query(usersRef, where("username", "==", username));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                throw new Error("User not found"); // Jika tidak ada user dengan username tersebut
            }

            // Ambil data user dari Firestore
            const userDoc = querySnapshot.docs[0];
            const userData = userDoc.data() as Omit<UserProfile, 'id'>;

            // Bandingkan password
            if (userData.password === createHashSHA1(password)) {
                // Tambahkan ID dokumen ke data user
                const userWithId = {
                    id: userDoc.id,
                    ...userData
                };

                // Simpan data credential (termasuk ID) ke MMKV
                storage.set('userData', JSON.stringify(userWithId));

                if (Platform.OS === 'web' && userData.role === 'pegawai') return showAlert('Gagal Login', 'Hanya admin dan pengelola yang bisa mengakses website.')

                // Redirect ke halaman utama setelah login berhasil
                if (userData.role === 'pegawai') router.push("/home");
                if (userData.role !== 'pegawai') router.push("/dashboard");
            } else {
                throw new Error("Incorrect password"); // Jika password tidak cocok
            }
        } catch (error) {
            console.error("Error logging in:", error);
            throw error; // Lempar error untuk ditangani di komponen
        }
    }

    // Method untuk mengecek apakah user sudah login
    // isLoggedIn(): boolean {
    //     const userData: UserProfile | null = userService.getCurrentUser();
    //     if (!userData) return false;
    //     return !!userData
    // }
}

// Export instance dari AuthService
export default AuthService 