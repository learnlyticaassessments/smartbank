FROM node:20-alpine AS build
WORKDIR /app
COPY package.json angular.json tsconfig.json tsconfig.app.json ./
COPY src ./src
RUN npm install
RUN npm run build

FROM nginx:alpine
# Copy esbuild/browser output (Angular 17 default) into nginx html root
COPY --from=build /app/dist/smartbank-frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
