FROM node:10.15.3 as node

RUN mkdir -p /usr/src/app
RUN mkdir -p /usr/src/app/src
WORKDIR /usr/src/app

COPY . ./

RUN npm install --production
RUN npm run build

RUN chmod +x /usr/src/app/docker-entrypoint.sh

EXPOSE 5000

ENTRYPOINT ["/usr/src/app/docker-entrypoint.sh"]