import { NodeSSH }from "node-ssh";
const ssh = new NodeSSH();
import dotenv from "dotenv";
dotenv.config();

async function restart() {
    try {
        console.log("🔐 Connecting via SSH...");
        await ssh.connect({
            host: process.env.SSH_HOST,
            username: process.env.SSH_USER,
            password: process.env.SSH_PASS
            // You can use privateKey instead of password if needed
        });

        console.log("🚀 Running remote commands...");
        const result = await ssh.execCommand(process.env.SSH_COMMANDS);
        console.log("📦 STDOUT:", result.stdout);
        console.log("⚠️ STDERR:", result.stderr);
    } catch (err) {
        console.error("❌ SSH command failed:", err);
    }

    ssh.dispose();
}

export default restart;
