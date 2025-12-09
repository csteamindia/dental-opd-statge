import upload from "./ftp-upload.js";
import restart from "./ssh-restart.js";

(async () => {
    console.log("🛠 Starting deployment...");
    // await upload();
    await restart();
    console.log("✅ Deployment finished.");
})();
