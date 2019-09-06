FROM node

RUN git clone https://github.com/Bitbloq/Translations.git --branch develop

WORKDIR Translations/frontend

RUN npm install
RUN npm install -g serve
RUN npm run build

EXPOSE 5000

CMD serve -s build