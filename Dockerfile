FROM nginxinc/nginx-unprivileged:stable

# Copy nginx configuration
COPY ./.github/default.conf /etc/nginx/conf.d/default.conf

# Copy showcase
COPY ./dist/releases/showcase /usr/share/nginx/html
USER root
RUN chmod +w /usr/share/nginx/html/index.html
USER $UID

# Copy insert key script and assign execute permission
COPY ./scripts/insert_key.sh /docker-entrypoint.d/insert_key.sh
