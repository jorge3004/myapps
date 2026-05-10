#!/usr/bin/env node
// Simple script to check for missing keys in sample.env
const fs = require('fs');
const path = process.argv[2] || '.env';
const samplePath = process.argv[3] || 'sample.env';

function parseEnv(file) {
    return fs.readFileSync(file, 'utf8')
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('#'))
        .map(line => line.split('=')[0]);
}

if (!fs.existsSync(path) || !fs.existsSync(samplePath)) {
    console.error('Both .env and sample.env must exist in the current directory.');
    process.exit(1);
}

const envKeys = parseEnv(path);
const sampleKeys = parseEnv(samplePath);
const missing = envKeys.filter(key => !sampleKeys.includes(key));

if (missing.length) {
    console.log('Missing keys in ' + samplePath + ':');
    missing.forEach(key => console.log('  ' + key + '='));
    process.exit(2);
} else {
    console.log('All keys in .env are present in ' + samplePath);
}
