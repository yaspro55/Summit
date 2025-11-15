const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Check if sharp is installed
try {
    require.resolve('sharp');
} catch (e) {
    console.log('Installing sharp...');
    execSync('npm install sharp', { stdio: 'inherit' });
}

const sharp = require('sharp');

const inputDir = './assets/images';
const outputDir = './assets/images-optimized';

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

async function compressImage(inputPath, outputPath) {
    const ext = path.extname(inputPath).toLowerCase();
    
    try {
        const stats = fs.statSync(inputPath);
        const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
        
        if (ext === '.png') {
            // Convert PNG to WebP for better compression
            await sharp(inputPath)
                .webp({ quality: 80 })
                .toFile(outputPath.replace('.png', '.webp'));
            
            const newStats = fs.statSync(outputPath.replace('.png', '.webp'));
            const newSizeMB = (newStats.size / (1024 * 1024)).toFixed(2);
            console.log(`✓ ${path.basename(inputPath)} (${sizeMB}MB → ${newSizeMB}MB)`);
            
        } else if (ext === '.jpg' || ext === '.jpeg') {
            // Compress JPEG
            await sharp(inputPath)
                .jpeg({ quality: 80, progressive: true })
                .toFile(outputPath);
            
            const newStats = fs.statSync(outputPath);
            const newSizeMB = (newStats.size / (1024 * 1024)).toFixed(2);
            console.log(`✓ ${path.basename(inputPath)} (${sizeMB}MB → ${newSizeMB}MB)`);
            
        } else if (ext === '.gif') {
            // Copy GIF as-is (or you can keep original)
            fs.copyFileSync(inputPath, outputPath);
            console.log(`✓ ${path.basename(inputPath)} (copied as-is)`);
        }
    } catch (error) {
        console.error(`✗ Error processing ${path.basename(inputPath)}:`, error.message);
    }
}

async function processAllImages() {
    console.log('Starting image compression...\n');
    
    const files = fs.readdirSync(inputDir);
    let processed = 0;
    
    for (const file of files) {
        const inputPath = path.join(inputDir, file);
        const outputPath = path.join(outputDir, file);
        
        if (fs.statSync(inputPath).isFile()) {
            await compressImage(inputPath, outputPath);
            processed++;
        }
    }
    
    console.log(`\n✓ Done! Processed ${processed} images.`);
    console.log(`\nOptimized images are in: ${outputDir}`);
    console.log('\nNext steps:');
    console.log('1. Review the optimized images');
    console.log('2. Backup your original images folder');
    console.log('3. Replace assets/images with assets/images-optimized');
    console.log('4. Update .png references to .webp in your HTML');
}

processAllImages();
