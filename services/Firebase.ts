// Firebase configuration service
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

interface FirebaseConfigOptions {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId?: string;
}

class FirebaseConfig {
    private app: FirebaseApp;
    private db: Firestore;

    constructor() {
        // Your Firebase configuration
        const firebaseConfig: FirebaseConfigOptions = {
            apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || '',
            authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
            projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || '',
            storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
            messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
            appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '',
        };

        // Initialize Firebase
        this.app = initializeApp(firebaseConfig);
        this.db = getFirestore(this.app);
    }

    getFirestoreInstance(): Firestore {
        console.warn(this.db);

        return this.db;
    }
}

// Singleton pattern to ensure only one instance is created
const firebaseInstance = new FirebaseConfig();
export default firebaseInstance;