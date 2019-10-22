FROM node:10.15.3 as node

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . ./

RUN npm install --yes  --production
RUN npm install -g \
  prisma \
  typescript

EXPOSE 4000

RUN chmod +x /usr/src/app/docker-entrypoint.sh

ENTRYPOINT ["/usr/src/app/docker-entrypoint.sh"]