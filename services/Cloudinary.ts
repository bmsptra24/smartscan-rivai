import { showAlert } from "@/utils/alert";
import { compressImage } from "@/utils/compresor";
import { createHashSHA1 } from "@/utils/generator";
import { Cloudinary } from "@cloudinary/url-gen";

export type CloudinaryAsset = {
    access_mode: string;
    asset_id: string;
    bytes: number;
    created_at: string;
    etag: string;
    folder: string;
    format: string;
    height: number;
    original_filename: string;
    placeholder: boolean;
    public_id: string;
    resource_type: string;
    secure_url: string;
    signature: string;
    tags: string[];
    type: string;
    url: string;
    version: number;
    version_id: string;
    width: number;
};

class CloudinaryService {
    private readonly cloudinary: Cloudinary;
    private readonly api_key: string;
    private readonly api_secret: string;
    private readonly upload_preset: string;

    private static readonly SUPPORTED_TYPES = ['jpg', 'jpeg', 'png', 'gif'];
    private static readonly MIME_TYPE_MAP: Record<string, string> = {
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        png: 'image/png',
        gif: 'image/gif',
    };
    private static readonly CLOUDINARY_URL_PREFIX = 'https://res.cloudinary.com/';

    constructor() {
        const cloud_name = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME || '';
        this.api_key = process.env.EXPO_PUBLIC_CLOUDINARY_API_KEY || '';
        this.api_secret = process.env.EXPO_PUBLIC_CLOUDINARY_API_SECRET || '';
        this.upload_preset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '';

        if (!cloud_name || !this.api_key || !this.api_secret || !this.upload_preset) {
            throw new Error('Incomplete Cloudinary configuration');
        }

        this.cloudinary = new Cloudinary({
            cloud: { cloudName: cloud_name },
        });
    }

