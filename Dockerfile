FROM node:18 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV REACT_APP_ROUTER_BASENAME=/
ENV REACT_APP_BACKEND_API_BASE_URL=http://localhost:8080/api

RUN npm run build

FROM nginx:alpine

COPY default.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
