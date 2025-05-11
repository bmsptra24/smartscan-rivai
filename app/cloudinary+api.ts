import { cloudinaryService } from '@/services/Cloudinary';

export async function DELETE(request: Request) {
    try {
        // Extract public_id from query parameters or request body
        const url = new URL(request.url);
        const public_id = url.searchParams.get('public_id');

        // Validate public_id
        if (!public_id) {
            return new Response('Missing public_id parameter', {
                status: 400,
                headers: { 'Content-Type': 'text/plain' },
            });
        }

        // Call CloudinaryService to delete the file
        await cloudinaryService.deleteFile(public_id);

        // Return success response
        return Response.json({ message: `Resource with public_id ${public_id} deleted successfully` });
    } catch (error: any) {
        console.error('API route error:', error);

        // Handle specific errors
        if (error.message.includes('not found')) {
            return new Response(`Resource with public_id not found`, {
                status: 404,
                headers: { 'Content-Type': 'text/plain' },
            });
        }

        // Generic error response
        return new Response(JSON.stringify({ message: 'Failed to delete resource', error }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}