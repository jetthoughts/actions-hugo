import getOS from '../src/get-os';
import {describe, test, expect} from 'bun:test';

describe('getOS', () => {
  test('os type', () => {
    expect(getOS('linux')).toBe('linux');
    expect(getOS('darwin')).toBe('darwin');
    expect(getOS('win32')).toBe('windows');
  });

  test('exception', () => {
    expect(() => {
      getOS('centos');
    }).toThrow('centos is not supported');
  });
});
