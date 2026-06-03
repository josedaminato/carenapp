# Luz Secreta — API REST

Base URL: `http://localhost:3000/api`

## Autenticación

Todas las rutas protegidas requieren header:
```
Authorization: Bearer <accessToken>
```

### POST /auth/register
```json
{ "email": "ana@email.com", "password": "12345678", "displayName": "Ana" }
```
**201** → `{ user, accessToken, refreshToken }`

### POST /auth/login
```json
{ "email": "ana@email.com", "password": "12345678" }
```

### POST /auth/refresh
```json
{ "refreshToken": "..." }
```

### POST /auth/logout
```json
{ "refreshToken": "..." }
```

### POST /auth/forgot-password
```json
{ "email": "ana@email.com" }
```

### POST /auth/reset-password
```json
{ "token": "uuid-token", "newPassword": "nueva1234" }
```

### GET /auth/me
Requiere auth. → `{ user }`

---

## Grupos

### GET /groups
Lista grupos del usuario. → `{ groups: [{ id, name, inviteCode, memberCount, lightsToday }] }`

### POST /groups
```json
{ "name": "Las Reinas" }
```

### POST /groups/join
```json
{ "inviteCode": "ABC12XYZ" }
```

### GET /groups/:id
Detalle con stats y feed. → `{ group: { ..., stats: { today, week, streak }, feed: [...] } }`

### POST /groups/:id/lights
Enciende la luz (anónimo). → `{ event: { id, groupId, message, triggeredAt } }`

### GET /groups/:id/feed
Muro de eventos anónimos.

### GET /groups/:id/stats
Estadísticas grupales agregadas.

---

## Reacciones

### POST /events/:eventId/reactions
```json
{ "emoji": "✨" }
```
Emojis permitidos: ✨ 🔥 💜 😍 👏 💫 🌙 ❤️‍🔥

### DELETE /events/:eventId/reactions
```json
{ "emoji": "✨" }
```

---

## Push

### POST /push/register
```json
{ "token": "ExponentPushToken[...]", "platform": "ios" }
```

### POST /push/unregister
```json
{ "token": "ExponentPushToken[...]" }
```

---

## Anonimato

Ningún endpoint expone `userId` en eventos de luz ni estadísticas individuales.
Las reacciones se devuelven agregadas por emoji.
