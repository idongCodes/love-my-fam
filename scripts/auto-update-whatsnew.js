#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// User-friendly commit message parser
function parseCommitMessage(message) {
  const lowerMessage = message.toLowerCase();
  
  // Skip admin/technical commits
  const adminKeywords = ['merge', 'pull from', 'hotfix', 'refactor', 'test', 'ci', 'chore', 'docs', 'build', 'deps'];
  if (adminKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return null;
  }
  
  // Categorize based on keywords
  if (lowerMessage.includes('fix') || lowerMessage.includes('bug') || lowerMessage.includes('error')) {
    return {
      category: 'fix',
      icon: '🔧',
      status: 'just-released'
    };
  }
  
  if (lowerMessage.includes('add') || lowerMessage.includes('new') || lowerMessage.includes('implement')) {
    return {
      category: 'feature',
      icon: '🚀',
      status: 'just-released'
    };
  }
  
  if (lowerMessage.includes('update') || lowerMessage.includes('improve') || lowerMessage.includes('enhance')) {
    return {
      category: 'update',
      icon: '⚡',
      status: 'recently-updated'
    };
  }
  
  // Default to feature for user-visible changes
  return {
    category: 'feature',
    icon: '✨',
    status: 'just-released'
  };
}

// Convert commit message to user-friendly title
function makeUserFriendlyTitle(message) {
  // Remove technical jargon
  let title = message
    .replace(/fix:?\s*/gi, '')
    .replace(/feat:?\s*/gi, '')
    .replace(/add:?\s*/gi, '')
    .replace(/update:?\s*/gi, '')
    .replace(/implement:?\s*/gi, '')
    .replace(/\b(git|github|commit|push|pull|merge|branch)\b/gi, '')
    .trim();
  
  // Capitalize first letter
  title = title.charAt(0).toUpperCase() + title.slice(1);
  
  // Make title simpler/cuter
  if (title.toLowerCase().includes('bug')) return 'Squashed a Bug!';
  if (title.toLowerCase().includes('fix')) return 'Fixed a Boo-boo';
  if (title.toLowerCase().includes('add')) return 'Something New!';
  
  // Limit length
  if (title.length > 50) {
    title = title.substring(0, 47) + '...';
  }
  
  return title || 'New Update';
}

// Convert commit message to user-friendly description
function makeUserFriendlyDescription(message) {
  // Remove technical prefixes
  let description = message
    .replace(/^(fix|feat|add|update|implement|chore|docs|build|ci|refactor):\s*/i, '')
    .replace(/\b(git|github|commit|push|pull|merge|branch|repo|repository)\b/gi, '')
    .trim();
  
  // Make it more user-focused (Child Friendly Mode 🧸)
  if (description.toLowerCase().includes('login')) {
    return 'We made opening the magic door easier for everyone!';
  }
  
  if (description.toLowerCase().includes('nav') || description.toLowerCase().includes('menu')) {
    return 'Moving around the house is now super simple and fun!';
  }
  
  if (description.toLowerCase().includes('chat') || description.toLowerCase().includes('message')) {
    return 'Talking to your family is now faster than a whisper!';
  }
  
  if (description.toLowerCase().includes('profile') || description.toLowerCase().includes('room')) {
    return 'Your special room got a shiny new coat of paint!';
  }

  if (description.toLowerCase().includes('fix') || description.toLowerCase().includes('bug')) {
    return 'We found a little bug and sent it away. Bye bye bug!';
  }
  
  // Default description
  return 'We added some sparkle and magic to make things better!';
}

// Get version from git or package.json
function getVersion() {
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    return packageJson.version || 'latest';
  } catch {
    return 'latest';
  }
}

// Main function
function main() {
  const commitMessage = process.argv[2];
  
  if (!commitMessage) {
    console.error('Usage: node auto-update-whatsnew.js "<commit-message>"');
    process.exit(1);
  }
  
  const parsed = parseCommitMessage(commitMessage);
  
  if (!parsed) {
    console.log('Skipping admin/technical commit:', commitMessage);
    process.exit(0);
  }
  
  const title = makeUserFriendlyTitle(commitMessage);
  const description = makeUserFriendlyDescription(commitMessage);
  const version = getVersion();
  
  // Create new update entry
  const newUpdate = {
    id: title.toLowerCase().replace(/\s+/g, '-'),
    title,
    description,
    icon: parsed.icon,
    category: parsed.category,
    status: parsed.status,
    date: new Date().toISOString(),
    version
  };
  
  // Read current whatsNew.ts file
  const whatsNewPath = path.join(__dirname, '../src/lib/whatsNew.ts');
  let content = fs.readFileSync(whatsNewPath, 'utf8');
  
  // Find the whatsNewData array and insert new update at the beginning
  const arrayStart = content.indexOf('export const whatsNewData: UpdateItem[] = [');
  const firstObjectStart = content.indexOf('{', arrayStart);
  const firstObjectEnd = content.indexOf('},', firstObjectStart);
  
  if (arrayStart === -1 || firstObjectEnd === -1) {
    console.error('Could not find whatsNewData array structure');
    process.exit(1);
  }
  
  // Insert new update as first item in array
  const beforeFirstObject = content.substring(0, firstObjectStart);
  const afterFirstObject = content.substring(firstObjectEnd);
  
  const newEntry = `  {
    id: '${newUpdate.id}',
    title: '${newUpdate.title}',
    description: '${newUpdate.description}',
    icon: '${newUpdate.icon}',
    category: '${newUpdate.category}',
    status: '${newUpdate.status}',
    date: new Date('${newUpdate.date}'),
    version: '${newUpdate.version}'
  },`;
  
  const updatedContent = beforeFirstObject + newEntry + afterFirstObject;
  
  // Write back to file
  fs.writeFileSync(whatsNewPath, updatedContent);
  
  console.log(`✨ Added user-friendly update: "${title}"`);
  console.log(`   Category: ${parsed.category}, Version: ${version}`);
}

main();
