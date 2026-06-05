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

  // We are looking for files that use `getCacheKey(baseKey)` in useAsyncData
  // and need to replace it with `baseKey`
  
  if (content.includes('getCacheKey(baseKey)')) {
     // Usually: const { data: ... } = useAsyncData(\n    getCacheKey(baseKey)
     content = content.replace(/useAsyncData\(\s*getCacheKey\(baseKey\)/, "useAsyncData(\n    baseKey");
     
     // Update readCache and writeCache to pass locale.value
     content = content.replace(/writeCache\(baseKey,\s*([a-zA-Z0-9_]+)\)/g, "writeCache(baseKey, $1, locale.value)");
     content = content.replace(/readCache\(baseKey\)/g, "readCache(baseKey, locale.value)");
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log('Fixed getCacheKey usage in', filePath);
  }
});

