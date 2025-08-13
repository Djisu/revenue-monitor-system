
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
            try {
                // First, check if there are too many jobs in the queue
                const { stdout } = await execPromise('lpstat -o | wc -l');
                const jobCount = parseInt(stdout.trim(), 10);
                
                // If there are too many jobs (more than 10), clear some jobs first
                if (jobCount > 10) {
                    console.log(`Print queue has ${jobCount} jobs. Clearing old jobs...`);
                    await execPromise('cancel -a');
                }
                
                // Now try to print
                await execPromise(`lp "${pdfPath}"`);
            } catch (lpError: unknown) {
                const error = lpError as { stderr?: string };
                if (error.stderr && error.stderr.includes('Too many active jobs')) {
                    console.log('Print queue is full. Clearing all jobs and retrying...');
                    await execPromise('cancel -a');
                    // Retry printing after clearing the queue
                    await execPromise(`lp "${pdfPath}"`);
                } else {
                    throw lpError; // Re-throw if it's a different error
                }
            }
        } else {
            throw new Error(`Operating System not supported: ${platform}`);
        }

        console.log(`Print job sent successfully for ${pdfPath}`);
    } catch (error: unknown) {
        if (error instanceof Error) {
            const nodeError = error as NodeJS.ErrnoException;
            
            if (nodeError.code === 'ENOENT') {
                console.log('Printer command not found. Make sure printing utilities are installed.');
            } else if ('stderr' in nodeError && typeof nodeError.stderr === 'string' && nodeError.stderr.includes('Too many active jobs')) {
                console.log('Print queue is full. Please clear some print jobs and try again.');
            } else {
                console.error(`Printing error: ${nodeError.message}`);
                if ('stderr' in nodeError && nodeError.stderr) {
                    console.error(`Details: ${nodeError.stderr}`);
                }
            }
        } else {
            console.error('Unknown printing error:', error);
        }
    }       
}

