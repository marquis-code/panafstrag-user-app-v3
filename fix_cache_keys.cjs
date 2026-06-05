const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

walk('/Users/marquis/panafstrag/user/composables/modules', function(filePath) {
  if (!filePath.endsWith('.ts')) return;
  let content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes('useAsyncData')) return;

  let changed = false;

  // Add useI18n import if missing
  if (!content.includes('useI18n')) {
    content = "import { useI18n } from '@/composables/useI18n';\n" + content;
    changed = true;
  }

  // Add const { locale } = useI18n() if missing
  if (!content.includes('const { locale } = useI18n()')) {
    content = content.replace(/(export const use[A-Za-z0-9_]+ = \([^)]*\) => {)/, "$1\n  const { locale } = useI18n();");
    changed = true;
  }

  // Add locale.value to the useAsyncData key
  // Common patterns: 
  // 1. useAsyncData('key', ...)
  // 2. useAsyncData(`key-${id.value}`, ...)
  // 3. useAsyncData(baseKey, ...)
  
  const regex1 = /useAsyncData\(\s*'([^']+)'\s*,/g;
  if (regex1.test(content)) {
    content = content.replace(regex1, "useAsyncData(`$1-${locale.value}`,");
    changed = true;
  }

  const regex2 = /useAsyncData\(\s*`([^`]+)`\s*,/g;
  if (regex2.test(content)) {
    content = content.replace(regex2, function(match, inner) {
      if (inner.includes('${locale.value}')) return match; // already has it
      return `useAsyncData(\`${inner}-\${locale.value}\`,`;
    });
    changed = true;
  }

  const regex3 = /useAsyncData\(\s*baseKey\s*,/g;
  if (regex3.test(content)) {
    content = content.replace(regex3, "useAsyncData(`${baseKey}-${locale.value}`,");
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed', filePath);
  }
});
