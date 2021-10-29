FROM nginxinc/nginx-unprivileged:stable

# Copy nginx configuration
COPY ./.github/default.conf /etc/nginx/conf.d/default.conf

# Copy showcase
COPY ./dist/releases/showcase-merge /usr/share/nginx/html
