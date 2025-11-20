FROM ubuntu:latest
LABEL authors="mario"

# install patch
RUN apt-get update && apt-get install -y \
    chromium \
    libnspr4 \
    libglib2.0-0 \
    patch \
    curl \
    git \
    vim \
    build-essential \
  && rm -rf /var/lib/apt/lists/*

# Node.js 22 + pnpm (via corepack)
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
  && apt-get install -y nodejs \
  && corepack enable \
  && corepack prepare pnpm@latest --activate

ENTRYPOINT ["top", "-b"]
