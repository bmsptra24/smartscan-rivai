import { MMKV } from 'react-native-mmkv';
import { Platform } from 'react-native';

let storage;

if (Platform.OS === 'web') {
    // Initialize MMKV without encryptionKey for web
    storage = new MMKV({
        id: 'smartscan-rivai',
    });
} else {
    // Initialize MMKV with encryptionKey for native platforms
    storage = new MMKV({
        id: 'smartscan-rivai',
        encryptionKey: "bmsptra24",
    });
}

export { storage };