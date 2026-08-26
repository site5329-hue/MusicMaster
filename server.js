const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, "public");

const server = http.createServer((req, res) => {
    let filePath = req.url === "/"
        ? path.join(PUBLIC_DIR, "index.html")
        : path.join(PUBLIC_DIR, req.url);

    // جلوگیری از دسترسی به مسیرهای خارج از public
    filePath = path.normalize(filePath);

    if (!filePath.startsWith(PUBLIC_DIR)) {
        res.writeHead(403);
        res.end("Forbidden");
        return;
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, {
                "Content-Type": "text/plain; charset=utf-8"
            });
            res.end("404 - File not found");
            return;
        }

        const ext = path.extname(filePath).toLowerCase();

        const types = {
            ".html": "text/html; charset=utf-8",
            ".css": "text/css; charset=utf-8",
            ".js": "text/javascript; charset=utf-8",
            ".json": "application/json; charset=utf-8",
            ".png": "image/png",
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".svg": "image/svg+xml",
            ".ico": "image/x-icon"
        };

        res.writeHead(200, {
            "Content-Type": types[ext] || "application/octet-stream"
        });

        res.end(data);
    });
});

server.listen(PORT, "0.0.0.0", () => {
    console.log("================================");
    console.log("Music Master Server");
    console.log("Server is running!");
    console.log(`Port: ${PORT}`);
    console.log("================================");
});