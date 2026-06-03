# Luz Secreta ✨

Aplicación social y lúdica para grupos de amigas. Cuando alguien enciende la "luz", todo el grupo lo sabe — sin revelar quién fue.

## Estructura del proyecto

```
CarenApp/
├── docs/
│   ├── ARCHITECTURE.md    # Arquitectura y decisiones técnicas
│   ├── WIREFRAMES.md      # Wireframes en texto
│   ├── ROADMAP.md         # Evolución hacia versión comercial
│   └── API.md             # Documentación REST
├── backend/               # API Node.js + Express + Prisma
│   ├── prisma/schema.prisma
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── routes/
│       ├── services/
│       └── utils/
├── mobile/                # App React Native + Expo
│   ├── app/               # Pantallas (Expo Router)
│   └── src/
│       ├── components/
│       ├── context/
│       ├── hooks/
│       ├── services/
│       └── theme/
└── docker-compose.yml
```

## Requisitos

- Node.js 20+
- Docker Desktop
- Expo Go (móvil) o emulador

## Inicio rápido

### 1. Base de datos y API (Docker)

```bash
docker compose up -d postgres
```

### 2. Backend (desarrollo local)

```bash
cd backend
cp .env.example .env
npm install
npx prisma generate
npx prisma db push
npm run dev
```

API disponible en `http://localhost:3000`

### 3. App móvil

```bash
cd mobile
npm install
npx expo start
```

> **Nota Android/emulador:** Cambia `apiUrl` en `mobile/app.json` a `http://10.0.2.2:3000/api` (Android emulator) o la IP de tu máquina en red local.

### Todo con Docker

```bash
docker compose up --build
```

## Pantallas implementadas

| Pantalla | Ruta |
|----------|------|
| Bienvenida | `/(auth)/welcome` |
| Registro | `/(auth)/register` |
| Login | `/(auth)/login` |
| Recuperar contraseña | `/(auth)/forgot-password` |
| Home (mis grupos) | `/(app)/home` |
| Crear grupo | `/(app)/create-group` |
| Unirse con código | `/(app)/join-group` |
| Grupo (luz + muro + stats) | `/(app)/group/[id]` |

## Principio de anonimato

- `LightEvent.userId` existe en BD solo para rate-limit y moderación.
- Ningún endpoint REST expone quién activó una luz.
- Estadísticas siempre agregadas a nivel grupo.
- Reacciones devueltas como conteos por emoji.

## Documentación

- [Arquitectura](./docs/ARCHITECTURE.md)
- [Wireframes](./docs/WIREFRAMES.md)
- [API REST](./docs/API.md)
- [Roadmap comercial](./docs/ROADMAP.md)

## Licencia

Proyecto privado — MVP de desarrollo.
