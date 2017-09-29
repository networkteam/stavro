const minimist = require('minimist');
const Sitemapper = require('sitemapper');

const sitemap = new Sitemapper();

const argv = minimist(process.argv.slice(2));

if (argv._.length !== 1) {
  printHelp();
}

const sitemapUrl = argv._[0];

(async() => {

  // Fetch sitemap
  let { url, sites } = await sitemap.fetch(sitemapUrl);

  for (let url of sites) {
    console.log(url);
  }

})();

function printHelp() {
  console.log(`Usage: node sitemapper.js [sitemap url]
  `);
  process.exit(1);
}