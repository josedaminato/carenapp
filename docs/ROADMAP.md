# Luz Secreta — Roadmap hacia versión comercial

## Fase 0 — MVP (actual) ✅

- Auth email/password + JWT
- Grupos privados con código de invitación (2–20 miembros)
- Botón "Encender luz" con anonimato total
- Muro de eventos con mensajes aleatorios
- Estadísticas grupales (día, semana, racha)
- Reacciones con emojis agregadas
- Push notifications básicas (Expo)
- Docker para desarrollo local

---

## Fase 1 — Beta cerrada (4–6 semanas)

| Feature | Valor | Esfuerzo |
|---------|-------|----------|
| WebSockets tiempo real | Luz instantánea sin polling | Medio |
| Verificación email | Seguridad y deliverability | Bajo |
| Rate limiting con Redis | Anti-abuso en producción | Medio |
| Animaciones premium de luz | Diferenciación UX | Medio |
| Onboarding interactivo | Retención D1 | Bajo |
| Analytics (Mixpanel/Amplitude) | Métricas de producto | Bajo |
| Sentry + logging estructurado | Observabilidad | Bajo |

**KPIs beta:** DAU/MAU, luces/grupo/día, retención D7, grupos creados.

---

## Fase 2 — Lanzamiento público (8–12 semanas)

| Feature | Descripción |
|---------|-------------|
| **App Store + Google Play** | EAS Build, revisión de guidelines (contenido adulto suave → clasificación 17+) |
| **OAuth social** | Sign in with Apple, Google |
| **Moderación** | Reportar grupo, bloquear usuario, TOS |
| **Privacidad GDPR/CCPA** | Exportar datos, eliminar cuenta |
| **Deep links universales** | `luzsecreta.app/join/CODE` |
| **Modo oscuro/claro** | Preferencia de usuario |
| **Localización** | ES, EN, PT inicial |

**Monetización exploratoria (sin implementar aún):**
- Freemium: grupos ilimitados vs. 2 grupos gratis
- Temas visuales premium (paletas de luz)
- Sin ads en MVP comercial inicial (marca sensible)

---

## Fase 3 — Crecimiento (3–6 meses)

| Feature | Descripción |
|---------|-------------|
| **Rachas y logros grupales** | Badges: "Semana de fuego", "Noche activa" |
| **Eventos especiales** | Modo "Noche de chicas" con timer |
| **Invitaciones por link/QR** | Menos fricción que código manual |
| **Widget iOS/Android** | Botón rápido encender luz |
| **Notificaciones inteligentes** | "Tu grupo está activo" basado en actividad |
| **Admin de grupo** | Expulsar, regenerar código |
| **Backup y export** | Historial anonimizado del grupo |

---

## Fase 4 — Escala comercial (6–12 meses)

| Área | Iniciativas |
|------|-------------|
| **Infra** | Kubernetes, multi-región, CDN |
| **Seguridad** | Pentest, SOC2 path, cifrado E2E opcional |
| **ML/Insights** | Patrones de actividad (siempre agregados, nunca individuales) |
| **Partnerships** | Influencers, comunidades de bienestar femenino |
| **B2B light** | Grupos corporativos wellness (exploratorio) |

---

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|--------|------------|
| Rechazo App Store por contenido sexual | Clasificación 17+, lenguaje euphemístico, sin contenido explícito |
| Abuso / spam de luces | Rate limits, reportes, moderación |
| Filtración de identidad | Auditorías de API, tests de anonimato automatizados |
| Baja retención | Onboarding, push inteligentes, rachas grupales |
| Privacidad / datos sensibles | Minimizar PII, política clara, eliminación de cuenta |

---

## Stack evolutivo

```
MVP          → Beta           → Producción
Express      → Express + WS     → Microservicios (auth, events, notify)
PostgreSQL   → PG + Redis       → PG + Redis + Read replicas
Polling 5s   → Socket.io        → Socket.io + fallback polling
Expo Go      → EAS dev builds   → Store releases + OTA
```

---

## Métricas de éxito comercial

1. **Activación:** Usuario crea o une grupo en < 24h del registro
2. **Engagement:** ≥ 3 luces/semana por grupo activo
3. **Retención D30:** ≥ 25% de cohortes
4. **Viralidad:** K-factor > 0.5 (invitaciones convertidas)
5. **NPS:** ≥ 40 en encuesta in-app post-semana 2
