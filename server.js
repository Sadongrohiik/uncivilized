import { existsSync } from 'fs';
import { join, extname } from 'path';

const PORT = process.env.PORT || 3000;
const PUBLIC_FOLDER = process.cwd(); // Serve from the root directory

console.log(`Starting server on port ${PORT}, serving from ${PUBLIC_FOLDER}`);

Bun.serve({
    port: PORT,
    async fetch(req) {
        const url = new URL(req.url);
        let filePath = join(PUBLIC_FOLDER, url.pathname);

        // If requesting root, serve index.html
        if (url.pathname === '/' || url.pathname === '') {
            filePath = join(PUBLIC_FOLDER, 'index.html');
        }

        try {
            const fileExists = existsSync(filePath);
            if (fileExists) {
                const file = Bun.file(filePath);
                let contentType = 'text/plain'; // Default content type

                const extension = extname(filePath).toLowerCase();
                if (extension === '.html') {
                    contentType = 'text/html; charset=utf-8';
                } else if (extension === '.js') {
                    contentType = 'application/javascript; charset=utf-8';
                } else if (extension === '.css') {
                    contentType = 'text/css; charset=utf-8';
                } else if (extension === '.json') {
                    contentType = 'application/json; charset=utf-8';
                } else if (extension === '.png') {
                    contentType = 'image/png';
                } else if (extension === '.jpg' || extension === '.jpeg') {
                    contentType = 'image/jpeg';
                } else if (extension === '.glb') {
                    contentType = 'model/gltf-binary';
                } else if (extension === '.gltf') {
                    contentType = 'model/gltf+json';
                }
                // Add more MIME types as needed for your assets

                return new Response(file, {
                    headers: { 'Content-Type': contentType }
                });
            } else {
                console.warn(`File not found: ${filePath} (requested ${url.pathname})`);
                return new Response('Not Found', { status: 404 });
            }
        } catch (error) {
            console.error(`Error serving ${filePath}:`, error);
            return new Response('Internal Server Error', { status: 500 });
        }
    },
    error(error) {
        console.error("Server error:", error);
        return new Response("Internal Server Error", { status: 500 });
    },
});

console.log(`Bun server running at http://localhost:${PORT}`);
