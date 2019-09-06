FROM node

RUN git clone https://github.com/Bitbloq/Translations.git --branch develop

WORKDIR Translations/api

RUN npm install
RUN npm install -g \
  prisma \
  typescript
RUN prisma deploy -e ./config/prod.env

EXPOSE 4000

CMD npm start