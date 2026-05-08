import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import db from '../src/server/db';
import { crafts } from '../src/data/crafts';

const craftImages: Record<string, string> = {
  'accounting': 'https://images.unsplash.com/photo-1542744173-05336fcc7ad4?w=1200&q=80',
  'alu_pvc_joinery': 'https://images.unsplash.com/photo-1504917595217-d4f3b52a12aa?w=1200&q=80',
  'hair_styling': 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&q=80',
  'mens_barbering': 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1200&q=80',
  'sanitary_plumbing': 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=1200&q=80',
  'security_agent': 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&q=80',
  'ms_access': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
  'storekeeper': 'https://images.unsplash.com/photo-1586528116311-ad8ed74503cc?fm=jpg&w=1200&q=80',
  'data_entry': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?fm=jpg&w=1200&q=80',
  'autoelectrician': 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?fm=jpg&w=1200&q=80',
  'welding': 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?fm=jpg&w=1200&q=80',
  'it_technician': 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?fm=jpg&w=1200&q=80',
  'construction': 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?fm=jpg&w=1200&q=80',
  'collective_cooking': 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=1200&q=80',
};

async function seed() {
  const uploadDir = path.join(process.cwd(), 'uploads', 'crafts');
  fs.mkdirSync(uploadDir, { recursive: true });

  const svgWatermark = Buffer.from(`
    <svg width="300" height="80">
      <text x="10" y="60" font-family="sans-serif" font-size="24" fill="rgba(255, 255, 255, 0.7)" font-weight="bold" stroke="rgba(0,0,0,0.5)" stroke-width="1">
        CFPA Jdiouia
      </text>
    </svg>
  `);

  for (const craft of crafts) {
    let url = craftImages[craft.id] || craft.image;
    if (url.includes('unsplash.com')) {
      if (!url.includes('fm=')) {
        url = url.replace('?', '?fm=jpg&');
      }
    }
    console.log(`Downloading for ${craft.id}...`);
    try {
      const res = await fetch(url);
      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const filename = `${craft.id}-seed.webp`;
      const outputPath = path.join(uploadDir, filename);

      await sharp(buffer)
        .resize({ width: 800, withoutEnlargement: true })
        .composite([{ input: svgWatermark, gravity: 'southeast' }])
        .webp({ quality: 80 })
        .toFile(outputPath);

      const realImageUrl = `/uploads/crafts/${filename}`;

      const stmt = db.prepare(`
        INSERT INTO craft_images (craft_id, real_image_url) 
        VALUES (?, ?) 
        ON CONFLICT(craft_id) DO UPDATE SET real_image_url = excluded.real_image_url
      `);
      stmt.run(craft.id, realImageUrl);
      console.log(`Saved ${craft.id}`);
    } catch (e) {
      console.error(`Failed ${craft.id}`, e);
    }
  }
}

seed();
