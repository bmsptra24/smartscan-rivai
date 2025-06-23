import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    serverTimestamp,
    Timestamp,
    FirestoreDataConverter,
    QueryDocumentSnapshot,
    SnapshotOptions,
    DocumentData,
    WithFieldValue,
    collection,
    query,
    where,
    getDocs,
    DocumentReference,
    deleteDoc
} from 'firebase/firestore';
import { storage } from '@/constants/MKKV';
import firebaseInstance from './Firebase';
import { groupService } from '.';

// Define user profile types
export interface UserProfile {
    id: string;
    displayName?: string;
    username?: string;
    password?: string;
    createdAt?: Date | Timestamp;
    updatedAt?: Date | Timestamp;
    role?: 'pegawai' | 'pengelola' | 'admin';
}

// Type for creating a new user profile
export type CreateUserProfileData = Omit<UserProfile, 'updatedAt'>;

// Type for updating an existing user profile
export type UpdateUserProfileData = Partial<Omit<UserProfile, 'id' | 'createdAt'>>;

// Firestore converter for UserProfile type
const userProfileConverter: FirestoreDataConverter<UserProfile> = {
    toFirestore(userProfile: WithFieldValue<UserProfile>): DocumentData {
        const data: Record<string, any> = {
            displayName: userProfile.displayName,
            username: userProfile.username,
            password: userProfile.password,
            updatedAt: serverTimestamp(),
            role: userProfile.role || 'user',
        };

        // Only add createdAt if it exists
        if (userProfile.createdAt) {
            data.createdAt = userProfile.createdAt instanceof Date
                ? Timestamp.fromDate(userProfile.createdAt)
                : userProfile.createdAt;
        }

        return data;
    },
    fromFirestore(
        snapshot: QueryDocumentSnapshot<DocumentData>,
        options?: SnapshotOptions
    ): UserProfile {
        const data = snapshot.data(options);
        return {
            id: snapshot.id,
            displayName: data.displayName,
            username: data.username,
            password: data.password,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            role: data.role || 'user',
        };
    }
};

class UserService {
    private db: ReturnType<typeof firebaseInstance.getFirestoreInstance>;
    private collectionName: string;

    constructor() {
        this.db = firebaseInstance.getFirestoreInstance();
        this.collectionName = 'users';
    }

    /**
     * Get current user data
     * @returns UserProfile or null
     */
    public getCurrentUser(): UserProfile | null {
        const userDataString = storage.getString('userData');
        const userData: UserProfile | null = userDataString ? JSON.parse(userDataString) : null;

        return userData;
    }

    // /**
    //  * Clear current user data from local storage
    //  */
    // public clearCurrentUser(): void {
    //     storage.delete('userData');
    // }

