export default function getURL(
  os: string,
  arch: string,
  extended: string,
  version: string
): string {
  const extendedStr = (extended: string): string => {
    if (extended === 'true') {
      return 'extended_';
    } else {
      return '';
      // } else {
      //   throw new Error(`Invalid input (extended): ${extended}`);
    }
  };

  const usePkg = (os: string, version: string): boolean => {
    if (os !== 'darwin') return false;
    const parts = version.split('.').map(Number);
    const minor = parts.length >= 2 ? parts[1] : 0;
    return minor >= 153;
  };

  const ext = (os: string, version: string): string => {
    if (os === 'windows') {
      return 'zip';
    } else if (usePkg(os, version)) {
      return 'pkg';
    } else {
      return 'tar.gz';
    }
  };

  const hugoName = `hugo_${extendedStr(extended)}${version}_${os}-${arch}`;
  const baseURL = 'https://github.com/gohugoio/hugo/releases/download';
  const url = `${baseURL}/v${version}/${hugoName}.${ext(os, version)}`;

  return url;
}
