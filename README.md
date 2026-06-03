# Encender Fuego 🔥

App minimalista para grupos de amigas. Un botón. Una notificación. Nadie sabe quién fue.

**Repositorio:** [github.com/josedaminato/carenapp](https://github.com/josedaminato/carenapp)

## Qué hace

1. Las amigas se registran y forman un grupo (código de invitación).
2. Entran al grupo y ven el botón **🔥 ENCENDER FUEGO**.
3. Al apretarlo:
   - Su celular **vibra** (si dieron permiso).
   - El resto recibe: **"🔥 Alguien encendió el fuego."**
   - Nadie sabe quién fue.

## Qué NO hace

- Sin chat, estadísticas, muro, reacciones ni rankings.
- Sin hora, fecha ni historial visible.

## Inicio rápido

```bash
# Base de datos
docker compose up -d postgres

# Backend
cd backend
npm install
npx prisma db push
npm run dev

# App
cd mobile
npm install
npx expo start
```

> En Android/emulador: cambiá `apiUrl` en `mobile/app.json` a `http://10.0.2.2:3000/api`.

## API (MVP)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/register` | Registro |
| POST | `/api/auth/login` | Login |
| GET | `/api/groups` | Mis grupos |
| POST | `/api/groups` | Crear grupo |
| POST | `/api/groups/join` | Unirse con código |
| GET | `/api/groups/:id` | Estado del fuego |
| POST | `/api/groups/:id/fire` | Encender fuego |
| POST | `/api/push/register` | Token push |

## Stack

- **Mobile:** React Native + Expo
- **Backend:** Node.js + Express + Prisma
- **DB:** PostgreSQL
