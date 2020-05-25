FROM node:alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
COPY wait.sh ./

RUN chmod +x wait.sh
RUN apk add --no-cache git
RUN npm install

# Bundle app source
COPY bin/ ./bin
COPY config/ ./config
COPY controllers/ ./controllers
COPY migrations/ ./migrations
COPY models/ ./models
COPY public/ ./public
COPY routes/ ./routes
COPY seeders/ ./seeders
COPY views/ ./views
COPY app.js .

#EXPOSE 5000
# CMD [ "npm", "start" ]
# CMD ls -la
CMD sh wait.sh database_group9 33060 \
    && npm install -g sequelize-cli \
    && npm install -g node-dev \
    && sequelize db:migrate:undo:all \
    && sequelize db:migrate \
    && sequelize db:seed:undo:all \
    && sequelize db:seed:all \
    && npm start
