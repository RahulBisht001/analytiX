# This is a Dockerfile for the app deployment on AWS ECS

# Step 1: Use the official Node.js image
FROM node:22

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy only package.json and package-lock.json first
# this will help in optimization of build process.
COPY package.json package-lock.json ./

# Copy environment files
COPY .env ./


# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the project files
COPY . .

# Step 6: Build the Next.js application
RUN npm run build

# Step 7: Start the application
CMD ["npm", "start"]