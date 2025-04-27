// Storage service for handling file uploads using Cloudinary

// Type definitions for Cloudinary responses and parameters
interface CloudinaryConfig {
    cloudName: string;
    apiKey: string;
    apiSecret: string;
    uploadPreset?: string;
    baseUrl: string;
}

interface CloudinaryUploadResult {
    publicId: string;
    url: string;
    format: string;
    width: number;
    height: number;
    resourceType: string;
    createdAt: string;
}

interface CloudinaryFileDetails {
    public_id: string;
    secure_url: string;
    format: string;
    width: number;
    height: number;
    bytes: number;
    resource_type: string;
    created_at: string;
    tags: string[];
    [key: string]: any; // For other properties that might be returned
}

interface CloudinaryListResult {
    resources: CloudinaryResource[];
    next_cursor?: string;
    rate_limit_allowed?: number;
    rate_limit_remaining?: number;
    rate_limit_reset_at?: string;
}

interface CloudinaryResource {
    public_id: string;
    secure_url: string;
    format: string;
    width: number;
    height: number;
    bytes: number;
    created_at: string;
    [key: string]: any; // For other properties
}

interface CloudinaryArchiveResult {
    url: string;
    publicId: string;
    fileSize: number;
}

interface FileInfo {
    name: string;
    type: string;
    size: number;
}

interface TransformationOptions {
    width?: number;
    height?: number;
    crop?: string;
    gravity?: string;
    quality?: number;
    format?: string;
    [key: string]: any; // For other transformation options
}

interface ListOptions {
    max_results?: number;
    next_cursor?: string;
    prefix?: string;
    type?: string;
    [key: string]: any; // For other options
}

interface ArchiveOptions {
    resource_type?: string;
    target_format?: string;
    target_public_id?: string;
    flatten_folders?: boolean;
    flatten_transformations?: boolean;
    use_original_filename?: boolean;
    async?: boolean;
    mode?: string;
    allow_missing?: boolean;
    [key: string]: any; // For other options
}

class StorageService {
    private config: CloudinaryConfig;

    constructor() {
        // Cloudinary configuration
        this.config = {
            cloudName: "YOUR_CLOUD_NAME",
            apiKey: "YOUR_API_KEY",
            apiSecret: "YOUR_API_SECRET",
            uploadPreset: "YOUR_UPLOAD_PRESET", // Optional: for unsigned uploads
            baseUrl: `https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME`
        };

        // Update the baseUrl with the actual cloud name
        this.config.baseUrl = `https://api.cloudinary.com/v1_1/${this.config.cloudName}`;
    }

    // Generate authentication signature for signed uploads
    private _generateSignature(timestamp: number, paramsToSign: Record<string, any> = {}): string {
        // In a real implementation, you would need to generate this on your backend
        // This is a placeholder as signature generation requires the API secret
        // and should not be done on the client side for security reasons

        // For React Native, you would typically:
        // 1. Call your backend API to generate the signature
        // 2. Return the signature to use in the upload

        // Example of what your backend would do:
        // const stringToSign = Object.entries({...paramsToSign, timestamp})
        //   .sort()
        //   .map(([key, value]) => `${key}=${value}`)
        //   .join('&') + this.config.apiSecret;
        // return crypto.createHash('sha1').update(stringToSign).digest('hex');

        // For this example, we'll assume you have a backend endpoint:
        return "generated_signature_from_backend";
    }

