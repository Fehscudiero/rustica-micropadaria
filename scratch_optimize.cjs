const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const inputPath = path.join(__dirname, 'src', 'assets', 'brand', 'logo.png');
const outputPathPng = path.join(__dirname, 'src', 'assets', 'brand', 'logo_opt.png');
const outputPathWebp = path.join(__dirname, 'src', 'assets', 'brand', 'logo.webp');

async function optimize() {
  try {
    console.log('Inspecionando imagem original:', inputPath);
    if (!fs.existsSync(inputPath)) {
      console.error('Arquivo original não encontrado em:', inputPath);
      return;
    }
    const metadata = await sharp(inputPath).metadata();
    console.log(`Dimensões originais: ${metadata.width}x${metadata.height}, formato: ${metadata.format}`);

    // Redimensionar para largura máxima de 500px para otimização de payload web (retina 2x para o tamanho de exibição no layout)
    let width = metadata.width;
    if (metadata.width > 500) {
      width = 500;
      console.log('Redimensionando imagem para largura de 500px...');
    }

    // Gerar WebP de alta qualidade
    await sharp(inputPath)
      .resize({ width: width, withoutEnlargement: true })
      .webp({ quality: 85, effort: 6 })
      .toFile(outputPathWebp);
    
    // Gerar PNG comprimido
    await sharp(inputPath)
      .resize({ width: width, withoutEnlargement: true })
      .png({ compressionLevel: 9, palette: true })
      .toFile(outputPathPng);

    const sizeOriginal = fs.statSync(inputPath).size;
    const sizeWebp = fs.statSync(outputPathWebp).size;
    const sizePngOpt = fs.statSync(outputPathPng).size;

    console.log(`Sucesso!`);
    console.log(`Tamanho Original: ${(sizeOriginal / 1024).toFixed(2)} KB`);
    console.log(`Novo PNG Otimizado: ${(sizePngOpt / 1024).toFixed(2)} KB`);
    console.log(`Novo WebP Otimizado: ${(sizeWebp / 1024).toFixed(2)} KB`);

    // Substitui a imagem original pela versão PNG otimizada
    fs.unlinkSync(inputPath);
    fs.renameSync(outputPathPng, inputPath);
    console.log('logo.png original foi substituído pela versão comprimida de alta qualidade!');
  } catch (err) {
    console.error('Erro na otimização:', err);
  }
}

optimize();
