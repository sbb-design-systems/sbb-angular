FROM ubuntu:latest
LABEL authors="mario"

RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    patch \
    curl \
    git \
    vim \
    build-essential \
  && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/google-chrome-keyring.gpg \
  && echo "deb [arch=amd64 signed-by=/usr/share/keyrings/google-chrome-keyring.gpg] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list \
  && apt-get update \
  && apt-get install -y google-chrome-stable --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

# Node.js 22 + pnpm (via corepack)
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
  && apt-get install -y nodejs \
  && corepack enable \
  && corepack prepare pnpm@latest --activate

ENTRYPOINT ["top", "-b"]
