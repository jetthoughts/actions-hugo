export default function getArch(arch: string, os: string): string {
  if (os === 'darwin') {
    return 'universal';
  }
  switch (arch) {
    case 'x64':
      return 'amd64';
    case 'arm':
      return 'arm';
    case 'arm64':
      return 'arm64';
    default:
      throw new Error(`${arch} is not supported`);
  }
}
