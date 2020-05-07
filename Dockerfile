FROM nginx:stable

#!/bin/sh

COPY ./.github/nginx.conf /etc/nginx/nginx.conf

## Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*

WORKDIR /usr/share/nginx/html

## add permissions for nginx user
RUN chown -R nginx:nginx /usr/share/nginx/html && \
        chmod -R 755 /usr/share/nginx/html && \
        chown -R nginx:nginx /var/cache/nginx && \
        chown -R nginx:nginx /var/log/nginx && \
        chown -R nginx:nginx /etc/nginx/conf.d
RUN touch /var/run/nginx.pid && \
        chown -R nginx:nginx /var/run/nginx.pid

USER nginx

# Copy showcase
COPY ./dist/releases/showcase /usr/share/nginx/html

EXPOSE 8080

ENTRYPOINT ["nginx", "-g", "daemon off;"]