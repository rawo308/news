# Use nginx alpine image for smaller size
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx configuration as template
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Copy all frontend files to nginx html directory
COPY index.html /usr/share/nginx/html/
COPY admin.html /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY ["ramya logo.png", "/usr/share/nginx/html/"]

# Copy JavaScript modules
COPY js/ /usr/share/nginx/html/js/

# Copy pages directory
COPY pages/ /usr/share/nginx/html/pages/

# Set default environment variables
ENV PORT=80
ENV BACKEND_URL=http://localhost:8000

# Expose port (Railway will set PORT)
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:${PORT}/ || exit 1

# Start nginx with envsubst for environment variable substitution
CMD envsubst '${PORT} ${BACKEND_URL}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'
