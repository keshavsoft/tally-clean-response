import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export const getRootDir = (startDir) => {
    let cur = startDir;
    while (cur && !fs.existsSync(path.join(cur, "package.json"))) {
        const parent = path.dirname(cur);
        if (parent === cur) break;
        cur = parent;
    }
    return cur;
};

export const saveOutput = ({ callerFile, inData, inFileName }) => {
    const callerPath = callerFile.startsWith("file://") ? fileURLToPath(callerFile) : callerFile;
    const rootDir = getRootDir(path.dirname(callerPath));
    const testDir = path.join(rootDir, "Test");
    const relPath = path.relative(testDir, callerPath);
    const parsed = path.parse(relPath);
    const targetDir = path.join(rootDir, "Data", parsed.dir);
    const fileName = inFileName || `${parsed.name}.json`;
    const targetFilePath = path.join(targetDir, fileName);

    fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(targetFilePath, JSON.stringify(inData, null, 2));
    console.log(`Saved output to: ${targetFilePath}`);
    return targetFilePath;
};
