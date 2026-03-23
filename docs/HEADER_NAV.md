# Relevamiento — Header Navigation Menu

## Índice

1. [Estructura de archivos](#1-estructura-de-archivos)
2. [Links de navegación (constantes)](#2-links-de-navegación)
3. [Header.tsx — lógica principal](#3-headertsx)
4. [AdminRoutes — rutas por rol](#4-adminroutes)
5. [HamburgerMenu — menú mobile](#5-hamburgermenu)
6. [MyProfile — perfil y logout](#6-myprofile)
7. [ValidationHeader — sincronización de auth](#7-validationheader)
8. [Auth Store (Zustand)](#8-auth-store)
9. [Roles y perfiles](#9-roles-y-perfiles)
10. [Responsive — desktop vs mobile](#10-responsive)
11. [Resumen ejecutivo](#11-resumen-ejecutivo)

---

## 1. Estructura de archivos

```
src/components/Header/
├── Header.tsx                          ← Server Component principal
├── header.module.scss                  ← Estilos (solo desktop)
├── constants/
│   └── navLink.constants.ts            ← Links públicos + admin
└── components/
    ├── AdminRoutes/
    │   └── AdminRoutes.tsx             ← Client Component, chequea rol ADMIN
    ├── HamburgerMenu/
    │   ├── HamburgerMenu.tsx           ← Client Component, menú mobile flotante
    │   └── hamburgerMenu.module.scss
    ├── MyProfile/
    │   ├── MyProfile.tsx               ← Client Component, perfil + logout
    │   └── myProfile.module.scss
    └── ValidationHeader/
        └── ValidationHeader.tsx        ← Client Component, sincroniza auth al montar
```

---

## 2. Links de navegación

**Archivo:** `src/components/Header/constants/navLink.constants.ts`

```ts
export const links = [
  { label: 'Home',           route: '/',             authenticated: false },
  { label: 'Conversaciones', route: '/conversations', authenticated: false },
  { label: 'Asistente',      route: '/myAssistant',  authenticated: true  },
];

// adminLinks no usa el flag authenticated — el acceso lo controla
// AdminRoutes chequeando data.profile === Profiles.ADMIN desde el store.
// USER_PREMIUM (Profiles = 2) está definido en el enum pero sin sección
// propia en el menú todavía.
export const adminLinks = [
  { label: 'Imagenes',      route: '/images/1'    },
  { label: 'Generar Audio', route: '/textToSpeech' },
  { label: 'Users',         route: '/admin/users'  },
];
```

| Flag `authenticated` | Comportamiento |
|---|---|
| `false` | Visible para todos (incluso no logueados) |
| `true` | Visible solo si hay `username` (sesión activa) |

El filtrado se aplica en `Header.tsx` antes de pasar los links a los componentes hijos.

---

## 3. Header.tsx

**Tipo:** Server Component async
**Archivo:** `src/components/Header/Header.tsx`

```tsx
const Header = async () => {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const userLogged = await supabase.auth.getUser();
  const username = userLogged?.data.user?.email?.split('@')[0] ?? '';

  const filteredLinks = links.filter(({ authenticated }) => !authenticated || username);

  return (
    <>
      <header className={styles.header}>
        <nav>
          <ul className={styles.navigation}>
            {filteredLinks.map(({ label, route }) => (
              <Link href={route} key={route}><li>{label}</li></Link>
            ))}
            <AdminRoutes />
            {!username && <Link href="/login"><li>Login</li></Link>}
          </ul>
          {username && <MyProfile username={username} />}
        </nav>
      </header>

      {/* Fuera del <header> — position: fixed, visible en mobile */}
      <HamburgerMenu links={filteredLinks} username={username} />
    </>
  );
};
```

**Puntos clave:**

- Retorna un Fragment `<>` con dos hijos: `<header>` (desktop) y `<HamburgerMenu>` (mobile)
- `filteredLinks` se calcula una sola vez y se pasa a ambos
- `<header>` se oculta en mobile vía CSS (`display: none`)
- `<HamburgerMenu>` es `position: fixed` en mobile, oculto en desktop

**Flujo de auth server-side:**

1. Lee cookies → crea cliente Supabase server
2. Obtiene usuario logueado
3. Extrae `username` del email (`nombre@dominio.com` → `nombre`)
4. Filtra `links[]` según flag `authenticated`
5. Renderiza `<AdminRoutes />` (chequeo de rol ocurre en client side)
6. Muestra `Login` solo si no hay sesión
7. Muestra `<MyProfile />` en desktop si hay sesión activa

---

## 4. AdminRoutes

**Tipo:** Client Component
**Archivo:** `src/components/Header/components/AdminRoutes/AdminRoutes.tsx`

```tsx
const AdminRoutes = () => {
  const data = useStoreHydration(useAuthStore, (state) => state.data);

  if (!data || data.profile !== Profiles.ADMIN) return null;

  return (
    <>
      {adminLinks.map(({ label, route }) => (
        <Link href={route} key={route}><li>{label}</li></Link>
      ))}
    </>
  );
};
```

- Usa `useStoreHydration` para evitar flash de hidratación SSR con el store persisted
- Renderiza los 3 admin links solo si `profile === Profiles.ADMIN` (valor `1`)
- Solo aparece en el nav desktop — el hamburger tiene su propio chequeo interno

---

## 5. HamburgerMenu

**Tipo:** Client Component
**Archivos:** `HamburgerMenu.tsx` + `hamburgerMenu.module.scss`

```tsx
const HamburgerMenu = ({ links, username }: IHamburgerMenu) => {
  const [isOpen, toggleMenu, , closeMenu] = useToggle();
  const userData = useStoreHydration(useAuthStore, (state) => state.data);
  const isAdmin = userData?.profile === Profiles.ADMIN;

  return (
    <div className={styles.container}>      {/* topbar fija — ocupa espacio visual, no flujo */}
      <div className={styles.topBar}>
        <div className={styles.logoSlot} />  {/* placeholder izquierdo, sin logo */}
        <button className={styles.hamburger} onClick={toggleMenu}>
          {isOpen ? '✕' : '☰'}
        </button>
      </div>

      {isOpen && (
        <ul className={styles.menu}>
          {links.map(...)}           {/* links públicos + autenticados */}
          {isAdmin && adminLinks.map(...)}  {/* links admin si corresponde */}
          {!username && <Link href="/login">...</Link>}
          {username && (
            <li className={styles.profileItem}>
              <MyProfile username={username} />  {/* perfil + logout */}
            </li>
          )}
        </ul>
      )}
    </div>
  );
};
```

**Comportamiento:**

- Recibe `links` ya filtrados por auth desde el Server Component
- Chequea admin internamente con `useStoreHydration` (mismo patrón que `AdminRoutes`)
- Incluye `<MyProfile />` al final del menú con separador — el Dialog de perfil usa `position: fixed; z-index: 1000` y escapa del `overflow: hidden` del `ul`
- Al hacer click en cualquier link llama `closeMenu()`

**Layout CSS:**

| Clase | Descripción |
|---|---|
| `.container` | `position: fixed; top: 0; left: 0; right: 0; z-index: 200` |
| `.topBar` | `height: 60px`, flex, `background: --background-color`, borde inferior |
| `.logoSlot` | `width: 44px` vacío — sin logo actualmente |
| `.hamburger` | Circular 44px, `background: --btn-primary`, sombra |
| `.menu` | `position: absolute; top: calc(100% + 8px); right: 16px`, dropdown con sombra |
| `.profileItem` | `border-top` separador, `padding: 0` (MyProfile maneja su propio padding) |

Oculto en desktop con `@media (min-width: 600px) { .container { display: none } }`.

---

## 6. MyProfile

**Tipo:** Client Component
**Archivo:** `src/components/Header/components/MyProfile/MyProfile.tsx`

```tsx
const MyProfile = ({ username }: { username: string }) => {
  const [isOpen, , showDialog, hideDialog] = useToggle();
  const { data, logoutSupabase } = useAuthStore();
  const router = useRouter();

  // Botón con username → abre Dialog modal
  // Dialog muestra IUsers (todos disabled/read-only):
  //   nombre, apellido, username, email, teléfono, perfil
  //
  // Botón "Cerrar sesión":
  //   1. logoutSupabase() — limpia Supabase + localStorage + store
  //   2. hideDialog()
  //   3. router.refresh() — invalida Router Cache → Header re-renderiza vacío
  //   4. router.push('/login')
};
```

**Aparece en dos lugares:**
- Desktop: como botón en el nav bar (dentro de `<header>`)
- Mobile: como último ítem del dropdown de `HamburgerMenu`

**Separación de responsabilidades:**
- `username` prop → viene del Server Component (leído de cookies Supabase)
- `data` (IUsers completo) → se lee de Zustand (persistido en localStorage)

**Layout del modal:** grid 2 columnas para los campos, botón logout span full width al final.

---

## 7. ValidationHeader

**Tipo:** Client Component
**Archivo:** `src/components/Header/components/ValidationHeader/ValidationHeader.tsx`

```tsx
const ValidationHeader = () => {
  const { validateSupabaseAuth } = useAuthStore();
  useNotificationsAlert();

  useEffect(() => {
    validateSupabaseAuth();
  }, []);

  return <ToastContainer position="top-center" autoClose={3000} theme="dark" />;
};
```

- Montado en el root layout (`src/app/layout.tsx`), presente en todas las páginas
- Sincroniza el token de Supabase con el store si difieren (token renovado por Supabase)
- Provee el container global de toasts
- `useNotificationsAlert()` gestiona suscripción a notificaciones push

---

## 8. Auth Store

**Archivo:** `src/store/useAuthStore.ts`
**Middleware:** `persist` (localStorage, key: `'user-session'`)

### Estado

| Campo | Tipo | Descripción |
|---|---|---|
| `username` | `string \| null` | Email sin dominio (`email.split('@')[0]`) |
| `email` | `string \| null` | Email completo |
| `auth` | `{ token, refresh_token, userId?, expires_at? }` | Tokens Supabase |
| `data` | `IUsers \| undefined` | Perfil completo (incluye `profile: Profiles`) |
| `notificationSubscription` | `PushSubscription \| undefined` | Suscripción Web Push |

### Métodos

| Método | Descripción |
|---|---|
| `loginSupabase()` | Sign in → guarda tokens → `getUserMe()` → suscribe push → actualiza store |
| `logoutSupabase()` | Sign out → borra localStorage → resetea store al `initialState` |
| `validateSupabaseAuth()` | Compara sesión Supabase con token en store, sincroniza si difieren |

### Flujo de login

```
loginSupabase()
  → supabase.signInWithPassword()
  → saveAuthData(userId, token)       ← localStorage
  → Promise.all([
      getUserMe(),                    ← GET /users/me → IUsers (incluye profile)
      serviceWorkerConfig()           ← Web Push subscription
        → subscribePushNotification()
    ])
  → set({ username, email, auth, data, notificationSubscription })
```

---

## 9. Roles y perfiles

**Archivo:** `src/shared/constants/users.constants.ts`

```ts
export enum Profiles {
  ADMIN        = 1,  // Acceso total — ve adminLinks en desktop y hamburger
  USER_PREMIUM = 2,  // Definido, sin sección propia en el menú todavía
  USER         = 3,  // Usuario base
}
```

**Flujo de chequeo de rol:**

```
Login → getUserMe() → IUsers.profile
  → persisted en Zustand store
    → AdminRoutes (desktop) y HamburgerMenu (mobile)
        leen data.profile via useStoreHydration
          → si === Profiles.ADMIN → renderiza adminLinks
          → si no → null / oculto
```

---

## 10. Responsive

**Breakpoint:** `600px`

| Viewport | Qué se muestra |
|---|---|
| Desktop ≥600px | `<header>` con nav bar completo + `MyProfile` en barra. `HamburgerMenu` oculto. |
| Mobile <600px | `<header>` oculto (`display: none`). `HamburgerMenu` visible como topbar fija (60px). |

**Mobile topbar (`HamburgerMenu`):**
- `position: fixed; top: 0; left: 0; right: 0; height: 60px`
- Fondo `--background-color` con borde inferior sutil
- Logo-slot vacío a la izquierda, botón ☰ circular a la derecha

**Espacio para el topbar:**
- `.main-container` en mobile tiene `padding-top: 76px` (60px topbar + 16px aire) definido en `globals.scss`

**Contenido del menú mobile vs desktop:**

| Elemento | Desktop | Mobile (hamburger) |
|---|---|---|
| Home | ✅ | ✅ |
| Conversaciones | ✅ | ✅ |
| Asistente | ✅ (solo auth) | ✅ (solo auth) |
| Login | ✅ (si no hay sesión) | ✅ (si no hay sesión) |
| Admin links | ✅ (si rol ADMIN) | ✅ (si rol ADMIN) |
| MyProfile | ✅ en barra | ✅ último ítem del dropdown |

---

## 11. Resumen ejecutivo

El menú tiene **3 niveles de acceso**:

| Nivel | Links | Condición |
|---|---|---|
| Público | Home, Conversaciones, Login | Siempre visibles |
| Autenticado | Asistente | `username` presente (sesión activa) |
| Admin | Imagenes, Generar Audio, Users | `data.profile === Profiles.ADMIN` |

La auth se detecta en **dos capas independientes**:

- **Server side** (`Header.tsx`): cookies de Supabase → filtra `links[]`, pasa `username` a los hijos
- **Client side** (`AdminRoutes`, `HamburgerMenu`, `MyProfile`): store Zustand persisted en localStorage

**Deuda técnica pendiente (opcionales):**
- `email.split('@')[0]` para extraer username — frágil ante OAuth
- `useEffect` de `validateSupabaseAuth` sin deps declaradas (ESLint disabled)
- `USER_PREMIUM` sin sección propia en el menú
