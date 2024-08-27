# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Bundle app source inside the Docker image 
# (by copying everything from the current directory to the working directory in the Docker image)
COPY . .

# Make port 3080 available to the world outside this container
EXPOSE 3000

# Run the app when the container launches
CMD ["node", "server.js"]