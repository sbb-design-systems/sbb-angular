FROM nginxinc/nginx-unprivileged:stable

# Copy nginx configuration
COPY ./.github/default.conf /etc/nginx/conf.d/default.conf

# Copy showcase
COPY ./dist/releases/showcase /usr/share/nginx/html

USER root

# Add configuration for ngssc
RUN echo '{"variant":"global","environmentVariables":["JM_API_KEY","LEGACY_VERSIONS"],"filePattern":"index.html"}' > /usr/share/nginx/html/ngssc.json

# Add write permission for random user for the index.html
RUN chmod a+w /usr/share/nginx/html/index.html

# Install ngssc binary
ADD https://github.com/kyubisation/angular-server-side-configuration/releases/download/v14.0.1/ngssc_64bit /usr/sbin/ngssc
RUN chmod +x /usr/sbin/ngssc

# Copy insert key script and assign execute permission
COPY ./scripts/ngssc.sh /docker-entrypoint.d/ngssc.sh
RUN chmod +x /docker-entrypoint.d/ngssc.sh

USER $UID
