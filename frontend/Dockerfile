FROM node:10.16.3 as node

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app/

COPY . ./

ENV NODE_ENV=production

RUN npm install -g serve
RUN npm install --production
RUN npm run build

EXPOSE 5000

RUN ls
RUN chmod +x /usr/src/app/docker-entrypoint.sh

ENTRYPOINT ["/usr/src/app/docker-entrypoint.sh"]