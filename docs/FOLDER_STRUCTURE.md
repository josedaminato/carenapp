# Luz Secreta — Estructura de carpetas

```
CarenApp/
│
├── docker-compose.yml          # PostgreSQL + API
├── README.md
├── .gitignore
│
├── docs/
│   ├── ARCHITECTURE.md         # Decisiones de arquitectura
│   ├── WIREFRAMES.md           # UI/UX en texto
│   ├── ROADMAP.md              # Plan comercial
│   ├── API.md                  # Endpoints REST
│   └── FOLDER_STRUCTURE.md     # Este archivo
│
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── .env.example
│   ├── prisma/
│   │   └── schema.prisma       # Modelo de datos
│   └── src/
│       ├── index.js            # Entry point
│       ├── app.js              # Express app
│       ├── config/
│       │   ├── index.js        # Variables de entorno
│       │   └── database.js     # Cliente Prisma
│       ├── middleware/
│       │   ├── auth.js         # JWT authenticate
│       │   ├── validate.js     # express-validator
│       │   └── errorHandler.js
│       ├── routes/
│       │   ├── authRoutes.js
│       │   ├── groupRoutes.js
│       │   ├── reactionRoutes.js
│       │   └── pushRoutes.js
│       ├── controllers/        # Capa HTTP delgada
│       ├── services/           # Lógica de negocio
│       └── utils/
│           ├── jwt.js
│           ├── inviteCode.js
│           └── messages.js
│
└── mobile/
    ├── app.json
    ├── package.json
    ├── babel.config.js
    ├── app/                    # Expo Router (pantallas)
    │   ├── _layout.js
    │   ├── index.js
    │   ├── (auth)/
    │   │   ├── welcome.js
    │   │   ├── register.js
    │   │   ├── login.js
    │   │   └── forgot-password.js
    │   └── (app)/
    │       ├── home.js
    │       ├── create-group.js
    │       ├── join-group.js
    │       └── group/[id].js
    └── src/
        ├── theme/              # Colores, spacing
        ├── services/api.js     # Cliente HTTP
        ├── context/AuthContext.js
        ├── hooks/usePushNotifications.js
        ├── components/
        │   ├── Button.js
        │   ├── LightOrb.js
        │   └── FeedItem.js
        └── constants/emojis.js
```

## Capas del backend

| Capa | Responsabilidad |
|------|-----------------|
| **Routes** | Definición de endpoints + validación de input |
| **Controllers** | Parse request → call service → HTTP response |
| **Services** | Reglas de negocio, anonimato, stats |
| **Prisma** | Persistencia PostgreSQL |

## Capas del mobile

| Capa | Responsabilidad |
|------|-----------------|
| **app/** | Pantallas y navegación (Expo Router) |
| **context/** | Estado global de autenticación |
| **services/** | Comunicación con API |
| **components/** | UI reutilizable |
| **theme/** | Design system (violeta/rosa/azul) |
