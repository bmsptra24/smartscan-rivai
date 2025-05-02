// import * as ImageManipulator from 'expo-image-manipulator';

// const getFileSize = async (uri: string): Promise<number> => {
//     try {
//         const response = await fetch(uri);
//         const blob = await response.blob();
//         return blob.size;
//     } catch (error) {
//         console.error('Error getting file size:', error);
//         return 0;
//     }
// };

// // Fungsi untuk mengompresi gambar
// const compressImage = async (imageUri: string, compressQuality: number = 0.5): Promise<string | null> => {
//     try {
//         const manipulatedImage = await ImageManipulator.manipulateAsync(
//             imageUri,
//             [{ resize: { width: 800 } }], // Mengubah ukuran gambar (lebar 800px, tinggi otomatis)
//             { compress: compressQuality, format: ImageManipulator.SaveFormat.JPEG }
//         );

//         // Cek ukuran file
//         const fileSize = await getFileSize(manipulatedImage.uri);
//         if (fileSize > 500 * 1024) {
//             // Jika masih lebih dari 500 KB, coba dengan kualitas lebih rendah
//             return compressImage(imageUri, compressQuality - 0.1); // Kurangi kualitas secara bertahap
//         }

//         return manipulatedImage.uri;
//     } catch (error) {
//         console.error('Error compressing image:', error);
//         return null;
//     }
// };