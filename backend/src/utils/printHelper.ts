// utils/printHelper.ts or .js
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

export async function printPdf(pdfPath: string): Promise<void> {
    const platform = process.platform;

    try {
        if (platform === 'win32') {
            // Windows: use Adobe Reader or other installed tool
            await execPromise(`START /MIN /WAIT AcroRd32.exe /t "${pdfPath}"`);
        } else if (platform === 'linux' || platform === 'darwin') {
            // ✅ macOS and Linux: use `lp` command
            await execPromise(`lp "${pdfPath}"`);
        } else {
            throw new Error(`Operating System not supported: ${platform}`);
        }

        console.log(`Print job sent successfully for ${pdfPath}`);
    } catch (error: unknown) {
        if (error instanceof Error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
            console.log('Error occurred')
        } else {
            console.error('Error accessing permits directory:', error);
        
        }
    }       
}
