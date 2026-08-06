import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import existing data
import { THEORIES, CATEGORIES } from './src/data.js';

const WIKI_API = 'https://en.wikipedia.org/w/api.php';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const CATEGORY_MAP = {
  'mind': ['Category:Parapsychology', 'Category:Mind_control', 'Category:Anomalous_phenomena'],
  'secret': ['Category:Secret_societies', 'Category:Conspiracy_theories_involving_secret_societies'],
  'geo': ['Category:Out-of-place_artifacts', 'Category:Unexplained_phenomena', 'Category:Lost_cities_and_towns']
};

async function fetchWithRetry(url, retries = 5) {
  for (let i = 0; i < retries; i++) {
    const res = await fetch(url, { headers: { 'User-Agent': 'AntigravityRabbitHole/1.0 (test@example.com)' }});
    if (res.ok) {
      const text = await res.text();
      try {
        return JSON.parse(text);
      } catch (e) {
        console.error('Failed to parse JSON, received:', text.substring(0, 50));
      }
    }
    if (res.status === 429) {
      console.log(`\nRate limited. Waiting ${2000 * Math.pow(2, i)}ms...`);
      await delay(2000 * Math.pow(2, i));
    } else {
      await delay(1000);
    }
  }
  return null;
}

async function fetchCategoryMembers(categoryName) {
  const url = `${WIKI_API}?action=query&list=categorymembers&cmtitle=${categoryName}&cmlimit=50&cmnamespace=0&format=json`;
  const data = await fetchWithRetry(url);
  if (!data || !data.query) return [];
  return data.query.categorymembers.map(m => m.title);
}

async function fetchExtract(title) {
  const url = `${WIKI_API}?action=query&prop=extracts&exintro=1&explaintext=1&titles=${encodeURIComponent(title)}&format=json`;
  const data = await fetchWithRetry(url);
  if (!data || !data.query) return null;
  const pages = data.query.pages;
  const pageId = Object.keys(pages)[0];
  if (pageId === '-1') return null;
  return pages[pageId].extract;
}

function truncateToWords(text, numWords) {
  if (!text) return '';
  const words = text.split(/\s+/);
  if (words.length <= numWords) return text;
  return words.slice(0, numWords).join(' ') + '...';
}

async function run() {
  console.log('Fetching missing data...');
  let newId = Math.max(...THEORIES.map(t => t.id)) + 1;
  const newTheories = [];

  for (const [catId, wikiCategories] of Object.entries(CATEGORY_MAP)) {
    console.log(`Processing category: ${catId}`);
    let titles = [];
    for (const wikiCat of wikiCategories) {
      const members = await fetchCategoryMembers(wikiCat);
      titles = titles.concat(members);
      await delay(500);
    }
    
    // Deduplicate and shuffle
    titles = [...new Set(titles)].sort(() => Math.random() - 0.5);
    
    // We need 50 items per category
    let count = 0;
    for (const title of titles) {
      if (count >= 50) break;
      
      // Skip if already in database
      if (THEORIES.some(t => t.title.toLowerCase() === title.toLowerCase())) continue;
      
      const extract = await fetchExtract(title);
      await delay(1000); // 1-second polite delay
      
      if (extract && extract.length > 200) { // ensure meaningful content
        
        // Ensure double newlines for paragraphs
        const formattedExtract = extract.replace(/\n+/g, '\n\n').trim();

        newTheories.push({
          id: newId++,
          title: title,
          category: catId,
          difficulty: ['Easy', 'Medium', 'Hard', 'Extreme'][Math.floor(Math.random() * 4)],
          depth: Math.floor(Math.random() * 9) + 2,
          description: truncateToWords(extract, 30),
          content: formattedExtract,
          tags: title.split(' ').slice(0, 2).map(t => t.replace(/[^a-zA-Z]/g, '')).filter(t => t.length > 3).concat(['Real Data']),
          readTime: Math.floor(Math.random() * 3 + 1) + " min read"
        });
        count++;
        process.stdout.write('.');
      }
    }
    console.log(`\nAdded ${count} items for ${catId}`);
  }

  // Combine and write back
  const finalTheories = [...THEORIES, ...newTheories];
  
  // Create output string
  const fileContent = `import { Globe, User, Map, Eye, Brain, Cpu, Mountain, Ghost, Scroll, Skull } from 'lucide-react';

export const CATEGORIES = [
  { id: 'all', name: 'Global Discovery', icon: Globe },
  { id: 'historical', name: 'Historical Anomalies', icon: Scroll },
  { id: 'tech', name: 'Covert Technology', icon: Cpu },
  { id: 'crypto', name: 'Cryptids & Biology', icon: Ghost },
  { id: 'space', name: 'Cosmic Phenomena', icon: Eye },
  { id: 'mind', name: 'Consciousness', icon: Brain },
  { id: 'secret', name: 'Secret Societies', icon: User },
  { id: 'geo', name: 'Geological Mysteries', icon: Mountain },
];

export const THEORIES = ${JSON.stringify(finalTheories, null, 2)};
`;

  fs.writeFileSync('./src/data.js', fileContent, 'utf-8');
  console.log('\\nSuccessfully updated src/data.js!');
}

run().catch(console.error);
