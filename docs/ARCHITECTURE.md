# Luz Secreta — Arquitectura del MVP

## Visión general

Luz Secreta es una aplicación social anónima para grupos de amigas. El principio arquitectónico central es **anonimato por diseño**: la identidad de quien activa una "luz" se almacena internamente para auditoría y rate-limiting, pero **nunca se expone** en la API, notificaciones ni estadísticas.

```
┌─────────────────┐     HTTPS/REST      ┌─────────────────┐
│  Expo (RN)      │ ◄─────────────────► │  Express API    │
│  Mobile App     │     JWT Bearer      │  Node.js        │
└────────┬────────┘                     └────────┬────────┘
         │                                         │
         │ Expo Push                             │ Prisma ORM
         ▼                                         ▼
┌─────────────────┐                     ┌─────────────────┐
│  Expo Push      │                     │  PostgreSQL     │
│  Service        │                     │  (Docker)       │
└─────────────────┘                     └─────────────────┘
```

## Decisiones técnicas

### Frontend: React Native + Expo

| Decisión | Justificación |
|----------|---------------|
| **Expo SDK 52** | Desarrollo rápido, OTA updates, push notifications nativas con `expo-notifications` |
| **Expo Router** | Navegación basada en archivos, deep linking para invitaciones (`luzsecreta://join/CODE`) |
| **Context + AsyncStorage** | Estado de auth simple sin Redux; suficiente para MVP |
| **Reanimated + Moti** | Animaciones fluidas de la "luz" sin sacrificar rendimiento |

### Backend: Node.js + Express

| Decisión | Justificación |
|----------|---------------|
| **Express** | Maduro, flexible, bajo overhead para MVP |
| **Prisma** | Type-safe, migraciones, excelente DX con PostgreSQL |
| **JWT (access + refresh)** | Stateless, escalable; refresh tokens en DB para revocación |
| **bcrypt** | Hash de contraseñas con cost factor 12 |
| **express-validator** | Validación declarativa de inputs |

### Base de datos: PostgreSQL

| Decisión | Justificación |
|----------|---------------|
| **PostgreSQL** | ACID, JSON para metadata, índices compuestos para stats |
| **UUIDs** | IDs no secuenciales; dificultan inferencia de orden/timing |
| **Soft delete en grupos** | Preserva integridad referencial de eventos históricos |

### Anonimato (capa crítica)

```
LightEvent {
  id, groupId, triggeredAt
  userId  ← SOLO uso interno (rate limit, moderación)
}

API Response (público al grupo):
{
  id, groupId, triggeredAt,
  message: "Alguien tuvo un momento especial ✨",
  reactions: [{ emoji, count }]  // sin userId
}
```

- El `userId` en `LightEvent` **nunca** aparece en SELECT expuesto.
- Las reacciones se agregan por emoji; no se muestra quién reaccionó en el feed del grupo (MVP).
- Estadísticas: solo `COUNT(*)` y `MAX(streak)` a nivel grupo.

### Notificaciones push

1. Cliente registra `expoPushToken` al iniciar sesión.
2. Al crear `LightEvent`, el servicio envía push a todos los miembros **excepto** quien activó (opcional: también incluirla con mensaje genérico).
3. Payload genérico: `"Una luz acaba de encenderse ✨"` — sin metadata de usuario.

### Seguridad

- Rate limit: máx. 10 luces/hora por usuario (anti-spam).
- Grupos: 2–20 miembros enforced en service layer.
- Códigos de invitación: 8 caracteres alfanuméricos, únicos, case-insensitive.
- CORS restringido a origins de desarrollo/producción.
- Helmet para headers HTTP seguros.

### Escalabilidad futura (sin implementar en MVP)

- WebSockets (Socket.io) para luz en tiempo real → polling cada 5s en MVP.
- Redis para rate limiting y sesiones.
- Cola (Bull/BullMQ) para push notifications masivas.
- CDN para assets estáticos.

## Flujos principales

### Encender luz

```
Usuario → POST /groups/:id/lights
       → Validar membresía + rate limit
       → INSERT LightEvent (userId interno)
       → Calcular mensaje aleatorio del pool
       → Enviar push a miembros
       → Return evento anónimo
```

### Unirse a grupo

```
Usuario → POST /groups/join { inviteCode }
       → Validar código + límite 20 miembros
       → INSERT GroupMember
       → Return grupo
```

## Estructura de despliegue (producción futura)

```
                    ┌──────────────┐
                    │   Vercel /   │
                    │   Railway    │  ← API
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
        PostgreSQL    Expo EAS Build   Sentry
        (Neon/Supabase)  (iOS/Android)
```
