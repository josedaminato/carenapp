# Encender Fuego 🔥

App minimalista para grupos de amigas. Un botón. Una notificación. Nadie sabe quién fue.

---

## 🔥 VER LA APP (compartir con amigas)

### Paso 1 — Activar Pages (solo una vez, 1 minuto)

👉 **[CLIC ACÁ: Settings → Pages](https://github.com/josedaminato/carenapp/settings/pages)**

- **Source:** `GitHub Actions`  
  **— o —**  
- **Source:** `Deploy from branch` → rama **`gh-pages`** → carpeta **`/ (root)`**

Guardá y esperá 2 minutos.

### Paso 2 — Abrir este link

**https://josedaminato.github.io/carenapp/**

### Si sigue 404 — link alternativo (celular)

Abrilo en **Chrome o Safari** (no desde WhatsApp):

https://htmlpreview.github.io/?https://github.com/josedaminato/carenapp/blob/gh-pages/index.html

Instrucciones detalladas: [ACTIVAR-PAGES.md](./ACTIVAR-PAGES.md)

---

**Repositorio:** [github.com/josedaminato/carenapp](https://github.com/josedaminato/carenapp)

## Qué hace

1. Las amigas se registran y forman un grupo (código de invitación).
2. Entran al grupo y ven el botón **🔥 ENCENDER FUEGO**.
3. Al apretarlo: vibra el celular y el resto recibe *"🔥 Alguien encendió el fuego."*
4. Nadie sabe quién fue.

## Inicio rápido (app real)

```bash
docker compose up -d postgres
cd backend && npm install && npx prisma db push && npm run dev
cd mobile && npm install && npx expo start
```
