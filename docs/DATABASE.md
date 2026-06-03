# Luz Secreta — Modelo de base de datos

## Diagrama ER

```
┌─────────────┐       ┌──────────────┐       ┌─────────────┐
│    User     │───┬───│ GroupMember  │───────│    Group    │
└─────────────┘   │   └──────────────┘       └─────────────┘
      │           │                              │
      │           │                              │
      ▼           │                              ▼
┌─────────────┐   │                      ┌─────────────┐
│ RefreshToken│   │                      │ LightEvent  │
│ PushToken   │   └──────────────────────│ (userId 🔒) │
│ PasswordReset│                          └──────┬──────┘
└─────────────┘                                   │
                                                  ▼
                                           ┌─────────────┐
                                           │  Reaction   │
                                           └─────────────┘
```

🔒 = campo interno, nunca expuesto en API pública

---

## Tablas

### users
| Campo | Tipo | Notas |
|-------|------|-------|
| id | UUID PK | |
| email | VARCHAR UNIQUE | Normalizado a lowercase |
| password_hash | VARCHAR | bcrypt cost 12 |
| display_name | VARCHAR | Visible solo en perfio propio |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### groups
| Campo | Tipo | Notas |
|-------|------|-------|
| id | UUID PK | |
| name | VARCHAR | 2–60 chars |
| invite_code | VARCHAR UNIQUE | 8 chars, sin ambiguos (0/O, 1/I) |
| created_by | UUID | Referencia lógica, no FK estricta |
| is_active | BOOLEAN | Soft delete |
| created_at | TIMESTAMP | |

### group_members
| Campo | Tipo | Notas |
|-------|------|-------|
| id | UUID PK | |
| group_id | UUID FK → groups | CASCADE |
| user_id | UUID FK → users | CASCADE |
| joined_at | TIMESTAMP | |
| **UNIQUE** | (group_id, user_id) | Un usuario, una membresía por grupo |

**Regla de negocio:** 2–20 miembros por grupo (validado en service layer).

### light_events
| Campo | Tipo | Notas |
|-------|------|-------|
| id | UUID PK | |
| group_id | UUID FK | |
| user_id | UUID FK | **INTERNO** — anonimato en API |
| message | VARCHAR | Mensaje aleatorio del pool |
| triggered_at | TIMESTAMP | |

**Índices:** `(group_id, triggered_at)`, `(user_id, triggered_at)` para stats y rate limit.

### reactions
| Campo | Tipo | Notas |
|-------|------|-------|
| id | UUID PK | |
| light_event_id | UUID FK | |
| user_id | UUID FK | Quién reaccionó (no expuesto en feed agregado) |
| emoji | VARCHAR | Uno de 8 emojis permitidos |
| created_at | TIMESTAMP | |
| **UNIQUE** | (light_event_id, user_id, emoji) | Una reacción por emoji por usuario |

### refresh_tokens
Tokens JWT de refresco para revocación y rotación.

### password_reset_tokens
Tokens UUID de un solo uso, expiran en 1 hora.

### push_tokens
Tokens Expo Push por dispositivo, upsert al login.

---

## Consultas clave

### Stats del día (grupo)
```sql
SELECT COUNT(*) FROM light_events
WHERE group_id = ? AND triggered_at >= start_of_day;
```

### Racha del grupo
Días consecutivos con al menos 1 luz, contando desde hoy hacia atrás.

### Rate limit (usuario)
```sql
SELECT COUNT(*) FROM light_events
WHERE user_id = ? AND triggered_at >= now() - interval '1 hour';
-- Máximo 10
```

---

## Privacidad

| Dato | ¿Visible en API? |
|------|------------------|
| Quién encendió la luz | ❌ Nunca |
| Stats individuales | ❌ Nunca |
| Quién reaccionó | ❌ Solo conteos agregados (MVP) |
| Lista de miembros | ❌ Solo conteo en MVP |
| Código de invitación | ✅ Solo a miembros del grupo |
