FROM node:8.11.4

# Create app directory
RUN mkdir /usr/src/speed-reading
WORKDIR /usr/src/speed-reading

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Run tests
CMD [ "npm", "test" ]