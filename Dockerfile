# Use official Node.js LTS image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and lock file first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Expose the port Next.js runs on
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production

# Build the Next.js app
RUN npm run build

# Start the Next.js server
CMD ["npm", "start"]
