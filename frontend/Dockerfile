FROM node:10.16.3 as node

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app/

COPY . ./

ENV NODE_ENV=production

RUN npm install --production
RUN npm run build

FROM nginx:1.13

COPY --from=node /usr/src/app/frontend/public/ /usr/share/nginx/html
COPY /packages/frontend/nginx-config.conf /etc/nginx/conf.d/default.conf

CMD /bin/bash -c "nginx -g 'daemon off;'"

ENTRYPOINT ["/usr/src/app/docker-entrypoint.sh"]