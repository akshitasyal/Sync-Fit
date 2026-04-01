const fs = require('fs');
const path = require('path');

const urls = [
  ["https://i.pravatar.cc/100?img=3", "public/images/avatar-3.jpg"],
  ["https://i.pravatar.cc/100?img=4", "public/images/avatar-4.jpg"],
  ["https://i.pravatar.cc/100?img=5", "public/images/avatar-5.jpg"],
  ["https://i.pravatar.cc/100?img=1", "public/images/avatar-1.jpg"],
  ["https://i.pravatar.cc/100?img=2", "public/images/avatar-2.jpg"],
  ["https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1000&auto=format&fit=crop", "public/images/muscular-man.jpg"],
  ["https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop", "public/images/woman-lifting.jpg"],
  ["https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2000&auto=format&fit=crop", "public/images/hero-bg.jpg"],
  ["https://html.awaikenthemes.com/gympro/images/page-header-bg.jpg", "public/images/page-header-bg.jpg"]
];

const publicPath = path.join(__dirname, '../../public/images');
fs.mkdirSync(publicPath, { recursive: true });

async function download() {
  for (const [url, p] of urls) {
    console.log('Downloading', url);
    const res = await fetch(url);
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const dest = path.join(__dirname, '../../', p);
    fs.writeFileSync(dest, buffer);
    console.log('Saved', p);
  }
  console.log('All downloads complete.');
}

download().catch(console.error);
