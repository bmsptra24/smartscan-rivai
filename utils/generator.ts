import { TCollections, db } from "@/constants/Firebase";
import { collection, doc } from "firebase/firestore";

/**
 * @returns {string} AN ID FIRESTORE string
 */
export function generateID(collectionName: TCollections): string {
  const newDocRef = doc(collection(db, collectionName));

  // ID unik yang dihasilkan oleh Firestore
  const generatedId = newDocRef.id;
  return generatedId;
}