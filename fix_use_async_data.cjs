const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('/Users/marquis/panafstrag/user/composables/modules', (filePath) => {
  if (!filePath.endsWith('.ts')) return;

  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;

  // Skip if we already added useI18n
  if (content.includes('const { locale } = useI18n();') && !content.includes('localStorage.getItem(\'app-lang\')')) {
     return;
  }
  
  // Replace the dynamic key with a static key if it exists
  const keyRegex = /`([^`]+)_\$\{\s*typeof window !== 'undefined' \? localStorage\.getItem\('app-lang'\) \|\| 'en' : 'en'\s*\}`/;
  const match = content.match(keyRegex);
  
  if (match) {
    const baseKey = match[1];
    content = content.replace(keyRegex, `'${baseKey}'`);
  } else if (content.includes('getCacheKey(baseKey)')) {
    // skip for now or we will handle focusAreas specifically later if needed.
    // wait, we modified getCacheKey to take localeStr!
  }

  // Add import if not exists
  if (!content.includes('useI18n') && content.includes('useAsyncData')) {
    content = content.replace(/(import .*;\n)+/, (match) => match + "import { useI18n } from '@/composables/useI18n';\n");
  }

  // Add const { locale } = useI18n(); inside the exported composable
  // Usually export const useFetchSomething = () => {
  content = content.replace(/(export const use\w+ = \([^)]*\) => {\n)/, "$1  const { locale } = useI18n();\n");

  // Add watch: [locale] to useAsyncData options if not present
  if (content.includes('useAsyncData') && !content.includes('watch: [locale]')) {
    // Find the options object { ... } and add watch: [locale], 
    // It's the 3rd argument to useAsyncData
    content = content.replace(/(server: true\s*})/, "watch: [locale],\n      $1");
    // Fallback for others
    if (!content.includes('watch: [locale]')) {
       // if server: true wasn't matched
       content = content.replace(/({\n\s*)(initialCache)/, "$1watch: [locale],\n      $2");
    }
    if (!content.includes('watch: [locale]')) {
       content = content.replace(/(,\n\s*{\n\s*)/, "$1watch: [locale],\n      ");
    }
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log('Fixed', filePath);
  }
});

