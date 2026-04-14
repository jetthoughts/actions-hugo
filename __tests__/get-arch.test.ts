import getArch from '../src/get-arch';
import {describe, test, expect} from 'bun:test';

describe('getArch', () => {
  test('processor architecture', () => {
    expect(getArch('x64')).toBe('64bit');
    expect(getArch('arm')).toBe('ARM');
    expect(getArch('arm64')).toBe('ARM64');
  });

  test('exception', () => {
    expect(() => {
      getArch('mips');
    }).toThrow('mips is not supported');
  });
});
