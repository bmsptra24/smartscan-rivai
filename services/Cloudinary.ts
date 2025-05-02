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
    private cloudinary: Cloudinary;
    private api_key: string;
    private api_secret: string;
    private upload_preset: string;

    constructor() {
        const cloud_name = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME || '';
        this.api_key = process.env.EXPO_PUBLIC_CLOUDINARY_API_KEY || '';
        this.api_secret = process.env.EXPO_PUBLIC_CLOUDINARY_API_SECRET || '';
        this.upload_preset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '';

        if (!cloud_name || !this.api_key || !this.api_secret || !this.upload_preset) {
            throw new Error('Konfigurasi Cloudinary tidak lengkap');
        }

        this.cloudinary = new Cloudinary({
            cloud: {
                cloudName: cloud_name
            }
        });
    }

    private async postToCloudinary(path: string, formData: FormData): Promise<any> {
        const config = this.cloudinary.getConfig();
        if (!config.cloud) throw new Error('Cloudinary config not found');
        const url = `https://api.cloudinary.com/v1_1/${config.cloud.cloudName || ''}/${path}`;
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
        if (!config.cloud) throw new Error('Cloudinary config not found');
        const url = `https://api.cloudinary.com/v1_1/${config.cloud.cloudName}${path}`;
        const auth = btoa(`${this.api_key}:${this.api_secret}`);
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${auth}`,
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

    private generateSignature(params: { [key: string]: string }): string {
        const sortedKeys = Object.keys(params).sort();
        const stringToSign = sortedKeys.map(key => `${key}=${params[key]}`).join('&') + this.api_secret;
        const hash = createHashSHA1(stringToSign);
        return hash;
    }

    public async addFile(url: string): Promise<CloudinaryAsset | undefined> {
        try {
            const timestamp = Math.floor(Date.now() / 1000).toString();
            const params = { public_id: timestamp };
            const signature = this.generateSignature(params);
            const formData = new FormData();
            const fileType = url.split('.').pop();
            formData.append('file', {
                uri: url,
                name: `image.${fileType}`,
                type: `image/${fileType}`,
            } as any);
            formData.append('api_key', this.api_key);
            formData.append('upload_preset', this.upload_preset);
            formData.append('timestamp', timestamp);
            formData.append('signature', signature);
            formData.append('quality', 'auto:low');

            const response = await this.postToCloudinary('image/upload', formData);

            return response;
        } catch (error) {
            console.error("Error uploading file to Cloudinary:", error);
            return undefined;
        }
    }

    public async deleteFile(id: string): Promise<void> {
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const params = { public_id: id, timestamp };
        const signature = this.generateSignature(params);
        const formData = new FormData();
        formData.append('public_id', id);
        formData.append('api_key', this.api_key);
        formData.append('upload_preset', this.upload_preset);
        formData.append('timestamp', timestamp);
        formData.append('signature', signature);
        formData.append('quality', 'auto:low');

        await this.postToCloudinary('image/destroy', formData);
    }

    public async editFile(id: string, tags: string[]): Promise<void> {
        const body = { public_ids: [id], tags: tags.join(',') };
        await this.adminPostToCloudinary('/resources/image/upload', body);
    }

    public async upsertFile(public_id: string, url: string): Promise<CloudinaryAsset> {
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const params = { public_id: public_id, overwrite: 'true', timestamp };
        const signature = this.generateSignature(params);
        const formData = new FormData();
        formData.append('file', url);
        formData.append('public_id', public_id);
        formData.append('overwrite', 'true');
        formData.append('api_key', this.api_key);
        formData.append('timestamp', timestamp);
        formData.append('signature', signature);
        formData.append('quality', 'auto:low');

        const response = await this.postToCloudinary('image/upload', formData);
        return response;
    }
}

export const cloudinaryService = new CloudinaryService();