import { masters } from "../../../src/index.js";
import { spawn } from "child_process";

function copyToClipboard(text) {
    const platform = process.platform;
    let proc;

    if (platform === 'darwin') {
        // macOS
        proc = spawn('pbcopy');
    } else if (platform === 'win32') {
        // Windows
        proc = spawn('clip');
    } else if (platform === 'linux') {
        // Linux (requires xclip to be installed: sudo apt install xclip)
        proc = spawn('xclip', ['-selection', 'clipboard']);
    } else {
        throw new Error(`Unsupported platform: ${platform}`);
    }

    proc.stdin.write(text);
    proc.stdin.end();
}

// // Example usage
// copyToClipboard('Hello directly from native Node.js!');

const uom = await masters.get("mani9", "uom");
console.log("company", JSON.stringify(uom, null, 2));

// copyToClipboard(JSON.stringify(uom));
