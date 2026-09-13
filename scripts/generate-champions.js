import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function fetchChampionsData() {
  try {
    console.log('Fetching latest Riot Data Dragon version...');
    const versionRes = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
    const versions = await versionRes.json();
    const latestVersion = versions[0] || '16.18.1';
    console.log(`Using Data Dragon version: ${latestVersion}`);

    console.log('Fetching Polish champions data (pl_PL)...');
    const ddragonUrl = `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/pl_PL/champion.json`;
    const res = await fetch(ddragonUrl);
    const data = await res.json();

    const rawChamps = data.data;
    const championList = Object.keys(rawChamps).map((key) => {
      const c = rawChamps[key];
      return {
        id: c.id,
        key: c.key,
        name: c.name,
        title: c.title,
        blurb: c.blurb,
        tags: c.tags, // e.g. ["Marksman", "Assassin"]
        info: c.info, // attack, defense, magic, difficulty
        partype: c.partype,
        iconUrl: `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/champion/${c.image.full}`,
        splashUrl: `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${c.id}_0.jpg`,
        loadingUrl: `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${c.id}_0.jpg`
      };
    });

    // Sort alphabetically by Polish name
    championList.sort((a, b) => a.name.localeCompare(b.name, 'pl'));

    const outputDir = path.join(__dirname, '..', 'src', 'data');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, 'champions.json');
    const fileContent = JSON.stringify({
      version: latestVersion,
      updatedAt: new Date().toISOString(),
      total: championList.length,
      champions: championList
    }, null, 2);

    fs.writeFileSync(outputPath, fileContent, 'utf-8');
    console.log(`Successfully generated champions database at ${outputPath} with ${championList.length} champions!`);
  } catch (error) {
    console.error('Error fetching champion data:', error);
    process.exit(1);
  }
}

fetchChampionsData();
