FROM nginx:alpine
COPY index.html /usr/share/nginx/html/index.html
RUN printf 'server {\n\
  listen 80;\n\
  root /usr/share/nginx/html;\n\
  add_header Cache-Control "no-store";\n\
  location / { try_files $uri /index.html; }\n\
}\n' > /etc/nginx/conf.d/default.conf
EXPOSE 80
