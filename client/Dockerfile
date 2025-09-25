FROM node:22.18.0 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install

# Copy everything, but specifically use the production env
COPY . .
COPY .env.production .env

RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
