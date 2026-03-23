# Assistant Module Guide

`/myAssistant` — Copilot chat + personal data modules (Tasks, Notes, Alerts, Links).

---

## Structure

```
src/app/(header)/myAssistant/
├── layout.tsx            # Client layout — side nav with icon links
├── page.tsx              # /myAssistant — Copilot chat (pure client, no server fetch)
├── myAssistant.module.scss
├── tasks/
│   ├── page.tsx          # Server component — fetches initial tasks
│   ├── page.client.tsx   # Interactive list + filter chips + Dialog
│   └── components/TaskForm/TaskForm.tsx
├── notes/
│   ├── page.tsx
│   ├── page.client.tsx
│   └── components/NoteForm/NoteForm.tsx
├── alerts/
│   ├── page.tsx
│   ├── page.client.tsx
│   └── components/AlertForm/AlertForm.tsx
├── links/
│   ├── page.tsx
│   ├── page.client.tsx
│   └── components/LinkForm/LinkForm.tsx
└── error.tsx             # Error boundary for the whole section
```

The layout is a **Client Component** (uses `usePathname` for active link highlighting). It renders a vertical icon nav and a content area.

---

## 1. Copilot Chat (`/myAssistant`)

### Socket.io Flow

The chat connects to the Socket.io singleton at `@utils/api/socket`. Room = `userId` (falls back to `username`).

```
mount  →  emit  join_assistant_room  { username, channel: userId }
         listen join_assistant_response  → load history
         listen receive_assistant_progress → show typing indicator + status text
         listen receive_assistant_message → append bot message, clear indicator

unmount → emit  leave_assistant_room  { channel: userId }
          socket.off(all four events)
```

> Always clean up all listeners in the `useEffect` return. Not doing so causes duplicate messages when the component remounts (e.g., in development with Strict Mode — though Strict Mode is disabled in this project).

### Key State

| State | Type | Purpose |
|---|---|---|
| `conversation` | `IConversationMessage[]` | Full chat history (user + bot) |
| `message` | `string` | Current textarea value |
| `iaEnabled` | `boolean` | Toggles AI mode on `send_assistant_message` |
| `botStatus` | `string \| null` | Progress text shown in the typing bubble; blocks sending |
| `copiedIndex` | `number \| null` | Tracks which bubble triggered the copy feedback |

### Sending a Message

```typescript
// Guard: don't send while bot is processing
if (message.trim() !== '' && !botStatus) {
  socket.emit('send_assistant_message', {
    userId: userData?.id,
    message: message.trim(),
    iaEnabled,
  });
  // Optimistic update — append user message locally before server echoes
  setConversation((prev) => [...prev, { role: RoleTypes.user, content: message, ... }]);
  setMessage('');
}
```

- `Enter` sends (via `handleKeyDown`). `Shift+Enter` inserts a newline.
- The textarea and submit button are `disabled` while `botStatus !== null`.

### Rendering Messages

- **Bot messages** render with `<ReactMarkdown remarkPlugins={[remarkGfm]}>`. Newlines are normalized to `  \n` before rendering so markdown line breaks work correctly.
- **User messages** render as plain `<p>`.
- A copy button appears on bot messages only; it uses `navigator.clipboard.writeText`.

### Interfaces (from `conversations/components/ConversationFlow/interfaces/conversation.interfaces.ts`)

```typescript
enum RoleTypes { system = 'system', user = 'user', assistant = 'assistant' }
enum ConversationProviders { SLACK = 'slack', WEB = 'web', ASSISTANT = 'assistant' }

interface IUserConversation {
  role: RoleTypes;
  content: string;
  provider: ConversationProviders;
  userId?: number;
  userSlackId?: string;
}

// Extended locally in page.tsx
interface IConversationMessage extends IUserConversation {
  receivedAt: Date; // timestamp added client-side on receipt
}
```

### Do / Don't

