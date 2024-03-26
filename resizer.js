import sharp from 'sharp';
import { readdir } from 'fs/promises';
import { join, extname } from 'path';

const getPathFromArgs = () => {
  const pathIndex = process.argv.indexOf('--path') + 1;
  return pathIndex > 0 ? process.argv[pathIndex] : null;
};

const directory = getPathFromArgs();

const desiredWidth = 87;

if (!directory) {
  console.error('Please provide a path using the --path flag');
  process.exit(1);
}

const resizeImages = async () => {
  try {
    const files = await readdir(directory);
    
    for (const file of files) {
      if (extname(file) === '.png') {
        const filePath = join(directory, file);

        const data = await sharp(filePath)
          .resize(desiredWidth)
          .toBuffer();

        await sharp(data).toFile(filePath);

        console.log(`Resized ${file}`);
      }
    }
  } catch (err) {
    console.error('Error processing the directory:', err);
  }
};

resizeImages();
