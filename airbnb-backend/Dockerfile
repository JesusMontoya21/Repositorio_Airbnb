FROM php:8.2-fpm

# Instalar extensiones necesarias
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libpq-dev \
    libzip-dev \
    zip \
    && docker-php-ext-install pdo pdo_pgsql \
    && docker-php-ext-configure zip \
    && docker-php-ext-install zip

# Instalar Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Directorio de trabajo
WORKDIR /var/www/html

# Copiar el proyecto
COPY . .

# Instalar dependencias
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Permisos correctos
RUN chown -R www-data:www-data storage bootstrap/cache

# Exponer puerto
EXPOSE 9000

# Iniciar PHP-FPM
CMD ["php-fpm"]