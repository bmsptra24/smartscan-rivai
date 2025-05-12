import * as crypto from 'crypto';
import dotenv from 'dotenv';
import { createHashSHA1 } from './generator';
dotenv.config();

// Cloudinary Service Class
class CloudinaryService {
    private cloud_name: string;
    private api_key: string;
    private api_secret: string;

    constructor() {
        this.cloud_name = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME || '';
        this.api_key = process.env.EXPO_PUBLIC_CLOUDINARY_API_KEY || '';
        this.api_secret = process.env.EXPO_PUBLIC_CLOUDINARY_API_SECRET || '';

        console.log(this.cloud_name, this.api_key, this.api_secret);

        if (!this.cloud_name || !this.api_key || !this.api_secret) {
            throw new Error('Cloudinary configuration missing in environment variables');
        }
    }

    private generateSignature(params: Record<string, string>): string {
        const sortedKeys = Object.keys(params).sort();
        const stringToSign = sortedKeys.map(key => `${key}=${params[key]}`).join('&') + (process.env.EXPO_PUBLIC_CLOUDINARY_API_SECRET || '');
        return createHashSHA1(stringToSign);
    }

    private async postToCloudinary(path: string, formData: FormData): Promise<any> {
        const url = `https://api.cloudinary.com/v1_1/${this.cloud_name}/${path}`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Cloudinary API error: ${response.statusText}`);
            }

            const data = await response.json();
            if (data.error) {
                throw new Error(data.error.message);
            }
            return data;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to post to Cloudinary: ${error.message}`);
            } else {
                throw new Error('Failed to post to Cloudinary: An unknown error occurred');
            }
        }
    }

    async deleteFile(public_id: string): Promise<void> {
        try {
            const timestamp = Math.floor(Date.now() / 1000).toString();
            const params = { public_id, timestamp };
            const signature = this.generateSignature(params);

            const formData = new FormData();
            formData.append('public_id', public_id);
            formData.append('api_key', this.api_key);
            formData.append('timestamp', timestamp);
            formData.append('signature', signature);

            await this.postToCloudinary('image/destroy', formData);
        } catch (error) {
            console.error('Error deleting file from Cloudinary:', error);
            throw error;
        }
    }
}

export const cloudinaryService = new CloudinaryService();