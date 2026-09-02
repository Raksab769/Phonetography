# Use a lightweight web server image to serve static files
FROM nginx:alpine

# Remove the default nginx welcome page
RUN rm -rf /usr/share/nginx/html/*

# Copy the site files into nginx's web root
COPY . /usr/share/nginx/html

# nginx listens on port 80 by default
EXPOSE 80

# nginx's default entrypoint already starts the server — no CMD override needed
