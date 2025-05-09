import { storage } from "@/constants/MKKV";


class SystemService {
    // Method untuk logout
    getPath() {
        return storage.getString('storagePath');
    }

    setPath(path: string) {
        return storage.set('storagePath', path);
    }
}

// Export instance dari SystemService
export default SystemService 