#!/usr/bin/env node
const fs = require('fs');

const envPath = process.argv[2] || '.env';
const samplePath = process.argv[3] || 'sample.env';

function parseEnv(file) {
  return fs
    .readFileSync(file, 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => line.split('=')[0].trim());
}

if (!fs.existsSync(envPath) || !fs.existsSync(samplePath)) {
  console.error('Both .env and sample.env must exist in the current directory.');
  process.exit(1);
}

const envKeys = parseEnv(envPath);
const sampleKeys = parseEnv(samplePath);
const missing = envKeys.filter((key) => !sampleKeys.includes(key));

if (missing.length > 0) {
  console.error('Missing keys in ' + samplePath + ':');
  missing.forEach((key) => console.error('- ' + key));
  process.exit(2);
}

console.log('All keys in .env are present in ' + samplePath);