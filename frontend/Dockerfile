FROM node:10.16.3 as node

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app/

COPY . ./

ENV NODE_ENV=production

RUN npm install -g serve
RUN npm install --production
ENV REACT_APP_API_ENDPOINT=http://translations-api.bitbloq.cc
RUN npm run build

EXPOSE 5000

RUN chmod +x /usr/src/app/docker-entrypoint.sh

ENTRYPOINT ["/usr/src/app/docker-entrypoint.sh"]