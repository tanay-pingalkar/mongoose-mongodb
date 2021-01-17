FROM node:12



WORKDIR /learn mongodb



COPY package*.json ./



RUN npm install

COPY . .


ENV PORT=9000

EXPOSE 9000

CMD ["node","index.js"]



