# Architecture & Development Guide

Slack Bot Web Dashboard — Next.js 14 (App Router), TypeScript, Supabase Auth, Zustand, Socket.io.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict mode) |
| Auth | Supabase (email/password) |
| State | Zustand + localStorage persist |
| HTTP | Axios (auto client/server detection) |
| Real-time | Socket.io |
| Forms | Formik + manual validation |
| Styling | SCSS Modules + CSS variables |
| Package manager | pnpm |

## Directory Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout (fonts, global styles)
│   ├── page.tsx            # Home (/)
│   ├── login/              # /login
│   ├── register/           # /register
│   ├── error.tsx           # Root error boundary
│   ├── not-found.tsx       # 404
│   └── (header)/           # Route group — pages with Header
│       ├── layout.tsx      # Wraps children with <Header />
│       ├── conversations/
│       ├── myAssistant/    # Nested layout with sub-routes
│       │   ├── tasks/
│       │   ├── alerts/
│       │   └── notes/
│       ├── images/[page]/  # Paginated route
│       ├── textToSpeech/   # Protected by middleware
│       ├── admin/users/    # Protected by middleware
│       └── globalConstants/
├── components/             # Reusable UI components
│   ├── Header/             # Server Component (reads auth from cookies)
│   ├── Buttons/            # PrimaryButton, TextButton, IconButton
│   ├── LabeledInputs/
│   ├── Dialog/
│   └── Loaders/
├── services/               # API call layer (1 file per domain)
├── store/                  # Zustand stores
├── config/                 # API URLs, service worker config
└── shared/
    ├── constants/          # Enums, validation messages, options
    ├── hooks/              # Custom hooks (each in own directory)
    ├── interfaces/         # TypeScript interfaces (I-prefixed)
    ├── styles/             # Global SCSS variables, shared styles
    └── utils/
        ├── api/            # fetch.utils, clientFetch, serverFetch, socket
        ├── formaters/
        └── localStorage/
