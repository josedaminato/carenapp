# Luz Secreta — Wireframes (texto)

## Paleta y estilo

- **Primario:** `#7C3AED` (violeta)
- **Secundario:** `#EC4899` (rosa)
- **Acento:** `#3B82F6` (azul)
- **Fondo:** `#0F0A1A` (casi negro violeta)
- **Superficie:** `#1A1228` con bordes `#2D1F45`
- **Tipografía:** títulos bold, cuerpo regular, tono casual y elegante

---

## 1. Splash / Bienvenida

```
┌─────────────────────────────┐
│                             │
│         ✨ 💡 ✨            │
│                             │
│       LUZ SECRETA           │
│   Tu círculo, tu complicidad│
│                             │
│   ┌─────────────────────┐   │
│   │   Crear cuenta      │   │
│   └─────────────────────┘   │
│   ┌─────────────────────┐   │
│   │   Iniciar sesión    │   │  (outline)
│   └─────────────────────┘   │
│                             │
└─────────────────────────────┘
```

---

## 2. Registro

```
┌─────────────────────────────┐
│  ←  Crear cuenta            │
│                             │
│  Nombre                     │
│  ┌─────────────────────┐    │
│  │ Ana                   │    │
│  └─────────────────────┘    │
│  Email                      │
│  ┌─────────────────────┐    │
│  │ ana@email.com         │    │
│  └─────────────────────┘    │
│  Contraseña                 │
│  ┌─────────────────────┐    │
│  │ ••••••••              │    │
│  └─────────────────────┘    │
│                             │
│  ┌─────────────────────┐    │
│  │   Registrarme         │    │
│  └─────────────────────┘    │
└─────────────────────────────┘
```

---

## 3. Inicio de sesión

```
┌─────────────────────────────┐
│  ←  Bienvenida de vuelta    │
│                             │
│  Email                      │
│  Contraseña                 │
│                             │
│  ¿Olvidaste tu contraseña?  │
│                             │
│  ┌─────────────────────┐    │
│  │   Entrar              │    │
│  └─────────────────────┘    │
└─────────────────────────────┘
```

---

## 4. Home — Mis grupos

```
┌─────────────────────────────┐
│  Hola, Ana ✨        [+]    │
│                             │
│  Mis grupos                 │
│  ┌─────────────────────┐    │
│  │ 💜 Las Reinas         │    │
│  │ 5 integrantes · 🔥 3  │    │  ← luces hoy
│  └─────────────────────┘    │
│  ┌─────────────────────┐    │
│  │ 🌸 Noche de chicas    │    │
│  │ 3 integrantes · ✨ 1  │    │
│  └─────────────────────┘    │
│                             │
│  ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐    │
│  │  + Crear grupo       │    │
│  └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘    │
│  ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐    │
│  │  🔗 Unirse con código│    │
│  └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘    │
└─────────────────────────────┘
```

---

## 5. Crear grupo

```
┌─────────────────────────────┐
│  ←  Nuevo grupo             │
│                             │
│  Nombre del grupo           │
│  ┌─────────────────────┐    │
│  │ Las Reinas            │    │
│  └─────────────────────┘    │
│                             │
│  ┌─────────────────────┐    │
│  │   Crear grupo         │    │
│  └─────────────────────┘    │
└─────────────────────────────┘
```

---

## 6. Unirse con código

```
┌─────────────────────────────┐
│  ←  Unirse a un grupo       │
│                             │
│  Código de invitación       │
│  ┌─────────────────────┐    │
│  │  ABC12XYZ             │    │
│  └─────────────────────┘    │
│                             │
│  ┌─────────────────────┐    │
│  │   Unirme              │    │
│  └─────────────────────┘    │
└─────────────────────────────┘
```

---

## 7. Pantalla del grupo (core)

```
┌─────────────────────────────┐
│  ←  Las Reinas      [⚙️]   │
│  5 integrantes · código:    │
│  ABC12XYZ         [Copiar]  │
│                             │
│  ┌─────────────────────┐    │
│  │                     │    │
│  │    ◉  LUZ APAGADA   │    │  ← animación glow
│  │       (o encendida)  │    │     cuando hay evento
│  │                     │    │
│  └─────────────────────┘    │
│                             │
│  ┌─────────────────────┐    │
│  │  💡 ENCENDER LUZ      │    │  ← botón grande
│  └─────────────────────┘    │
│                             │
│  ── Estadísticas ──         │
│  Hoy: 3  │ Semana: 12       │
│  Racha: 🔥 5 días           │
│                             │
│  ── Muro ──                 │
│  ┌─────────────────────┐    │
│  │ ✨ Alguien tuvo un    │    │
│  │ momento especial      │    │
│  │ hace 2 min            │    │
│  │ 😍 3  🔥 2  ✨ 1      │    │  ← reacciones
│  └─────────────────────┘    │
│  ┌─────────────────────┐    │
│  │ 🔥 La luz volvió a    │    │
│  │ encenderse · hace 1h  │    │
│  └─────────────────────┘    │
└─────────────────────────────┘
```

---

## 8. Invitar amigas (modal)

```
┌─────────────────────────────┐
│  Invita a tus amigas        │
│                             │
│  Comparte este código:      │
│                             │
│      ABC12XYZ               │
│                             │
│  [ Copiar código ]          │
│  [ Compartir enlace ]       │
│                             │
│  Máximo 20 integrantes      │
│  (5/20)                     │
└─────────────────────────────┘
```

---

## 9. Recuperar contraseña

```
┌─────────────────────────────┐
│  ←  Recuperar contraseña    │
│                             │
│  Te enviaremos un enlace    │
│  a tu email                 │
│                             │
│  Email                      │
│  ┌─────────────────────┐    │
│  │                       │    │
│  └─────────────────────┘    │
│                             │
│  ┌─────────────────────┐    │
│  │   Enviar enlace       │    │
│  └─────────────────────┘    │
└─────────────────────────────┘
```

---

## Navegación

```
Stack Auth:     Welcome → Register | Login → ForgotPassword
Stack App:      Home → CreateGroup | JoinGroup → GroupDetail
Tabs (futuro):  Home | Perfil
```
