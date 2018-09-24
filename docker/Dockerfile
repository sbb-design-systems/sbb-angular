# Dockerfile for ESTA WebJS
FROM openshift/origin-base

USER root

ARG ARTIFACTORY_USER
ARG ARTIFACTORY_PW
ARG VERSION

ENV NGINX_VERSION=1.14.0
ENV NODE_ENV production

RUN curl --silent --location https://rpm.nodesource.com/setup_8.x | bash -
RUN INSTALL_PKGS="gcc gcc-c++ make openssl-devel git pcre-devel zlib-devel python python-setuptools nodejs" \
  && yum install -y -q ${INSTALL_PKGS} \
  && rpm -V ${INSTALL_PKGS} \
  && yum clean all

# Install nginx
ADD http://nginx.org/download/nginx-$NGINX_VERSION.tar.gz nginx.tar.gz
RUN mkdir -p /usr/share/nginx \
  && mkdir -p /usr/share/nginx/ngx_brotli \
  && tar -xzf nginx.tar.gz -C /usr/share/nginx
RUN git clone https://github.com/eustas/ngx_brotli.git /usr/share/nginx/ngx_brotli \
  && cd /usr/share/nginx/ngx_brotli \
  && git submodule update --init --recursive
RUN cd /usr/share/nginx/nginx-$NGINX_VERSION \
  && ./configure \
      --sbin-path=/usr/local/sbin \
      --with-compat \
      --with-file-aio \
      --with-threads \
      --with-http_addition_module \
      --with-http_auth_request_module \
      --with-http_dav_module \
      --with-http_flv_module \
      --with-http_gunzip_module \
      --with-http_gzip_static_module \
      --with-http_mp4_module \
      --with-http_random_index_module \
      --with-http_realip_module \
      --with-http_secure_link_module \
      --with-http_slice_module \
      --with-http_ssl_module \
      --with-http_stub_status_module \
      --with-http_sub_module \
      --with-http_v2_module \
      --with-mail \
      --with-mail_ssl_module \
      --with-stream \
      --with-stream_realip_module \
      --with-stream_ssl_module \
      --with-stream_ssl_preread_module \
      --with-cc-opt='-O2 -g -pipe -Wall -Wp,-D_FORTIFY_SOURCE=2 -fexceptions -fstack-protector-strong --param=ssp-buffer-size=4 -grecord-gcc-switches -m64 -mtune=generic -fPIC' \
      --with-ld-opt='-Wl,-z,relro -Wl,-z,now -pie' \
      --add-module=../ngx_brotli \
  && make --quiet \
  && make install
COPY nginx.conf /usr/local/nginx/conf/nginx.conf

# Install supervisor
RUN easy_install supervisor \
  && mkdir -p /etc/supervisor/conf.d
COPY supervisord.conf /etc/supervisor/supervisord.conf

# Fix permissions file-permission error
RUN chmod -R 777 /usr/local/nginx \
  && chmod -R 777 /usr/share/nginx

# Set internal registry
RUN curl -k -u $ARTIFACTORY_USER:$ARTIFACTORY_PW https://bin.sbb.ch/artifactory/api/npm/auth > ~/.npmrc
RUN npm config set registry https://bin.sbb.ch/artifactory/api/npm/npm/
COPY package.json /usr/share/app/package.json
RUN cd /usr/share/app && yarn install --production=true --non-interactive
COPY index.pug /usr/share/app/index.pug
COPY app.js /usr/share/app/app.js

EXPOSE 8080

CMD ["/usr/bin/supervisord"]