    private async postToCloudinary(path: string, formData: FormData): Promise<any> {
        const config = this.cloudinary.getConfig();
        if (!config.cloud) {
            throw new Error('Cloudinary configuration not found');
        }

        const url = `https://api.cloudinary.com/v1_1/${config.cloud.cloudName}/${path}`;
        const response = await fetch(url, {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        if (data.error) {
            throw new Error(data.error.message);
        }
        return data;
    }

    private async adminPostToCloudinary(path: string, body: object): Promise<any> {
        const config = this.cloudinary.getConfig();
        if (!config.cloud) {
            throw new Error('Cloudinary configuration not found');
        }

        const url = `https://api.cloudinary.com/v1_1/${config.cloud.cloudName}${path}`;
        const auth = btoa(`${this.api_key}:${this.api_secret}`);
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Basic ${auth}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        if (data.error) {
            throw new Error(data.error.message);
        }
        return data;
    }

    private async adminGetFromCloudinary(path: string, params: Record<string, string> = {}): Promise<any> {
        const config = this.cloudinary.getConfig();
        if (!config.cloud) {
            throw new Error('Cloudinary configuration not found');
        }

        const queryString = Object.keys(params).length
            ? `?${Object.keys(params).map(key => `${key}=${encodeURIComponent(params[key])}`).join('&')}`
            : '';
        const url = `https://api.cloudinary.com/v1_1/${config.cloud.cloudName}${path}${queryString}`;
        const auth = btoa(`${this.api_key}:${this.api_secret}`);
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Basic ${auth}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        if (data.error) {
            throw new Error(data.error.message);
        }
        return data;
    }

    private generateSignature(params: Record<string, string>): string {
        const sortedKeys = Object.keys(params).sort();
        const stringToSign = sortedKeys.map(key => `${key}=${params[key]}`).join('&') + this.api_secret;
        return createHashSHA1(stringToSign);
    }

    private async prepareFileData(url: string): Promise<{ fileData: any; fileType: string } | null> {
        if (!url) {
            throw new Error('URL is empty');
        }

        if (url.startsWith(CloudinaryService.CLOUDINARY_URL_PREFIX)) {
            return null; // Skip jika sudah URL Cloudinary
        }

        let fileType: string;
        let fileData: any;
        let uriToUse = url;

        if (url.startsWith('file://') || url.startsWith('blob:')) {
            const compressedUri = await compressImage(url);
            if (!compressedUri) {
                throw new Error('Gagal mengompresi gambar');
            }
            uriToUse = compressedUri;
        }

        if (uriToUse.startsWith('file://')) {
            fileType = uriToUse.split('.').pop()?.toLowerCase() ?? '';
            if (!CloudinaryService.SUPPORTED_TYPES.includes(fileType)) {
                throw new Error(`Tipe file tidak didukung: ${fileType}. Tipe yang didukung: ${CloudinaryService.SUPPORTED_TYPES.join(', ')}`);
            }

            fileData = {
                uri: uriToUse,
                name: `image.${fileType}`,
                type: CloudinaryService.MIME_TYPE_MAP[fileType],
            };
        } else if (uriToUse.startsWith('blob:')) {
            const response = await fetch(uriToUse);
            const blob = await response.blob();
            fileType = blob.type.split('/')[1]?.toLowerCase() ?? 'jpg';
            if (!CloudinaryService.SUPPORTED_TYPES.includes(fileType)) {
                throw new Error(`Tipe file tidak didukung: ${fileType}. Tipe yang didukung: ${CloudinaryService.SUPPORTED_TYPES.join(', ')}`);
            }

            fileData = new File([blob], `image.${fileType}`, { type: CloudinaryService.MIME_TYPE_MAP[fileType] });
        } else {
            throw new Error('Format URL tidak didukung. Gunakan file:// atau blob:');
        }

        return { fileData, fileType };
    }

    public async addFile(url: string): Promise<CloudinaryAsset | undefined> {
        try {
            const fileDataResult = await this.prepareFileData(url);
            if (!fileDataResult) {
                console.warn('Skipping upload: URL is already a Cloudinary resource');
                return undefined;
            }

            const { fileData } = fileDataResult;
            const formData = new FormData();
            formData.append('file', fileData);
            formData.append('api_key', this.api_key);
            formData.append('upload_preset', this.upload_preset);
            formData.append('quality', 'auto:low');

            return await this.postToCloudinary('image/upload', formData);
        } catch (error) {
            console.error('Error uploading file to Cloudinary:', error);
            return undefined;
        }
    }

    public async deleteFile(public_id: string): Promise<void> {
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const params = { public_id, timestamp };
        const signature = this.generateSignature(params);

        const formData = new FormData();
        formData.append('public_id', public_id);
        formData.append('api_key', this.api_key);
        formData.append('timestamp', timestamp);
        formData.append('signature', signature);

        await this.postToCloudinary('image/destroy', formData);
    }

    public async editFile(public_id: string, tags: string[]): Promise<void> {
        const body = { public_ids: [public_id], tags: tags.join(',') };
        await this.adminPostToCloudinary('/resources/image/tags', body);
    }

    public async upsertFile(public_id: string, url: string): Promise<CloudinaryAsset> {
        try {
            const fileDataResult = await this.prepareFileData(url);
            if (!fileDataResult) {
                console.warn('Skipping upload: URL is already a Cloudinary resource');
                return {
                    access_mode: 'public',
                    asset_id: '',
                    bytes: 0,
                    created_at: new Date().toISOString(),
                    etag: '',
                    folder: '',
                    format: url.split('.').pop()?.toLowerCase() || 'jpg',
                    height: 0,
                    original_filename: '',
                    placeholder: false,
                    public_id,
                    resource_type: 'image',
                    secure_url: url,
                    signature: '',
                    tags: [],
                    type: 'upload',
                    url,
                    version: 0,
                    version_id: '',
                    width: 0,
                };
            }

            const { fileData } = fileDataResult;
            const timestamp = Math.floor(Date.now() / 1000).toString();
            const params = { public_id, overwrite: 'true', timestamp };
            const signature = this.generateSignature(params);

            const formData = new FormData();
            formData.append('file', fileData);
            formData.append('public_id', public_id);
            formData.append('overwrite', 'true');
            formData.append('api_key', this.api_key);
            formData.append('timestamp', timestamp);
            formData.append('signature', signature);
            formData.append('quality', 'auto:low');

            return await this.postToCloudinary('image/upload', formData);
        } catch (error) {
            console.error('Error upserting file to Cloudinary:', error);
            throw error;
        }
    }
}

export const cloudinaryService = new CloudinaryService();