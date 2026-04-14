import * as main from '../src/main';
import * as io from '@actions/io';
import path from 'path';
import {Tool, Action} from '../src/constants';
import jsonTestBrew from './data/brew.json';
import {describe, test, expect, beforeEach, afterEach, mock} from 'bun:test';

let originalFetch: typeof fetch;

describe('Integration testing run()', () => {
  beforeEach(() => {
    originalFetch = globalThis.fetch;
    mock.restore();
  });

  afterEach(async () => {
    globalThis.fetch = originalFetch;
    const workDir = path.join(`${process.env.HOME}`, Action.WorkDirName);
    await io.rmRF(workDir);

    delete process.env['INPUT_HUGO-VERSION'];
    delete process.env['INPUT_EXTENDED'];
  });

  test.skipIf(!process.env['RUNNER_TEMP'])(
    'succeed in installing a custom version',
    async () => {
      const testVersion = Tool.TestVersionSpec;
      process.env['INPUT_HUGO-VERSION'] = testVersion;
      const result: main.ActionResult = await main.run();
      expect(result.exitcode).toBe(0);
      expect(result.output).toMatch(`hugo v${testVersion}`);
    },
    30000
  );

  test.skipIf(!process.env['RUNNER_TEMP'])(
    'succeed in installing a custom extended version',
    async () => {
      const testVersion = Tool.TestVersionSpec;
      process.env['INPUT_HUGO-VERSION'] = testVersion;
      process.env['INPUT_EXTENDED'] = 'true';
      const result: main.ActionResult = await main.run();
      expect(result.exitcode).toBe(0);
      expect(result.output).toMatch(`hugo v${testVersion}`);
      expect(result.output).toMatch(`extended`);
    },
    30000
  );

  test.skipIf(!process.env['RUNNER_TEMP'])(
    'succeed in installing the latest version',
    async () => {
      process.env['INPUT_HUGO-VERSION'] = 'latest';
      globalThis.fetch = mock(async (input: RequestInfo | URL) => {
        const url = typeof input === 'string' ? input : input.toString();
        if (url.includes('formulae.brew.sh')) {
          return new Response(JSON.stringify(jsonTestBrew), {status: 200});
        }
        return originalFetch(input);
      }) as typeof fetch;

      const result: main.ActionResult = await main.run();
      expect(result.exitcode).toBe(0);
      expect(result.output).toMatch(`hugo v${Tool.TestVersionLatest}`);
    },
    30000
  );

  test.skipIf(!process.env['RUNNER_TEMP'])(
    'succeed in installing the latest extended version',
    async () => {
      process.env['INPUT_HUGO-VERSION'] = 'latest';
      process.env['INPUT_EXTENDED'] = 'true';
      globalThis.fetch = mock(async (input: RequestInfo | URL) => {
        const url = typeof input === 'string' ? input : input.toString();
        if (url.includes('formulae.brew.sh')) {
          return new Response(JSON.stringify(jsonTestBrew), {status: 200});
        }
        return originalFetch(input);
      }) as typeof fetch;

      const result: main.ActionResult = await main.run();
      expect(result.exitcode).toBe(0);
      expect(result.output).toMatch(`hugo v${Tool.TestVersionLatest}`);
      expect(result.output).toMatch(`extended`);
    },
    30000
  );

  test('fail to install the latest version due to 404 of brew', async () => {
    process.env['INPUT_HUGO-VERSION'] = 'latest';
    globalThis.fetch = mock(
      async () => new Response('Not Found', {status: 404, statusText: 'Not Found'})
    ) as typeof fetch;

    await expect(main.run()).rejects.toThrow(Error);
  });
});

describe('showVersion()', () => {
  let result: main.ActionResult = {
    exitcode: 0,
    output: ''
  };

  test('return version', async () => {
    result = await main.showVersion('git', ['--version']);
    expect(result.exitcode).toBe(0);
    expect(result.output).toMatch(/git version/);
  });

  test('return not found', async () => {
    await expect(main.showVersion('gitgit', ['--version'])).rejects.toThrow(Error);
  });
});
