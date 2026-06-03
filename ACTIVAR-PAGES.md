# ⚠️ ACTIVAR GITHUB PAGES (1 minuto)

El link **https://josedaminato.github.io/carenapp/** da 404 hasta que actives Pages.

## Pasos (elegí UNA opción)

### Opción A — Recomendada (GitHub Actions)

1. Abrí: https://github.com/josedaminato/carenapp/settings/pages
2. **Build and deployment → Source:** elegí **GitHub Actions**
3. Andá a **Actions** y ejecutá el workflow **"Publicar demo en GitHub Pages"** (botón Run workflow)
4. Esperá 2 minutos
5. Volvé a Settings → Pages — debe decir *"Your site is live at..."*

### Opción B — Rama gh-pages

1. Abrí: https://github.com/josedaminato/carenapp/settings/pages
2. **Source:** Deploy from a branch
3. **Branch:** `gh-pages` → **`/ (root)`**
4. Save → esperá 2 minutos

### Opción C — Carpeta docs

1. Misma pantalla Settings → Pages
2. **Source:** Deploy from a branch
3. **Branch:** `main` → **`/docs`**
4. Save → esperá 2 minutos

---

## Link para compartir (después de activar)

**https://josedaminato.github.io/carenapp/**

## Link alternativo (sin activar Pages)

Abrí en Chrome/Safari del celular (no WhatsApp):

**https://htmlpreview.github.io/?https://github.com/josedaminato/carenapp/blob/gh-pages/index.html**

---

## ¿Por qué en la PC "funciona" pero el celular no?

- En Cursor se abre el archivo **local** de tu PC, no internet.
- El celular abre el **link de GitHub** que necesita Pages activado.
- WhatsApp a veces abre `github.com/...` (repo) en vez de `github.io/...` (sitio).
