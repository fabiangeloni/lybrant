# Usar imagen oficial de nginx (ligera y optimizada para sitios estáticos)
FROM nginx:alpine

# Eliminar la configuración por defecto de nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiar configuración personalizada de nginx (si existe)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar todos los archivos estáticos al directorio de nginx
COPY . /usr/share/nginx/html/

# Exponer el puerto 80 (nginx por defecto)
EXPOSE 80

# Comando para iniciar nginx en modo foreground
CMD ["nginx", "-g", "daemon off;"]

