const { readdirSync, writeFile } = require('fs');

const scanFolder = (source) => {
    let result = [];
    const folders = readdirSync(source, { withFileTypes: true }).filter(dirent => dirent.isDirectory());
    
    folders.forEach((dir) => {
        result.push(`${source}/${dir.name}`);
        result.push(...scanFolder(`${source}/${dir.name}`));
    });
    
    return result;
}

var content = scanFolder('./src/components').map(dir => {
    // `export * from '@vbd/vui/src/components/${dirent.name}';`).join("\n");
    var files = readdirSync(`${dir}`).filter((filename) => /w*.js|.tsx$/.test(filename));
    return files.filter((filename) => !filename.includes('.stories.js'))
        // .filter((filename) => !filename.includes('.override.js'))
        .map((filename) => `export * from '@vbd/vui/${dir.slice(2)}/${filename}';`).join("\n");
}).join("\n");

writeFile('./index.js', content, function (err) {
    if (err) throw err;
    console.log('Saved!');
  });