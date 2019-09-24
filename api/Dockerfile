FROM node

COPY . ./translations-api

WORKDIR translations-api

RUN npm install
RUN npm install -g \
  prisma \
  typescript

EXPOSE 4000

CMD npm start