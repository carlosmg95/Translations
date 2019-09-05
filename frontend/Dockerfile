FROM node

RUN npm install -g serve
RUN git clone https://github.com/Bitbloq/Translations.git

WORKDIR Translations

RUN git checkout develop

WORKDIR frontend

RUN npm install
RUN npm run build

EXPOSE 5000

CMD serve -s build