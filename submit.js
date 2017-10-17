const getStdin = require('get-stdin');
const minimist = require('minimist');
const superagent = require('superagent');
const puppeteer = require('puppeteer');

const url = require('url');

const argv = minimist(process.argv.slice(2), { boolean: ['baseline'] });

if (argv._.length !== 1) {
  printHelp();
}

const project = argv._[0];

const suite = argv.s || 'All';
const widths = String(argv.w || '1280').split(/\s*,\s*/).map(s => parseInt(s));
const spectreBaseUrl = argv.spectre || 'http://localhost:3000';
const baseline = argv.baseline || false;

let puppeteerOpts = {};
if (process.env['PUPPETEER_EXECUTABLE']) {
  puppeteerOpts.executablePath = process.env['PUPPETEER_EXECUTABLE'];
}
// See https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md#chrome-headless-fails-due-to-sandbox-issues
if (process.env['PUPPETEER_NO_SANDBOX']) {
  puppeteerOpts.args = ['--no-sandbox', '--disable-setuid-sandbox'];
}


let browser, page;

(async() => {

  browser = await puppeteer.launch(puppeteerOpts);
  page = await browser.newPage();

  console.log('Launched browser');

  // Create new run in spectre
  let result = await superagent.post(`${spectreBaseUrl}/runs`).send({ project, suite }).set('accept', 'json');
  let runId = result.body.id;

  console.log(`Created run ${runId}`);

  // Get URLs from STDIN
  let urls = (await getStdin()).split(/\n/).filter(s => s !== '');

  for (let url of urls) {
    for (let width of widths) {
      await render(runId, url, width);
    }
  }

})().then(async() => {
  await browser.close();
});

async function render(runId, url, width) {
  console.log(`Rendering ${url} in ${width}...`)

  await page.setViewport({width, height: width});

  await page.goto(url);

  // TODO Use tmp file
  // const screenshotFilename = tmp.tmpNameSync();

  await page.screenshot({path: 'screenshot.png', fullPage: true});

  const name = getTestName(url);

  await superagent.post(`${spectreBaseUrl}/tests`)
    .field('test[run_id]', runId)
    .field('test[name]', name)
    .field('test[browser]', 'Chrome')
    .field('test[size]', width)
    .field('test[source_url]', url)
    .field('test[baseline]', baseline ? '1' : '0')
    .attach('test[screenshot]', 'screenshot.png');
}

function getTestName(urlString) {
  const urlObject = url.parse(urlString);
  return urlObject.path;
}

function printHelp() {
  console.log(`Usage: cat urls.txt | node submit.js [options] [project]

URLs to be submitted are read line by line from STDIN.

Options:
  -s name               Suite name, defaults to "All"
  -w width1,width2      Submit multiple viewport widths, defaults to 1280
  --baseline            Set the submitted tests as new baseline
  --spectre spectreURL  Spectre base URL for the API, defaults to http://localhost:3000
  `);
  process.exit(1);
}