FROM nginx:latest

WORKDIR /usr/src/app

COPY ./front/package*.json ./

RUN apt-get update

RUN apt-get install -y nodejs npm

RUN npm install

COPY ./front ./

RUN npm run build

RUN cp -r ./dist/* /usr/share/nginx/html/

COPY server.conf /etc/nginx/nginx.conf
