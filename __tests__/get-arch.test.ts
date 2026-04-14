import getArch from '../src/get-arch';
import {describe, test, expect} from 'bun:test';

describe('getArch', () => {
  test('processor architecture', () => {
    expect(getArch('x64', 'linux')).toBe('amd64');
    expect(getArch('arm', 'linux')).toBe('arm');
    expect(getArch('arm64', 'linux')).toBe('arm64');
  });

  test('darwin always returns universal', () => {
    expect(getArch('x64', 'darwin')).toBe('universal');
    expect(getArch('arm64', 'darwin')).toBe('universal');
  });

  test('exception', () => {
    expect(() => {
      getArch('mips', 'linux');
    }).toThrow('mips is not supported');
  });
});
