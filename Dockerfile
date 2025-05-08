FROM nginx
COPY build /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["touch", "/var/log/ngingx/error.log"]
CMD ["touch", "/var/log/ngingx/access.log"]
CMD ["nginx", "-g", "daemon off;"]