    /**
     * Get all user profiles
     * @returns Promise with an array of user profiles
     */
    public async getAllUsers(): Promise<UserProfile[]> {
        try {
            const usersCollection = collection(this.db, this.collectionName).withConverter(userProfileConverter);
            const querySnapshot = await getDocs(usersCollection);

            return querySnapshot.docs.map(doc => doc.data());
        } catch (error) {
            throw new Error(`Error getting all users: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * Create or update user profile
     * @param userId Optional User ID. If not provided, a new ID will be generated.
     * @param userData User profile data
     * @returns Promise with the user profile
     */
    public async upsertUserProfile(userId: string | undefined, userData: CreateUserProfileData): Promise<UserProfile> {
        try {
            const id = userId || doc(collection(this.db, this.collectionName)).id; // Generate a new ID if not provided
            const userRef = doc(this.db, this.collectionName, id).withConverter(userProfileConverter);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                // Update existing user
                const updateData: UpdateUserProfileData = {
                    ...userData,
                    updatedAt: serverTimestamp() as Timestamp
                };

                // Convert Date objects to Firestore Timestamps
                Object.entries(updateData).forEach(([key, value]) => {
                    if (value instanceof Date) {
                        (updateData as Record<string, any>)[key] = Timestamp.fromDate(value);
                    }
                });

                await updateDoc(userRef, updateData as Record<string, any>);
            } else {
                // Create new user
                const newUserData: UserProfile = {
                    ...userData,
                    id: id,
                    createdAt: userData.createdAt || serverTimestamp() as Timestamp,
                    updatedAt: serverTimestamp() as Timestamp
                };

                await setDoc(userRef, newUserData);
            }

            // Fetch and return the updated user profile
            const userProfile = await this.getUserProfile(id);
            if (!userProfile) {
                throw new Error(`User profile with ID ${id} not found`);
            }
            return userProfile;
        } catch (error) {
            throw new Error(`Error setting user profile: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * Get user profile
     * @param userId User ID to retrieve
     * @returns Promise with the user profile or null if not found
     */
    public async getUserProfile(userId: string): Promise<UserProfile | null> {
        try {
            const userRef = doc(this.db, this.collectionName, userId).withConverter(userProfileConverter);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                return userSnap.data();
            } else {
                return null;
            }
        } catch (error) {
            throw new Error(`Error getting user profile: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    // /**
    //  * Update user profile
    //  * @param userId User ID to update
    //  * @param userData Data to update
    //  * @returns Promise with the updated user profile
    //  */
    // public async updateUserProfile(userId: string, userData: UpdateUserProfileData): Promise<UserProfile> {
    //     try {
    //         const userRef = doc(this.db, this.collectionName, userId).withConverter(userProfileConverter);

    //         // Prepare update data with server timestamp
    //         const updateData: Record<string, any> = {
    //             ...userData,
    //             updatedAt: serverTimestamp()
    //         };

    //         // Convert Date objects to Firestore Timestamps
    //         Object.entries(updateData).forEach(([key, value]) => {
    //             if (value instanceof Date) {
    //                 updateData[key] = Timestamp.fromDate(value);
    //             }
    //         });

    //         await updateDoc(userRef, updateData);

    //         // Fetch and return the updated user profile
    //         const updatedProfile = await this.getUserProfile(userId);
    //         if (!updatedProfile) {
    //             throw new Error(`User profile with ID ${userId} not found after update`);
    //         }
    //         return updatedProfile;
    //     } catch (error) {
    //         throw new Error(`Error updating user profile: ${error instanceof Error ? error.message : String(error)}`);
    //     }
    // }

    // /**
    //  * Update user's last login time
    //  * @param userId User ID to update
    //  * @returns Promise with the updated user profile
    //  */
    // public async updateLastLogin(userId: string): Promise<UserProfile> {
    //     try {
    //         const userRef = doc(this.db, this.collectionName, userId).withConverter(userProfileConverter);

    //         const updateData = {
    //             lastLogin: serverTimestamp(),
    //             updatedAt: serverTimestamp()
    //         };

    //         await updateDoc(userRef, updateData);

    //         // Fetch and return the updated user profile
    //         const updatedProfile = await this.getUserProfile(userId);
    //         if (!updatedProfile) {
    //             throw new Error(`User profile with ID ${userId} not found after update`);
    //         }
    //         return updatedProfile;
    //     } catch (error) {
    //         throw new Error(`Error updating last login: ${error instanceof Error ? error.message : String(error)}`);
    //     }
    // }

    // /**
    //  * Get user by username
    //  * @param username Email to search for
    //  * @returns Promise with the user profile or null if not found
    //  */
    // public async getUserByEmail(username: string): Promise<UserProfile | null> {
    //     try {
    //         const q = query(
    //             collection(this.db, this.collectionName).withConverter(userProfileConverter),
    //             where('username', '==', username)
    //         );

    //         const querySnapshot = await getDocs(q);

    //         if (!querySnapshot.empty) {
    //             return querySnapshot.docs[0].data();
    //         } else {
    //             return null;
    //         }
    //     } catch (error) {
    //         throw new Error(`Error getting user by username: ${error instanceof Error ? error.message : String(error)}`);
    //     }
    // }

    // /**
    //  * Get user reference
    //  * @param userId User ID to get reference for
    //  * @returns User reference
    //  */
    // public getUserRef(userId: string): DocumentReference<UserProfile> {
    //     return doc(this.db, this.collectionName, userId).withConverter(userProfileConverter);
    // }


    /**
     * Delete user profile
     * @param userId User ID to delete
     * @returns Promise<void>
     */
    public async deleteUser(userId: string): Promise<boolean> {
        try {
            // If user has data, cancel the process
            const groupData = await groupService.getGroupsByCreator(userId);
            if (groupData.length > 0) throw new Error("User has some data in this app, can't delete it.");

            const userRef = doc(this.db, this.collectionName, userId).withConverter(userProfileConverter);
            await deleteDoc(userRef);
            return true;
        } catch (error) {
            console.error(`Error deleting user profile: ${error instanceof Error ? error.message : String(error)}`);
            return false;
        }
    }
}

export default UserService;