import * as ImageManipulator from 'expo-image-manipulator';

// Fungsi untuk mendapatkan ukuran file
const getFileSize = async (uri: string): Promise<number> => {
    try {
        const response = await fetch(uri);
        const blob = await response.blob();
        return blob.size;
    } catch (error) {
        console.error('Error getting file size:', error);
        return 0;
    }
};

// Fungsi untuk mengompresi gambar
export const compressImage = async (imageUri: string, compressQuality: number = 0.5): Promise<string | null> => {
    try {
        // Pastikan compressQuality berada dalam rentang 0 hingga 1
        const validQuality = Math.min(Math.max(compressQuality, 0.1), 1);
        // console.log(`Compressing image with quality: ${validQuality}`); // Logging untuk debugging

        const manipulatedImage = await ImageManipulator.manipulateAsync(
            imageUri,
            [{ resize: { width: 800 } }], // Mengubah ukuran gambar (lebar 800px, tinggi otomatis)
            { compress: validQuality, format: ImageManipulator.SaveFormat.JPEG }
        );

        // Cek ukuran file
        const fileSize = await getFileSize(manipulatedImage.uri);
        // console.log(`File size after compression: ${fileSize / 1024} KB`); // Logging untuk debugging

        if (fileSize > 500 * 1024 && validQuality > 0.1) {
            // Jika masih lebih dari 500 KB dan kualitas di atas 0.1, coba lagi dengan kualitas lebih rendah
            return compressImage(imageUri, validQuality - 0.1);
        }

        return manipulatedImage.uri;
    } catch (error) {
        console.error('Error compressing image:', error, `Quality: ${compressQuality}`);
        return null;
    }
};