    // Upload a file to Cloudinary
    public async uploadFile(file: Blob | File, folder: string = "documents"): Promise<CloudinaryUploadResult> {
        try {
            // Create form data for the upload
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', this.config.uploadPreset || ''); // For unsigned uploads
            formData.append('folder', folder);

            // For signed uploads (more secure)
            const timestamp = Math.floor(Date.now() / 1000);
            formData.append('timestamp', timestamp.toString());
            formData.append('api_key', this.config.apiKey);

            // You would get this from your backend in a real implementation
            // formData.append('signature', this._generateSignature(timestamp, {folder}));

            // Make the upload request
            const response = await fetch(`${this.config.baseUrl}/image/upload`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Cloudinary upload failed: ${errorData.error?.message || 'Unknown error'}`);
            }

            const data = await response.json();

            return {
                publicId: data.public_id,
                url: data.secure_url,
                format: data.format,
                width: data.width,
                height: data.height,
                resourceType: data.resource_type,
                createdAt: data.created_at
            };
        } catch (error) {
            throw new Error(`Error uploading file: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    // Get file details from Cloudinary
    public async getFileDetails(publicId: string): Promise<CloudinaryFileDetails> {
        try {
            const timestamp = Math.floor(Date.now() / 1000);
            const signature = this._generateSignature(timestamp, { public_id: publicId });

            const response = await fetch(`${this.config.baseUrl}/resources/image/upload/${publicId}?api_key=${this.config.apiKey}&timestamp=${timestamp}&signature=${signature}`, {
                method: 'GET'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to get file details: ${errorData.error?.message || 'Unknown error'}`);
            }

            return await response.json();
        } catch (error) {
            throw new Error(`Error getting file details: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    // Get file URL with optional transformations
    public getFileUrl(publicId: string, options: TransformationOptions = {}): string {
        // Construct the URL with transformations if needed
        let transformations = '';

        if (options.width || options.height) {
            transformations += options.crop || 'c_fill';
            if (options.width) transformations += `,w_${options.width}`;
            if (options.height) transformations += `,h_${options.height}`;

            // Add other transformations if provided
            if (options.gravity) transformations += `,g_${options.gravity}`;
            if (options.quality) transformations += `,q_${options.quality}`;
            if (options.format) transformations += `,f_${options.format}`;

            transformations += '/';
        }

        return `https://res.cloudinary.com/${this.config.cloudName}/image/upload/${transformations}${publicId}`;
    }

    // Delete a file from Cloudinary
    public async deleteFile(publicId: string): Promise<boolean> {
        try {
            const timestamp = Math.floor(Date.now() / 1000);
            const signature = this._generateSignature(timestamp, { public_id: publicId });

            const formData = new FormData();
            formData.append('public_id', publicId);
            formData.append('api_key', this.config.apiKey);
            formData.append('timestamp', timestamp.toString());
            formData.append('signature', signature);

            const response = await fetch(`${this.config.baseUrl}/resources/image/destroy`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to delete file: ${errorData.error?.message || 'Unknown error'}`);
            }

            const result = await response.json();
            return result.result === 'ok';
        } catch (error) {
            throw new Error(`Error deleting file: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    // List all files in a folder
    public async listFiles(folder: string = "documents", options: ListOptions = { max_results: 100 }): Promise<CloudinaryResource[]> {
        try {
            const timestamp = Math.floor(Date.now() / 1000);
            const signatureParams: Record<string, any> = {
                folder,
                max_results: options.max_results
            };

            // Add other options to signature params
            if (options.next_cursor) signatureParams.next_cursor = options.next_cursor;
            if (options.prefix) signatureParams.prefix = options.prefix;
            if (options.type) signatureParams.type = options.type;

            const signature = this._generateSignature(timestamp, signatureParams);

            // Build query parameters
            const queryParams = new URLSearchParams(
                Object.entries({
                    api_key: this.config.apiKey,
                    timestamp: timestamp.toString(),
                    signature,
                    folder,
                    ...options
                }).reduce((acc, [key, value]) => {
                    if (value !== undefined) {
                        acc[key] = String(value);
                    }
                    return acc;
                }, {} as Record<string, string>)
            );

            const response = await fetch(`${this.config.baseUrl}/resources/image/upload?${queryParams.toString()}`, {
                method: 'GET'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to list files: ${errorData.error?.message || 'Unknown error'}`);
            }

            const data: CloudinaryListResult = await response.json();

            return data.resources.map(resource => ({
                public_id: resource.public_id,
                secure_url: resource.secure_url,
                format: resource.format,
                width: resource.width,
                height: resource.height,
                bytes: resource.bytes,
                created_at: resource.created_at
            }));
        } catch (error) {
            throw new Error(`Error listing files: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    // Create a zip archive of multiple files
    public async createArchive(publicIds: string[], options: ArchiveOptions = { resource_type: 'image' }): Promise<CloudinaryArchiveResult> {
        try {
            const timestamp = Math.floor(Date.now() / 1000);
            const signature = this._generateSignature(timestamp, {
                public_ids: publicIds,
                ...options
            });

            const formData = new FormData();
            formData.append('api_key', this.config.apiKey);
            formData.append('timestamp', timestamp.toString());
            formData.append('signature', signature);

            // Add all public IDs
            publicIds.forEach(id => {
                formData.append('public_ids[]', id);
            });

            // Add any additional options
            Object.entries(options).forEach(([key, value]) => {
                if (value !== undefined) {
                    formData.append(key, value.toString());
                }
            });

            const response = await fetch(`${this.config.baseUrl}/resources/generate_archive`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to create archive: ${errorData.error?.message || 'Unknown error'}`);
            }

            const data = await response.json();
            return {
                url: data.secure_url,
                publicId: data.public_id,
                fileSize: data.bytes
            };
        } catch (error) {
            throw new Error(`Error creating archive: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    // Upload a file directly from a device camera or gallery
    public async uploadFromUri(uri: string, folder: string = "documents"): Promise<CloudinaryUploadResult> {
        try {
            // For React Native, we need to get the actual file from the URI
            // This might require additional handling depending on your setup

            // Example approach:
            // 1. Get file info from the URI
            const fileInfo = await this._getFileInfoFromUri(uri);

            // 2. Create a file object or blob from the URI
            const fileBlob = await this._createBlobFromUri(uri);

            // 3. Upload the file using the standard upload method
            return await this.uploadFile(fileBlob, folder);
        } catch (error) {
            throw new Error(`Error uploading from URI: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    // Helper method to get file info from URI (implementation depends on your React Native setup)
    private async _getFileInfoFromUri(uri: string): Promise<FileInfo> {
        // This is a placeholder - actual implementation depends on your React Native setup
        // You might use react-native-fs or other libraries to get file info

        // Example structure of what this might return:
        return {
            name: uri.split('/').pop() || 'unknown',
            type: uri.endsWith('.jpg') ? 'image/jpeg' :
                uri.endsWith('.png') ? 'image/png' :
                    'application/octet-stream',
            size: 0 // You would get the actual size
        };
    }

    // Helper method to create a blob from URI (implementation depends on your React Native setup)
    private async _createBlobFromUri(uri: string): Promise<Blob> {
        // This is a placeholder - actual implementation depends on your React Native setup

        // In React Native, you might use fetch to get the file as a blob:
        const response = await fetch(uri);
        const blob = await response.blob();

        // Or you might use react-native-fs to read the file and create a blob

        return blob;
    }
}

export default StorageService;