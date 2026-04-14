import getURL from '../src/get-url';
import {describe, test, expect} from 'bun:test';

describe('getURL()', () => {
  test('get a URL to an asset for each platform', () => {
    const baseURL = 'https://github.com/gohugoio/hugo/releases/download/v0.139.0';
    const urlLinux = `${baseURL}/hugo_0.139.0_linux-amd64.tar.gz`;
    const urlLinuxExtended = `${baseURL}/hugo_extended_0.139.0_linux-amd64.tar.gz`;
    const urlDarwin = `${baseURL}/hugo_0.139.0_darwin-universal.tar.gz`;
    const urlDarwinExtended = `${baseURL}/hugo_extended_0.139.0_darwin-universal.tar.gz`;
    const urlWindows = `${baseURL}/hugo_0.139.0_windows-amd64.zip`;
    expect(getURL('linux', 'amd64', 'false', '0.139.0')).toBe(urlLinux);
    expect(getURL('linux', 'amd64', 'true', '0.139.0')).not.toBe(urlLinux);
    expect(getURL('myos', 'amd64', 'false', '0.139.0')).not.toBe(urlLinux);
    expect(getURL('linux', 'amd64', 'false', '0.138.0')).not.toBe(urlLinux);
    expect(getURL('linux', 'amd64', 'true', '0.139.0')).toBe(urlLinuxExtended);
    expect(getURL('darwin', 'universal', 'false', '0.139.0')).toBe(urlDarwin);
    expect(getURL('darwin', 'universal', 'true', '0.139.0')).toBe(urlDarwinExtended);
    expect(getURL('windows', 'amd64', 'false', '0.139.0')).toBe(urlWindows);
  });

  test('use .pkg for macOS on Hugo >= 0.153.0', () => {
    const baseURL = 'https://github.com/gohugoio/hugo/releases/download/v0.160.1';
    expect(getURL('darwin', 'universal', 'false', '0.160.1')).toBe(
      `${baseURL}/hugo_0.160.1_darwin-universal.pkg`
    );
    expect(getURL('darwin', 'universal', 'true', '0.160.1')).toBe(
      `${baseURL}/hugo_extended_0.160.1_darwin-universal.pkg`
    );
  });

  test('use .tar.gz for macOS on Hugo < 0.153.0', () => {
    const baseURL = 'https://github.com/gohugoio/hugo/releases/download/v0.152.0';
    expect(getURL('darwin', 'universal', 'false', '0.152.0')).toBe(
      `${baseURL}/hugo_0.152.0_darwin-universal.tar.gz`
    );
  });
});
