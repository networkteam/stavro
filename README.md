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

## Running in Docker

    docker run -it --name stavro networkteam/stavro -- /bin/bash
    # Run commands in to submit URLs
    
Detach the running container with `Ctrl+p`, `Ctrl+q`. It can be re-attached with
`docker attach stavro` and will exist in stopped state after finishing.