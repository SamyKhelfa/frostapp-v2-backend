FROM node:20.9.0-alpine

WORKDIR /usr/src/app

RUN npm i

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 5050 

CMD ["npm", "run", "dev"]