import * as ftp from "basic-ftp";
import dotenv from "dotenv";
dotenv.config();
import fs from "fs";

async function upload() {
    const client = new ftp.Client();
    client.ftp.verbose = true;

    try {
        await client.access({
            host: process.env.FTP_HOST,
            user: process.env.FTP_USER,
            password: process.env.FTP_PASS,
            secure: false
        });

        const items = fs.readdirSync("./").filter(item => item !== "node_modules");

        console.log(items)

        for (const item of items) {
            try {
                const stats = fs.statSync(item);
                if (stats.isDirectory()) {
                    await client.uploadFromDir(`./${item}`, `${process.env.FTP_REMOTE_PATH}/${item}`);
                } else {
                    await client.uploadFrom(`./${item}`, `${process.env.FTP_REMOTE_PATH}/${item}`);
                }
                console.log(`✅ Uploaded: ${item}`);
            } catch (uploadError) {
                console.warn(`⚠️ Failed to upload ${item}:`, uploadError.message);
                continue; // Continue with next file even if current one fails
            }
        }

        console.log("✅ FTP upload completed.");
    } catch (err) {
        console.error("❌ FTP upload failed:", err);
    }

    client.close();
}

export default upload;
