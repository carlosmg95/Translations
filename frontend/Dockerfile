FROM node

COPY . ./translations-frontend

WORKDIR translations-frontend

RUN npm install
RUN npm install -g serve
RUN npm run build

EXPOSE 5000

CMD serve -s build