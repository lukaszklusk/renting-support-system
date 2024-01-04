FROM node:18-alpine
WORKDIR /rentsys
COPY public/ /rentsys/public
COPY src/ /rentsys/src
COPY package.json /rentsys/
EXPOSE 3000
RUN npm install
CMD ["npm", "run", "start"]
 