# Lybrant - Sitio Web Estático

Sitio web estático para Lybran - Agencia QA Automation & DevOps

## 🚀 Inicio Rápido con Docker

### Requisitos Previos
- Docker
- Docker Compose

### Levantar el sitio

#### Opción 1: Puerto por defecto (8080)
```bash
docker-compose up -d
```

#### Opción 2: Puerto personalizado
```bash
PORT=3000 docker-compose up -d
```

O crear un archivo `.env` en la raíz del proyecto:
```bash
echo "PORT=3000" > .env
docker-compose up -d
```

El archivo `.env` permite configurar variables de entorno de forma persistente.

### Acceder al sitio
Una vez levantado, accede a:
- http://localhost:8080 (puerto por defecto)
- http://localhost:3000 (si especificaste otro puerto)

### Comandos útiles

```bash
# Ver logs
docker-compose logs -f

# Detener el contenedor
docker-compose down

# Reconstruir la imagen
docker-compose build --no-cache

# Ver estado
docker-compose ps
```

## 📁 Estructura del Proyecto

```
.
├── assets/
│   ├── images/        # Todas las imágenes (PNG, JPG, SVG, etc.)
│   └── videos/        # Videos (MP4)
├── css/
│   └── style.css     # Estilos CSS
├── js/
│   └── script.js     # JavaScript principal
├── index.html        # Página principal (ES)
├── index-en.html     # Página principal (EN)
├── Dockerfile        # Configuración Docker
├── docker-compose.yml # Orquestación Docker
├── nginx.conf        # Configuración Nginx optimizada
└── README.md         # Este archivo
```

## 🔧 Desarrollo Local (sin Docker)

Simplemente abre `index.html` en tu navegador o usa un servidor local:

```bash
# Con Python 3
python3 -m http.server 8080

# Con Node.js (http-server)
npx http-server -p 8080
```

## 📝 Notas

- El sitio utiliza recursos externos (CDN) para librerías como GSAP, Splide, etc.
- Asegúrate de tener conexión a internet para cargar correctamente todos los recursos.

