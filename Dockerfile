FROM node:lts-alpine

ENV NODE_ENV=production
WORKDIR /usr/src/app

# Copy dependency files first and install
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../

# Copy rest of the app
COPY . .

# Set timezone (install tzdata as root)
RUN apk add --no-cache tzdata

# Set timezone environment
ENV TZ=Asia/Bangkok

# Change permissions and switch user
RUN chown -R node /usr/src/app
USER node

EXPOSE 3000

# CMD ["npm", "start"]
CMD ["npm", "run", "dev"]
