# Stage 1: Build stage
FROM node:20-slim AS build-stage

# Install pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy project files
COPY . .

# Build the application
RUN pnpm run build-only

# Stage 2: Production stage
FROM nginx:stable-alpine AS production-stage

# Copy built files from build-stage to nginx public folder
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy custom nginx configuration to handle Vue Router history mode
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
    error_page 500 502 503 504 /50x.html; \
    location = /50x.html { \
        root /usr/share/nginx/html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