```

## Path Aliases

Defined in `tsconfig.json`. Always use these instead of relative paths.

```typescript
import { ITask } from '@interfaces/tasks.interfaces';
import { getTasks } from '@services/tasks/tasks.service';
import { useToggle } from '@hooks/useToggle/useToggle';
import PrimaryButton from '@components/Buttons/PrimaryButton/PrimaryButton';
import { validationMessages } from '@constants/form.constants';
import apiConfig from '@config/apiConfig';
import { useAuthStore } from '@store/useAuthStore';
import { getRequest } from '@utils/api/fetch.utils';
```

| Alias | Maps to |
|---|---|
| `@app/*` | `src/app/*` |
| `@config/*` | `src/config/*` |
| `@components/*` | `src/components/*` |
| `@services/*` | `src/services/*` |
| `@constants/*` | `src/shared/constants/*` |
| `@interfaces/*` | `src/shared/interfaces/*` |
| `@hooks/*` | `src/shared/hooks/*` |
| `@styles/*` | `src/shared/styles/*` |
| `@utils/*` | `src/shared/utils/*` |
| `@store/*` | `src/store/*` |

---

## Patterns & Conventions

### 1. Page Pattern: Server Component + Client Component

Pages that need server-side data fetching use a **two-file split**: a server `page.tsx` that fetches data and a `page.client.tsx` with the interactive UI.

**`page.tsx`** — Server Component (fetches data):
```typescript
import { getTasks } from '@services/tasks/tasks.service';
import Tasks from './page.client';

const fetchData = async () => {
  const data = await getTasks();
  return data ?? [];
};

const TasksContainer = async () => {
  const initialData = await fetchData();
  return <Tasks initialTasks={initialData} />;
};

export default TasksContainer;
```

**`page.client.tsx`** — Client Component (handles interaction):
```typescript
'use client';
import React, { useEffect, useState } from 'react';
import { ITask } from '@interfaces/tasks.interfaces';

interface ITasksProps {
  initialTasks: ITask[];
}

const Tasks = ({ initialTasks }: ITasksProps) => {
  const [tasks, setTasks] = useState<ITask[]>(initialTasks);
  // ... interactive logic
};

export default Tasks;
```

Pages without server data are purely `'use client'` (e.g., `login/page.tsx`).

### 2. Component Structure

Each component lives in its own PascalCase directory with a matching `.tsx` and `.module.scss`.

```
components/
  Buttons/
    PrimaryButton/
      PrimaryButton.tsx
      primaryButton.module.scss
```

- Props are defined as inline interfaces (prefixed with `I`).
- Default exports.
- Styles imported as `styles` from the co-located SCSS module.

```typescript
import styles from './primaryButton.module.scss';

interface IPrimaryButton {
  label: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const PrimaryButton = (props: IPrimaryButton) => {
  const { label, onClick, type, disabled, loading } = props;
  return (
    <button
      type={type ?? 'button'}
      className={styles.primaryButton}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? <CgSpinnerAlt className={styles.spinner} /> : label}
    </button>
  );
};

export default PrimaryButton;
```

### 3. Services

One file per domain under `src/services/<domain>/<domain>.service.ts`. Services use the centralized fetch utilities and return typed data.

```typescript
import apiConfig from '@config/apiConfig';
import { getRequest, postRequest, putRequest, deleteRequest } from '@utils/api/fetch.utils';
import { ITask, TaskFormOmitedFields } from '@interfaces/tasks.interfaces';

export const getTasks = async (): Promise<ITask[]> => {
  const res = await getRequest<ITask[]>(`${apiConfig.BASE_URL}/tasks`);
  if (res.error || !res.data) throw new Error(res.error);
  return res.data;
};

export const createTask = async (
  task: Omit<ITask, TaskFormOmitedFields>
): Promise<ITask | null> => {
  const res = await postRequest<ITask>(`${apiConfig.BASE_URL}/tasks`, task);
  if (res.error || !res.data) throw new Error(res.error);
  return res.data;
};
```

**All fetch methods return `IApiResponse<T>` with `{ data?, error? }`**. The central `fetchData()` in `fetch.utils.ts` auto-detects `typeof window` to delegate to `clientFetch.utils.ts` (Axios + Bearer token from localStorage) or `serverFetch.utils.ts` (Axios + Supabase session from cookies).

### 4. Interfaces

Located in `src/shared/interfaces/`. Prefixed with `I`. Each domain has its own file.

```typescript
// tasks.interfaces.ts
export interface ITask {
  id?: number;
  title: string;
  description: string;
  status: TaskStatus;
  alertDate?: Date | null;
  user: IUsers;
  createdAt: Date;
  deletedAt: Date;
}

export type TaskFormOmitedFields = 'id' | 'createdAt' | 'deletedAt' | 'user';
```

Common pattern: define a `FormOmitedFields` type to strip server-managed fields when creating/updating.

### 5. Zustand Stores

Stores in `src/store/`. The auth store uses `persist` middleware with localStorage.

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAuthStore = create<IUserStoreHook>()(
  persist(
    (set, get) => ({
      username: null,
      email: null,
      // actions...
      loginSupabase: async (data) => { /* ... */ },
      logoutSupabase: async () => { /* ... */ },
    }),
    {
      name: 'user-session',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
```

**Hydration**: persisted stores cause SSR mismatches. Use the `useStoreHydration` hook to safely read store data on the client:

```typescript
import useStoreHydration from '@hooks/useStoreHydration/useStoreHydration';
import { useAuthStore } from '@store/useAuthStore';

const username = useStoreHydration(useAuthStore, (state) => state.username);
```

### 6. Custom Hooks

Each hook in its own directory under `src/shared/hooks/`.

```
hooks/
  useToggle/useToggle.ts          # Boolean toggle (open/close dialogs, loading)
  useStoreHydration/              # Fix Zustand SSR hydration
  useNotificationsAlerts/         # BroadcastChannel push notifications
  useInView/                      # Intersection Observer
  useScrollChat/                  # Chat scroll management
```

`useToggle` is the most used — it returns `[value, toggle, setOpen, setClose]`:

```typescript
const [isOpen, , openDialog, closeDialog] = useToggle();
const [isLoading, , startLoading, stopLoading] = useToggle(false);
```

### 7. Forms (Formik + Manual Validation)

Forms use **Formik** for state management with manual `validate` functions. Validation messages are in Spanish from `@constants/form.constants`.

```typescript
import { useFormik, FormikErrors } from 'formik';
import { validationMessages, ActionTypes, buttonActionLabel } from '@constants/form.constants';

const handleValidate = (values: FormValues) => {
  const errors: FormikErrors<FormValues> = {};
  if (!values.title) errors.title = validationMessages.required;
  return errors;
};

const formik = useFormik({
  initialValues: { title: '', description: '' },
  validate: handleValidate,
  onSubmit: handleSubmit,
});
```

The `ActionTypes` enum (`CREATE`, `UPDATE`, `DELETE`, `DETAIL`) drives form behavior — a single form component handles all CRUD actions, disabling inputs for detail/delete views.

### 8. Styling

**SCSS Modules** (`.module.scss`) for component-scoped styles. Global CSS variables defined in `src/styles/variables.scss`.

```scss
// Use CSS variables (defined in variables.scss :root)
.primaryButton {
  background-color: var(--btn-primary);
  color: var(--blue-bayoux-950);

  &:hover {
    background-color: var(--blue-bayoux-300);
  }

  &:disabled {
    background-color: var(--blue-bayoux-800);
  }
}
```

Key color palettes: `--blue-bayoux-*` (50–950) and `--mulled-wine-*` (50–950). Semantic vars: `--background-color`, `--primary-color`, `--btn-primary`, `--text-primary-color`, `--success-color`, `--error-color`.

### 9. Error Boundaries

`error.tsx` files at route segments catch rendering errors. They are client components.

```typescript
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Algo salio mal</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()}>Reintentar</button>
    </div>
  );
}
```

Placed at: root (`app/error.tsx`), header group (`(header)/error.tsx`), and specific pages like `myAssistant/error.tsx`.

### 10. Constants

Enums and option arrays live in `src/shared/constants/`. Pattern: define an enum, a display text map, and an options array for selects.

```typescript
// tasks.constants.ts
export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
}

