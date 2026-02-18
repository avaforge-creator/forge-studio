// Simple async exec wrapper for Node.js child_process
export function exec(
  command: string, 
  callback: (error: Error | null, stdout: string, stderr: string) => void
): void {
  const { exec } = require('child_process');
  exec(command, { maxBuffer: 10 * 1024 * 1024 }, (err: Error | null, stdout: string, stderr: string) => {
    callback(err, stdout, stderr);
  });
}

// Alternative: use require in-place if exec not available
// This is handled at runtime in the browser via the exec function
