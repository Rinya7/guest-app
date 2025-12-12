 

# ============================================
# Guest App - Інструкції по деплою на сервер
# ============================================

## 🔵 Локальна розробка

```bash
cd guest
npm install
npm run dev
```

**Працює на:** http://localhost:5174

**Приклад URL з токеном:**
- http://localhost:5174/access/6e4924f9e2144670ecc30421ad7d5234e89d854c799137fa96e74344306bf32a/stay

---

## 🔵 Завантаження змін на сервер

```bash
git add .
git commit -m "опис змін"
git push
```

---

## 🔵 Деплой на сервері

### 🆕 Первична налаштування (тільки один раз)

**⚠️ ВАЖЛИВО:** Ці файли створюються на сервері один раз і не оновлюються через `git pull` (вони в `.gitignore`).

#### 1. Створити Dockerfile на сервері:

```bash
cd /opt/hotel/guest
cat > Dockerfile << 'EOF'
# ============================
# Stage 1 — Build Vite project
# ============================
FROM node:20-alpine AS builder
WORKDIR /app

# Копіюємо package файли для кешування залежностей
COPY package.json package-lock.json ./
RUN npm ci

# Копіюємо весь код та .env.production (важливо для збірки!)
COPY . .
# ⚠️ ВАЖЛИВО: .env.production має бути в директорії перед збіркою
# Vite читає його під час npm run build -- --mode production

# Збираємо проект з production режимом
# ⚠️ ВАЖЛИВО: --mode production обов'язковий для використання .env.production
RUN npm run build -- --mode production

# ============================
# Stage 2 — Serve with Nginx
# ============================
FROM nginx:stable-alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*

# Копіюємо зібраний dist з builder stage
COPY --from=builder /app/dist ./

# Копіюємо конфігурацію nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
EOF
```

#### 2. Створити docker-compose.yml на сервері:

```bash
cat > docker-compose.yml << 'EOF'
services:
  guest:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: hotel-guest
    restart: unless-stopped
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.guest.rule=Host(`guest.hotel-lotse.app`)"
      - "traefik.http.routers.guest.entrypoints=websecure"
      - "traefik.http.routers.guest.tls.certresolver=cf"
      - "traefik.http.services.guest.loadbalancer.server.port=80"
    networks:
      - traefik_net

networks:
  traefik_net:
    external: true
EOF
```

#### 3. Створити nginx.conf на сервері:

```bash
cat > nginx.conf << 'EOF'
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;
    
    # ⚠️ ВАЖЛИВО: для Vue Router history mode
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Кешування статичних файлів
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF
```

#### 4. Створити .env.production на сервері:

```bash
cat > .env.production << 'EOF'
VITE_API_URL=https://api.hotel-lotse.app
EOF
```

**✅ Після первичної налаштування ці файли залишаються на сервері і не змінюються при `git pull`.**

### 📋 Кроки деплою (після первичної налаштування):

```bash
# 1. Підключитися до сервера
ssh root@46.224.81.114

# 2. Перейти в директорію guest
cd /opt/hotel/guest
# або
cd /opt/hotel-lotse/guest

# 3. Оновити код з GitHub
git pull

# 4. Перевірити наявність .env.production (створюється один раз)
cat .env.production
# Має містити: VITE_API_URL=https://api.hotel-lotse.app

# 5. ПЕРЕСОБРАТИ КОНТЕЙНЕР (важливо після змін у коді)
docker compose build --no-cache

# 6. Перезапустити контейнер
docker compose up -d

# 7. Перевірити логи
docker logs hotel-guest
```

**⚠️ Примітка:** Dockerfile, docker-compose.yml, nginx.conf та .env.production **НЕ оновлюються** через `git pull` (вони в `.gitignore`). Якщо потрібно їх змінити - редагуйте вручну на сервері.

### 🔍 Перевірка після деплою:

1. **Перевірка контейнера:**
   ```bash
   docker ps | grep guest
   docker logs hotel-guest
   ```

2. **Перевірка Traefik маршрутизації:**
   ```bash
   docker network inspect traefik_net | grep guest
   docker inspect hotel-guest | grep traefik
   ```

3. **Перевірка через браузер:**
   - Відкрити: https://guest.hotel-lotse.app
   - Перевірити URL з токеном: https://guest.hotel-lotse.app/access/{token}/stay

### ⚠️ Типові проблеми:

1. **404 Not Found через Traefik:**
   - Перевірити labels в `docker-compose.yml`
   - Перезапустити Traefik: `docker restart traefik-traefik-1`
   - Перевірити network: `docker network inspect traefik_net`

2. **Помилка збірки (не знайдено .env.production):**
   - Створити `.env.production` на сервері
   - Додати: `VITE_API_URL=https://api.hotel-lotse.app`

3. **Роутинг не працює (404 на підроутах):**
   - Перевірити `nginx.conf`: має бути `try_files $uri $uri/ /index.html;`
   - Перевірити, що `nginx.conf` скопійований в Dockerfile

4. **API запити йдуть на localhost:**
   - ⚠️ **КРИТИЧНО:** Перевірити `Dockerfile` на сервері
   - В Dockerfile має бути: `RUN npm run build -- --mode production`
   - Якщо там просто `RUN npm run build` (без `--mode production`), то `.env.production` НЕ використовується
   - Результат: `VITE_API_URL` буде дефолтним (`http://localhost:3000`) замість `https://api.hotel-lotse.app`
   - **Рішення:** 
     - Відредагувати Dockerfile на сервері: `nano /opt/hotel/guest/Dockerfile`
     - Знайти рядок: `RUN npm run build`
     - Замінити на: `RUN npm run build -- --mode production`
     - Зберегти файл
     - Пересобрати: `docker compose build --no-cache && docker compose up -d`

5. **Приложение работает локально, но не работает на сервере:**
   - **Найчастіша причина:** Dockerfile не использует `--mode production`
   - Перевірити в Dockerfile: має бути `RUN npm run build -- --mode production`
   - Перевірити наявність `.env.production` на сервері з правильним `VITE_API_URL`
   - Перевірити логи контейнера: `docker logs hotel-guest`
   - Перевірити Traefik маршрутизацію: `docker inspect hotel-guest | grep traefik`
   - Перевірити network: `docker network inspect traefik_net | grep guest`

---

## 📝 Структура файлів на сервері (приклад):

```
/opt/hotel/guest/
├── Dockerfile              # ⚠️ Має бути на сервері (не в git)
├── docker-compose.yml      # ⚠️ Має бути на сервері (не в git)
├── nginx.conf             # ⚠️ Має бути на сервері (не в git)
├── .env.production         # ⚠️ Має бути на сервері (не в git)
├── .gitignore             # В git (виключає Dockerfile, docker-compose.yml, .env.production)
├── package.json
├── vite.config.ts
└── src/                   # Код додатку
```

**Примітка:** 
- Dockerfile, docker-compose.yml, nginx.conf та .env.production **створюються на сервері один раз** при первичній налаштуванні
- Вони **не в git** (в `.gitignore`), тому не оновлюються через `git pull`
- Якщо потрібно їх змінити - редагуйте вручну на сервері
- Після зміни цих файлів обов'язково пересоберіть контейнер: `docker compose build --no-cache && docker compose up -d`



  