import { db } from "@/constants/Firebase";
import { storage } from "@/constants/MKKV";
import { router } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";

interface LoginRequest {
    username: string;
    password: string;
}

class AuthService {
    // Method untuk logout
    logout(): void {
        // Hapus data credential dari MMKV
        storage.delete('username');
        storage.delete('password');
        console.log("Logged out successfully!");
        // Redirect ke halaman login setelah logout
        router.push("/");
    }

    async login(requestBody: LoginRequest): Promise<void> {
        const { username, password } = requestBody;

        try {
            // Query ke Firestore untuk mencari user dengan username yang sesuai
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("username", "==", username));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                throw new Error("User not found"); // Jika tidak ada user dengan username tersebut
            }

            // Ambil data user dari Firestore
            const userDoc = querySnapshot.docs[0];
            const userData = userDoc.data();

            // Bandingkan password
            if (userData.password === password) {
                console.log("Login successful!");

                // Simpan data credential ke MMKV
                storage.set('username', username);
                storage.set('password', password);

                // Redirect ke halaman utama setelah login berhasil
                router.push("/(tabs)");
            } else {
                throw new Error("Incorrect password"); // Jika password tidak cocok
            }
        } catch (error) {
            console.error("Error logging in:", error);
            throw error; // Lempar error untuk ditangani di komponen
        }
    }

    // Method untuk mengecek apakah user sudah login
    isLoggedIn(): boolean {
        const username = storage.getString('username');
        const password = storage.getString('password');
        return !!username && !!password;
    }
}

// Export instance dari AuthService
export const authService = new AuthService();