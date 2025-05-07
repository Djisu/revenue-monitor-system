import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
// Ensure the permits directory exists
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const permitDir = path.join(__dirname, 'permits');
const fsPromises = fs.promises;
async function ensurePermitDirIsEmpty() {
    try {
        // Check if the directory exists
        await fsPromises.access(permitDir);
        console.log('Permits directory already exists:', permitDir);
        // Read all files and subdirectories in the directory
        const files = await fsPromises.readdir(permitDir);
        // Remove all files and subdirectories
        for (const file of files) {
            const filePath = path.join(permitDir, file);
            const stat = await fsPromises.lstat(filePath);
            if (stat.isDirectory()) {
                // Recursively remove subdirectories
                await fsPromises.rm(filePath, { recursive: true, force: true });
            }
            else {
                // Remove files
                await fsPromises.unlink(filePath);
            }
        }
        console.log('Permits directory emptied:', permitDir);
    }
    catch (error) {
        if (error instanceof Error && error.code === 'ENOENT') {
            // Directory does not exist, create it
            await fsPromises.mkdir(permitDir, { recursive: true });
            console.log('Created permits directory:', permitDir);
        }
        else {
            console.error('Error accessing permits directory:', error);
        }
    }
}
export default ensurePermitDirIsEmpty;
//# sourceMappingURL=ensurePermitDirIsEmpty.js.map