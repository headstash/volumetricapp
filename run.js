import { exec } from 'child_process';
import dedent from 'dedent';
import { promisify } from 'util';

const execAsync = promisify(exec);

function escapeString(str) {
    return str
    .replace(/`/g, '``')
    // .replace(/"/g, '`"')
    .replace(/\\$/g, '`$')
    .replace(/@/g, '`@');
}

function powershell(command) {
  // Powershell command to execute
  return execAsync(`powershell.exe -Command "${escapeString(dedent(command))}"`);
}

function run() {
  const isWindows = process.platform === 'win32';
  const isLinux = process.platform === 'linux';
  const isMac = process.platform === 'darwin';
  const isWsl = process.env.WSL_DISTRO_NAME !== undefined;
  const isWsl2 = process.env.WSL_INTEROP !== undefined;
  const isWsl1 = isWsl && !isWsl2;

  if (isWsl2) {
    return powershell(`./dist/nw.exe`);
  }
}

run();