| Do | Don't |
|---|---|
| Use `botStatus` to gate sends | Send while a bot response is in-flight |
| Optimistic-update the user's own message | Wait for a server echo to show the user message |
| Append `receivedAt: new Date()` when adding to state | Store timestamps from the server (they aren't sent) |
| Clean up all four socket listeners on unmount | Leave dangling `.on()` listeners |

---

## 2. Tasks (`/myAssistant/tasks`)

### Interface

```typescript
// src/shared/interfaces/tasks.interfaces.ts
interface ITask {
  id?: number;
  title: string;
  description: string;
  status: TaskStatus;
  alertDate?: Date | null;
  user: IUsers;
  createdAt: Date;
  deletedAt: Date;
  // tag?: string  ← MISSING — backend accepts it, interface does not yet include it
}
type TaskFormOmitedFields = 'id' | 'createdAt' | 'deletedAt' | 'user';
```

### Known Gap — `tag` field

The backend accepts and returns `tag` on `POST /tasks` and `PUT /tasks/:id`, but it is absent from `ITask` and `TaskForm`. Users who tag tasks via Slack cannot see or edit the tag from the web.

**To fix:**
1. Add `tag?: string` to `ITask` in `tasks.interfaces.ts`.
2. Add a `LabeledInput` for `tag` in `TaskForm.tsx`.
3. Include `tag` in `taskInitialValue`.

No service changes needed — `createTask` and `updateTask` already forward the full form values.

### Status Workflow

```
PENDING → IN_PROGRESS → COMPLETED
                       → CANCELED
```

Status changes happen via the `UPDATE` form action (full edit dialog), not inline buttons. Filter chips at the top of the list filter client-side.

### TaskForm — ActionTypes pattern

`TaskForm` is a single component that handles CREATE / UPDATE / DELETE / DETAIL actions via the `ActionTypes` enum.

- `DETAIL` / `DELETE`: inputs are disabled (`inputDisabled = true`).
- `CREATE` / `UPDATE` / `DELETE`: submit button is shown.
- On DELETE, `handleValidate` returns early (no field validation needed).

---

## 3. Notes (`/myAssistant/notes`)

### Interface

```typescript
interface INote {
  id?: number;
  title: string;
  description: string;
  tag: string;        // required — unlike tasks where tag is optional
  user: IUsers;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
type NoteFormOmitedFields = 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'user';
```

Notes include a `tag` field and an `updatedAt` timestamp (unlike Tasks). The form covers CREATE / UPDATE / DELETE / DETAIL.

---

## 4. Alerts (`/myAssistant/alerts`)

### Interface

```typescript
interface IAlert {
  id: number;
  message: string;
  date: string | null;   // ISO string or null (no-date alerts)
  sent: boolean;
  user: IUsers;
  createdAt: string;
  deletedAt: string | null;
}
type AlertFormOmitedFields = 'id' | 'createdAt' | 'deletedAt' | 'user' | 'sent';
```

- `sent` is server-managed — never send it from the form.
- `date` is optional. If provided it must be a future date (validate client-side).
- The backend has no `PUT /alerts/:id` — there is **no update action**. The form only supports CREATE and DELETE.

---

## 5. Links (`/myAssistant/links`)

### Interface

```typescript
interface ILink {
  id?: number;
  url: string;
  title?: string;
  description?: string;
  tag?: string;
  status: LinkStatus;
  user: IUsers;
  createdAt: Date;
  deletedAt: Date;
}
type LinkFormOmitedFields = 'id' | 'createdAt' | 'deletedAt' | 'user';
```

### Status Workflow

```
unread → read → archived
```

Advance is done via the quick-action button on each card (calls `updateLink` directly, without a dialog). Full edit/delete uses the dialog pattern.

Constants in `@constants/links.constants.ts` drive this:

```typescript
const nextLinkStatus: Record<LinkStatus, LinkStatus | null> = { ... };
const nextLinkStatusLabel: Record<LinkStatus, string | null> = { ... };
```

### Known Gap — Client-side filtering

`GET /links` accepts `?tag=` and `?status=` query params for server-side filtering, but the page loads all links and filters in memory via `statusFilter` state.

**Current behavior**: all links are fetched on mount; `filteredLinks` is derived client-side.

**To improve (when dataset grows):** Pass params to `getLinks()`:

```typescript
// links.service.ts
export const getLinks = async (
  filters?: { tag?: string; status?: LinkStatus }
): Promise<ILink[]> => {
  const params = new URLSearchParams();
  if (filters?.tag) params.set('tag', filters.tag);
  if (filters?.status) params.set('status', filters.status);
  const url = `${apiConfig.BASE_URL}/links${params.toString() ? `?${params}` : ''}`;
  const res = await getRequest<ILink[]>(url);
  if (res.error || !res.data) throw new Error(res.error);
  return res.data;
};
```

Then call `fetchData(statusFilter !== 'all' ? { status: statusFilter } : undefined)` and remove the client-side `filteredLinks` derivation.

---

## 6. Adding a New Sub-module to `/myAssistant`

Follow the standard feature checklist from `ARCHITECTURE.md`, then:

1. **Add a nav icon** in `myAssistant/layout.tsx` — import the icon from `react-icons/fa`, add a `<span className={styles.menuItem} data-tooltip="Label">` block with a `<Link>`.
2. **Use the server+client page split** — `page.tsx` fetches initial data via a service, `page.client.tsx` handles interaction.
3. **Reuse the Dialog + Form pattern** — one form component with `ActionTypes`, opened via `useToggle`.
4. After any mutation, call `fetchData()` (re-fetch from API) before closing the dialog, so the list is always in sync.

---

## 7. Common Patterns Across Sub-modules

### Data refresh after mutation

```typescript
// In page.client.tsx
const fetchData = async () => {
  const data = await getDomainItems();
  setItems(data ?? []);
};

// Pass as onSubmit callback to the Form
<Form
  onSubmit={() => {
    fetchData();
    closeDialog();
  }}
/>
```

### Dialog + selection state

```typescript
const [isOpen, , openDialog, closeDialog] = useToggle();
const [selectionData, setSelectionData] = useState<{
  action: ActionTypes;
  data?: IDomainItem;
}>({ action: ActionTypes.DETAIL, data: undefined });

// Open for create
openDialog();
setSelectionData({ action: ActionTypes.CREATE, data: undefined });

// Open for edit
openDialog();
setSelectionData({ action: ActionTypes.UPDATE, data: item });
```

### Form validation

- Use `handleValidate` with `FormikErrors<T>`.
- Return early on `ActionTypes.DELETE` (no field validation needed).
- Validation messages come from `@constants/form.constants` (`validationMessages.required`, `validationMessages.pattern`).
- All messages must be **in Spanish**.

### Loading state

```typescript
const [isLoading, , startLoading, stopLoading] = useToggle(false);

const handleSubmit = async (values) => {
  try {
    startLoading();
    await serviceCall(values);
    toast.success('...');
    onSubmit?.();
    formik.resetForm();
  } catch (error) {
    toast.error(error instanceof Error ? error.message : 'Ups! Algo salió mal');
  }
  stopLoading();
};
```

---

## 8. Backend API Reference (Assistant Section)

| Route | Method | Auth | Notes |
|---|---|:---:|---|
| `/tasks` | GET | USER | Returns all tasks for the authenticated user |
| `/tasks` | POST | USER | Accepts `title`, `description`, `status`, `alertDate?`, `tag?` |
| `/tasks/:id` | PUT | USER | Same fields as POST |
| `/tasks/:id` | DELETE | USER | Soft delete |
| `/notes` | GET | USER | |
| `/notes` | POST | USER | Accepts `title`, `description`, `tag` |
| `/notes/:id` | PUT | USER | |
| `/notes/:id` | DELETE | USER | |
| `/alerts` | GET | USER | |
| `/alerts` | POST | USER | Accepts `message`, `date?` |
| `/alerts/:id` | DELETE | USER | No PUT — alerts cannot be edited |
| `/links` | GET | USER | Accepts `?tag=` and `?status=` query params |
| `/links` | POST | USER | Accepts `url`, `title?`, `description?`, `tag?`, `status` |
| `/links/:id` | PUT | USER | |
| `/links/:id` | DELETE | USER | |

### Socket.io — Copilot

| Event | Direction | Payload |
|---|---|---|
| `join_assistant_room` | emit | `{ username: string, channel: userId \| username }` |
| `leave_assistant_room` | emit | `{ channel: userId \| username }` |
| `send_assistant_message` | emit | `{ userId: number, message: string, iaEnabled: boolean }` |
| `join_assistant_response` | listen | `{ conversation: IUserConversation[] }` |
| `receive_assistant_progress` | listen | `{ progress: string }` |
| `receive_assistant_message` | listen | `IUserConversation` |
