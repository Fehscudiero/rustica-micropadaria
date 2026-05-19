const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const inputPath = path.join(__dirname, 'src', 'assets', 'brand', 'logo.png');
const outputPathPng = path.join(__dirname, 'src', 'assets', 'brand', 'logo_opt.png');
const outputPathWebp = path.join(__dirname, 'src', 'assets', 'brand', 'logo.webp');

async function optimize() {
  try {
    console.log('Inspecionando imagem original:', inputPath);
    const metadata = await sharp(inputPath).metadata();
    console.log(`Dimensões originais: ${metadata.width}x${metadata.height}, formato: ${metadata.format}`);

    // Como o tamanho máximo na tela é de cerca de 240px (e no header 60px),
    // se a imagem original for gigante (ex: 2000px), a qualidade decai ao renderizar e pesa demais.
    // Vamos redimensionar para uma largura máxima de 500px (retina 2x para 240px de exibição),
    // mantendo excelente qualidade e reduzindo drasticamente o tamanho do arquivo.
    let width = metadata.width;
    if (metadata.width > 500) {
      width = 500;
      console.log('Redimensionando imagem para largura de 500px para otimização...');
    }

    // Gerar WebP super leve e com altíssima qualidade (near-lossless ou qualidade 85-90)
    await sharp(inputPath)
      .resize({ width: width, withoutEnlargement: true })
      .webp({ quality: 85, effort: 6 })
      .toFile(outputPathWebp);
    
    // Gerar PNG otimizado também
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

    // Substituir a imagem original pelo PNG otimizado para não quebrar links existentes
    fs.unlinkSync(inputPath);
    fs.renameSync(outputPathPng, inputPath);
    console.log('logo.png original foi substituído pela versão comprimida de alta qualidade!');
  } catch (err) {
    console.error('Erro na otimização:', err);
  }
}

optimize();
