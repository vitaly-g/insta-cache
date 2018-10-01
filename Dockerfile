FROM node:8.10.0-alpine
WORKDIR /app/
COPY . .
RUN  npm install
EXPOSE 80
ENTRYPOINT ["node", "/app/index.js"]