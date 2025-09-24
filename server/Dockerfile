# Use Node 22 official image
FROM node:22.18.0

# Create app directory
WORKDIR /app

# Copy package.json & package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy source code
COPY . .

# Expose backend port (change if not 5000)
EXPOSE 4000

# Start server
CMD ["npm", "run", "start"]
