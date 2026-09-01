import { readdir, readFile } from 'node:fs/promises';
import { extname, relative, resolve, sep } from 'node:path';
import viteConfig from '../vite.config.js';

const repositoryRoot = resolve(import.meta.dirname, '..');
const themeRoot = resolve(repositoryRoot, 'shopifytheme');
const assetsRoot = resolve(themeRoot, 'assets');

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const path = resolve(directory, entry.name);
      return entry.isDirectory() ? collectFiles(path) : path;
    }),
  );

  return files.flat();
}

function getViteOutputs() {
  const outputs = new Set();

  for (const [name, inputPath] of Object.entries(viteConfig.input)) {
    const extension = extname(inputPath);
    outputs.add(`${name}${extension}`);

    if (extension === '.js') {
      outputs.add(`${name}.css`);
    }
  }

  return outputs;
}

const assetFiles = (await readdir(assetsRoot, { withFileTypes: true }))
  .filter((entry) => entry.isFile())
  .map((entry) => entry.name)
  .sort();
const viteOutputs = getViteOutputs();
const themeFiles = await collectFiles(themeRoot);
const searchableFiles = themeFiles.filter(
  (filePath) => !filePath.startsWith(`${assetsRoot}${sep}`),
);
const sourceContents = await Promise.all(
  searchableFiles.map(async (filePath) => ({
    filePath,
    content: await readFile(filePath, 'utf8'),
  })),
);

const candidates = assetFiles.filter((assetName) => {
  if (viteOutputs.has(assetName)) {
    return false;
  }

  return !sourceContents.some(({ content }) => content.includes(assetName));
});

console.log(
  `Scanned ${assetFiles.length} assets and excluded ${viteOutputs.size} Vite outputs.`,
);

if (candidates.length === 0) {
  console.log('No unreferenced asset candidates found.');
} else {
  console.log(`Found ${candidates.length} unreferenced asset candidates:`);
  for (const assetName of candidates) {
    console.log(
      `- ${relative(repositoryRoot, resolve(assetsRoot, assetName))}`,
    );
  }
}
