FROM node:10.15.3 as node

RUN mkdir -p /usr/src/app
RUN mkdir -p /usr/src/app/src
WORKDIR /usr/src/app


RUN npm install --yes
RUN npm install -g \
  prisma \
  typescript

EXPOSE 4000

RUN chmod a+x /usr/src/app/docker-entrypoint.sh

ENTRYPOINT ["/usr/src/app/docker-entrypoint.sh"]