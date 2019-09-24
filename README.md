# Translations
Bitbloq Translations

## How to use

### Terminal

#### Start

_*It has been tested in Ubuntu 19.04_

1. Go to `api/prima` and run `sudo docker-compose up -d`. If it returns an error beacuse of MySQL, you will comment the ports lines of the MySQL service in `docker-compose.yml` or stop MySQL locally with `sudo service mysql stop`.

2. Go to `api` and run `npm start`.

3. Go to `fronted` and run `npm start`.

4. If the page didn't appear, you would open the browser and enter in `localhost:3000`.

#### Database

There are some ways:

  - Enter in `localhost:4466` and use GraphQL.
  - Run `mysql -h 127.0.0.1 -P 3306 -u root -p` command. **Password=prisma**
  - Use a MySQL workbench.

_*The last two won't work if you have commented ports lines._

### Docker

1. Run `docker-compose up -d`.
2. Open the browser and enter in `localhost:5000`.