export const taskStatusText = {
  [TaskStatus.PENDING]: 'Pendiente',
  [TaskStatus.IN_PROGRESS]: 'En progreso',
  [TaskStatus.COMPLETED]: 'Completada',
  [TaskStatus.CANCELED]: 'Cancelada',
};

export const taskOptions = [
  { label: taskStatusText[TaskStatus.PENDING], value: TaskStatus.PENDING },
  // ...
];
```

---

## Authentication Flow

1. **Login**: Client calls `useAuthStore.loginSupabase()` → Supabase `signInWithPassword` → saves token to localStorage + Zustand persist → fetches user profile → calls `router.refresh()` to sync server components.

2. **Logout**: `useAuthStore.logoutSupabase()` → Supabase `signOut()` → clears localStorage + store → `router.refresh()`.

3. **Server-side**: `serverFetch.utils.ts` reads Supabase session from cookies via `createServerComponentClient`.

4. **Client-side**: `clientFetch.utils.ts` reads token from localStorage via `getAuthData()` and attaches `Authorization: Bearer <token>`.

5. **Route protection**: `middleware.ts` checks Supabase session for `/images/*`, `/textToSpeech`, `/admin/*` routes — redirects to `/login` if unauthenticated.

6. **Header auth sync**: The Header is a **Server Component** that reads auth from cookies. After login/logout, `router.refresh()` invalidates the Router Cache so the Header re-renders with the current auth state.

## Real-time (Socket.io)

Client singleton at `src/shared/utils/api/socket.ts`. Uses a rooms pattern:

- **Assistant (private)**: `join_assistant_room`, `send_assistant_message`, listen `receive_assistant_message`
- **Channels (public)**: `join_room`, `send_message`, listen `receive_message`

## Backend API

The frontend connects to a Node.js/Express backend. Services map 1:1 to backend modules: `conversations`, `alerts`, `tasks`, `notes`, `links`, `images`, `textToSpeech`, `summary`, `users`.

Base URL configured via `NEXT_PUBLIC_BASE_URL` (default `http://localhost:4000`).

---

## Checklist: Adding a New Feature

When adding a new domain (e.g., "links"):

1. **Interface** — `src/shared/interfaces/links.interfaces.ts`
   - Define `ILink` with all fields
   - Define `LinkFormOmitedFields` type

2. **Constants** (if needed) — `src/shared/constants/links.constants.ts`
   - Status enums, display text maps, select options

3. **Service** — `src/services/links/links.service.ts`
   - CRUD functions using `getRequest`, `postRequest`, `putRequest`, `deleteRequest`
   - Types return values with the domain interface

4. **Page** — `src/app/(header)/links/`
   - `page.tsx` — Server component fetching initial data
   - `page.client.tsx` — Client component with `'use client'`
   - `links.module.scss` — Page styles
   - `components/LinkForm/` — Form component with Formik

5. **Navigation** — Add to `src/components/Header/constants/navLink.constants.ts`

6. **Middleware** (if protected) — Add matcher to `src/middleware.ts`

## ESLint & TypeScript

- `react-hooks/exhaustive-deps` is intentionally disabled
- TypeScript strict mode is enabled
- React Strict Mode is disabled in `next.config.js`
- Run `pnpm run lint` to check
- Run `pnpm run build` to verify TypeScript compilation
