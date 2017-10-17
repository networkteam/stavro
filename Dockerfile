FROM node:8.7-slim

# Note: Most of this is copied from https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md
#
# Install latest chrome dev package.
# Note: this installs the necessary libs to make the bundled version of Chromium that Pupppeteer
# installs, work.
RUN apt-get update && apt-get install -y wget --no-install-recommends \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-unstable \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get purge --auto-remove -y curl \
    && rm -rf /src/*.deb

# Skip the chromium download when installing puppeteer
# ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
# Pass a env var to submit.js to use a custom executable
# ENV PUPPETEER_EXECUTABLE google-chrome-unstable

ENV PUPPETEER_NO_SANDBOX true

WORKDIR /app

# Add pptruser user.
RUN groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /app

# Run user as non privileged.
USER pptruser

COPY package.json yarn.lock /app/

RUN yarn install

COPY *.js /app/
