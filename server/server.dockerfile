FROM nginx:latest

WORKDIR /usr/src/app

COPY ./front/package*.json ./

RUN curl -sL https://deb.nodesource.com/setup_10.x | bash - \
    && apt-get install -y nodejs

RUN npm install

COPY ./front ./

RUN npm run build

RUN cp -r ./dist/* /usr/share/nginx/html/

COPY server.conf /etc/nginx/nginx.conf