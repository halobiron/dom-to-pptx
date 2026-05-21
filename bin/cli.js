#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function main() {
  console.log('\n\x1b[36m%s\x1b[0m', '🚀 dom-to-pptx Skills Installer (v2.0)');
  console.log('-----------------------------------');

  const homeDir = process.env.HOME || process.env.USERPROFILE || process.env.HOMEPATH;

  // Define known agents and their detection folders
  const agents = [
    { name: 'Claude Code', path: path.join(homeDir, '.claude', 'skills') },
    {
      name: 'Gemini CLI / Antigravity',
      path: path.join(homeDir, '.gemini', 'antigravity', 'skills'),
    },
    { name: 'Windsurf', path: path.join(homeDir, '.windsurf', 'skills') },
    { name: 'Cursor', path: path.join(homeDir, '.cursor', 'skills') },
  ];

  // Auto-detect installed agents
  const detectedAgents = agents.filter((a) => fs.existsSync(path.dirname(a.path)));

  let targetBase;

  console.log('\nChecking for installed AI agents...');

  if (detectedAgents.length > 0) {
    console.log(`\nDetected ${detectedAgents.length} potential agent(s):`);
    detectedAgents.forEach((a, i) => console.log(`${i + 1}) ${a.name}`));
    console.log(`${detectedAgents.length + 1}) Custom / Project Local (.agent/skills)`);

    const choice = await question(`\nSelect target (1-${detectedAgents.length + 1}): `);
    const index = parseInt(choice) - 1;

    if (index >= 0 && index < detectedAgents.length) {
      targetBase = detectedAgents[index].path;
    } else {
      targetBase = path.join(process.cwd(), '.agent', 'skills');
    }
  } else {
    console.log('\nNo global AI agents detected in home directory.');
    const useLocal = await question('Install to current project (.agent/skills)? (y/n): ');
    if (useLocal.toLowerCase() === 'y') {
      targetBase = path.join(process.cwd(), '.agent', 'skills');
    } else {
      console.log('Installation cancelled.');
      rl.close();
      return;
    }
  }

  const targetDir = path.join(targetBase, 'dom-to-pptx-skill');

  // 3. Confirm
  console.log(`\nInstalling to: \x1b[32m${targetDir}\x1b[0m`);
  const confirm = await question('Proceed? (y/n): ');

  if (confirm.toLowerCase() !== 'y') {
    console.log('Aborted.');
    rl.close();
    return;
  }

  // 4. Copying Logic
  try {
    const sourceDir = path.join(__dirname, '..', 'skills', 'dom-to-pptx-skill');

    if (!fs.existsSync(sourceDir)) {
      throw new Error(
        `Source skills not found at ${sourceDir}. Are you running from the package root?`
      );
    }

    copyRecursiveSync(sourceDir, targetDir);

    console.log(
      '\n\x1b[32m%s\x1b[0m',
      '✅ Success! dom-to-pptx "Atmospheric UI" skills installed.'
    );
    console.log('Your agent is now equipped with the Premium Presentation Engineering framework.');
    console.log('You may need to restart your AI agent to see the new skill.');
  } catch (err) {
    console.error('\n\x1b[31m%s\x1b[0m', '❌ Error during installation:');
    console.error(err.message);
  }

  rl.close();
}

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

main();
