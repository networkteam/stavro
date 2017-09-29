# Stavro

**Note: This is an alpha version under active development.**

## Dependencies

* **Spectre** See https://github.com/wearefriday/spectre for installation instructions.
* **Node.js** >= 7.6.0
* **Yarn**

## Installation

Install dependencies (includes a headless Chromium):

    yarn install

## Generate list of URLs from a sitemap.xml

    node sitemapper.js http://www.example.com/sitemap.xml > urls.txt

## Submit a list of URLs as screenshots to Spectre

Submit and render a list of URLs in `urls.txt` in 3 different width in Suite _Relaunch_:

    cat urls.txt | node submit.js -s Relaunch -w 480,1024,1280 --spectre https://spectre.example.com example.com
