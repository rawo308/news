# Use nginx alpine image for smaller size
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/

# Copy all frontend files to nginx html directory
COPY index.html /usr/share/nginx/html/
COPY admin.html /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY ["ramya logo.png", "/usr/share/nginx/html/"]

# Copy JavaScript modules
COPY js/ /usr/share/nginx/html/js/

# Copy pages directory
COPY pages/ /usr/share/nginx/html/pages/

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
