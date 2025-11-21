# Dockerfile
FROM node:20

WORKDIR /app

# Copy only package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the code
COPY . .

# Expose ports for Expo
EXPOSE 19000 19001 19002 19006

# Start Expo in tunnel mode WITHOUT dev-client
CMD ["npx", "expo", "start", "--web", "--lan"]