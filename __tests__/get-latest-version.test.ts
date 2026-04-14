import {getURL, getLatestVersion} from '../src/get-latest-version';
import {Tool} from '../src/constants';
import jsonTestBrew from './data/brew.json';
import jsonTestGithub from './data/github.json';
import {describe, test, expect, beforeEach, mock} from 'bun:test';

beforeEach(() => {
  mock.restore();
});

describe('getURL()', () => {
  test('return expected URL', () => {
    const urlBrewExpected = `https://formulae.brew.sh/api/formula/${Tool.Repo}.json`;
    const urlBrew: string = getURL(Tool.Org, Tool.Repo, 'brew');
    expect(urlBrew).toMatch(urlBrewExpected);

    const urlGithubExpected = `https://api.github.com/repos/${Tool.Org}/${Tool.Repo}/releases/latest`;
    const urlGithub: string = getURL(Tool.Org, Tool.Repo, 'github');
    expect(urlGithub).toMatch(urlGithubExpected);
  });
});

describe('getLatestVersion()', () => {
  test('return latest version via brew', async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = mock(
      async () => new Response(JSON.stringify(jsonTestBrew), {status: 200})
    ) as typeof fetch;

    const versionLatest: string = await getLatestVersion(Tool.Org, Tool.Repo, 'brew');
    expect(versionLatest).toMatch(Tool.TestVersionLatest);

    globalThis.fetch = originalFetch;
  });

  test('return latest version via GitHub', async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = mock(
      async () => new Response(JSON.stringify(jsonTestGithub), {status: 200})
    ) as typeof fetch;

    const versionLatest: string = await getLatestVersion(Tool.Org, Tool.Repo, 'github');
    expect(versionLatest).toMatch(Tool.TestVersionLatest);

    globalThis.fetch = originalFetch;
  });

  test('return exception 404', async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = mock(
      async () => new Response('Not Found', {status: 404, statusText: 'Not Found'})
    ) as typeof fetch;

    await expect(getLatestVersion(Tool.Org, Tool.Repo, 'brew')).rejects.toThrow(Error);

    globalThis.fetch = originalFetch;
  });
});
