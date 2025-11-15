const fs = require('fs');
const path = require('path');

function updateImagePaths(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;
    
    // Replace .png with .webp in image paths
    const newContent = content.replace(
        /assets\/images\/([^"'\s]+)\.png/g,
        (match, filename) => {
            updated = true;
            return `assets/images-optimized/${filename}.webp`;
        }
    );
    
    // Also update other image paths to use optimized folder
    const finalContent = newContent.replace(
        /assets\/images\/([^"'\s]+\.(jpg|jpeg|gif))/gi,
        (match, filename) => {
            updated = true;
            return `assets/images-optimized/${filename}`;
        }
    );
    
    if (updated) {
        fs.writeFileSync(filePath, finalContent, 'utf8');
        console.log(`✓ Updated: ${filePath}`);
        return true;
    }
    return false;
}

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    let count = 0;
    
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && file !== 'node_modules' && file !== 'assets') {
            count += processDirectory(fullPath);
        } else if (file.endsWith('.html')) {
            if (updateImagePaths(fullPath)) {
                count++;
            }
        }
    });
    
    return count;
}

console.log('Updating image paths in HTML files...\n');
const updated = processDirectory('.');
console.log(`\n✓ Updated ${updated} HTML files!`);
console.log('\nNote: Review the changes before deploying.');
