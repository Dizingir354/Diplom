# Use the official Node.js image.
FROM node:14

# Create and change to the app directory.
WORKDIR /app

# Install app dependencies.
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install

# Copy app source code.
COPY frontend/ .

# Expose the port the app runs on.
EXPOSE 3000

# Start the app.
CMD ["npm", "start"]
