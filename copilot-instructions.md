# Copilot Instructions — front-aluguel

> Arquivo de contexto para o GitHub Copilot entender os padrões deste projeto e gerar código consistente.

---

## 📌 Visão Geral do Projeto

Aplicação **Next.js 15** (App Router) para gerenciamento de aluguéis. Frontend com autenticação via **NextAuth v4**, consumo de API REST com **Axios**, estado de servidor com **TanStack Query v5**, formulários com **Formik + Yup** e UI com **Tailwind CSS v4 + shadcn/ui (Radix UI)**.

---

## 🗂️ Estrutura de Pastas

```
src/
├── .interface/        # Interfaces e types globais (prefixo I + PascalCase)
├── app/               # Next.js App Router
│   ├── (private)/     # Rotas autenticadas (layout com sidebar)
│   ├── (public)/      # Rotas públicas (login, register)
│   └── api/auth/      # API routes do NextAuth
├── components/
│   ├── Dashboard/     # Componentes específicos do dashboard
│   ├── DefaultComponents/ # Componentes reutilizáveis genéricos
│   ├── Login/Form/    # Formulários de login/registro
│   ├── Menu/          # Sidebar e temas
│   ├── ProfileComplete/
│   └── ui/            # Componentes shadcn/ui (NÃO editar manualmente)
├── hooks/             # Custom hooks organizados por domínio + operação
│   ├── auth/
│   │   ├── useGet/
│   │   └── usePost/
│   └── proprietario/
│       ├── useCreate/
│       ├── useGet/
│       └── useUpdate/
├── lib/               # Utilitários internos (cn, etc.)
├── middleware.ts       # Proteção de rotas (NextAuth JWT)
├── providers/         # Providers globais (QueryProvider, SessionProvider, Toast)
├── schema/            # Schemas Yup de validação
├── services/          # Camada de API (axios instance + endPointService)
└── utils/
    ├── defaultMessagesAxios/  # handleAxiosError, handleAxiosSuccess
    ├── mask/                  # Funções de máscara (CPF, telefone)
    └── regex/                 # Regex reutilizáveis
```

---

## 🧩 Padrões de Componentes

- Componentes são **funcionais** com **named exports** (exceto `default export` em componentes de página/layout e componentes genéricos como `ButtonDefault`)
- Nomenclatura em **PascalCase**: `FormLogin`, `CardOverall`, `InputDefault`
- Arquivos em **PascalCase**: `FormLogin.tsx`, `ButtonDefault.tsx`
- Componentes com `'use client'` apenas quando necessário (formulários, hooks de estado)
- Props via `interface` local no próprio arquivo, prefixo descritivo: `ButtonGenericProps`, `InputGenericProps`
- Extensão de tipos nativos: `interface ButtonGenericProps extends React.ButtonHTMLAttributes<HTMLButtonElement>`

**Exemplo de componente:**

```tsx
'use client'

interface MyComponentProps {
  title: string
  children: React.ReactNode
}

const MyComponent = ({ title, children }: MyComponentProps) => {
  return <div>{children}</div>
}

export { MyComponent }
```

---

## 🪝 Padrões de Hooks

- Organizados por **domínio/operação**: `hooks/{dominio}/{operacao}/use{Acao}{Dominio}.ts`
- Nomenclatura: `usePostAuth`, `useGetProprietario`, `useCreateProprietario`, `useUpdateCompleteUser`
- Hooks de **mutation** (POST/PATCH/DELETE): usam `useMutation` do TanStack Query
- Hooks de **query** (GET): usam `useQuery` ou `useSession` (para dados do usuário autenticado)
- Sempre retornam objeto nomeado: `return { createUser }`, `return { loginUser }`
- `onSuccess`: invalida queries (`queryClient.invalidateQueries`) e chama `handleAxiosSuccess`
- `onError`: sempre chama `handleAxiosError(error, 'mensagem padrão')`
- `queryKey` padrão: nome do domínio em array `['proprietario']`

**Exemplo de hook mutation:**

```ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { endPointService } from '@/services/endPointService'
import { handleAxiosError } from '@/utils/defaultMessagesAxios/handleAxiosError'
import { handleAxiosSuccess } from '@/utils/defaultMessagesAxios/handleAxiosSuccess'
import { IMinhaInterface } from '@/.interface/IMinhaInterface'

export function useCreateAlgo() {
  const queryClient = useQueryClient()

  const createAlgo = useMutation({
    mutationFn: (payload: IMinhaInterface) =>
      endPointService.create<IMinhaInterface>('/endpoint', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['algo'] })
      handleAxiosSuccess('Criado com sucesso!')
    },
    onError(error) {
      handleAxiosError(error, 'Erro ao criar.')
    },
  })

  return { createAlgo }
}
```

---

## 🌐 Serviços / API

- Instância Axios em `src/services/api.ts` — `baseURL: process.env.NEXT_PUBLIC_API_URL`
- Token JWT buscado automaticamente via interceptor em `/api/auth/token` (server-side)
- **Nunca** chamar `api` diretamente nos componentes — sempre usar `endPointService`
- `endPointService` tem métodos: `getAll`, `getById`, `create<T>`, `update<T>`, `remove`
- Método `update` usa `PATCH`, não `PUT`

```ts
// ✅ Correto
endPointService.create<IPayload>('/endpoint', payload)
endPointService.update<IPayload>('/endpoint', id, payload)

// ❌ Errado — não chamar api diretamente nos hooks/componentes
api.post('/endpoint', payload)
```

---

## 🏷️ Tipagem (TypeScript)

- Interfaces e types em `src/.interface/` — prefixo `I` + PascalCase: `IProprietario`, `IAuthResponse`
- Uso extensivo de `Pick`, `Omit`, `Partial` para derivar tipos:
  ```ts
  export type IProprietarioLogin = Pick<IProprietario, 'email' | 'password'>
  export type IProprietarioCreate = Omit<
    IProprietario,
    'id' | 'profileComplete' | 'image'
  >
  ```
- Enums com prefixo `ENUM_`: `ENUM_AUTH_ERROR`
- Interfaces de response genéricas: `IResponse<T>` com `{ data: T; message: string }`
- Props de componentes: `interface` local no arquivo, nunca `type` para props de componentes

---

## 📋 Formulários

- **Formik** para gerenciamento de formulários
- **Yup** para validação — schemas em `src/schema/` com sufixo `Schema`: `loginSchema`, `registerSchema`
- `validateOnBlur: true`, `validateOnChange: false` como padrão
- Componente `InputDefault` recebe `formik` como prop e gerencia `onChange`, `value` e erros
- Masks passadas como prop `mask` no `InputDefault`: `mask={maskCpf}`

```tsx
const formik = useFormik({
  initialValues: { campo: '' },
  onSubmit: (values) => mutation.mutate(values),
  validateOnBlur: true,
  validateOnChange: false,
  validationSchema: meuSchema,
})
```

---

## 🎨 Estilização

- **Tailwind CSS v4** — classes utilitárias
- **shadcn/ui** para componentes base (`src/components/ui/`) — não modificar esses arquivos
- Variáveis CSS customizadas: `var(--color-default-input)`
- Classes base extraídas em constantes quando reutilizadas:
  ```ts
  const baseStyle = 'block w-full pl-10 pr-3 py-3 border rounded-xl...'
  ```
- **Dark mode** suportado via `next-themes`
- **framer-motion** para animações

---

## 🔔 Feedback ao Usuário

- **react-toastify** para notificações
- Sempre usar helpers utilitários:
  - `handleAxiosSuccess('mensagem')` — toast de sucesso
  - `handleAxiosError(error, 'mensagem padrão')` — toast de erro (suporta array de mensagens do backend)
- Nunca chamar `toast.success` / `toast.error` diretamente nos hooks — usar os helpers

---

## 🔐 Autenticação

- **NextAuth v4** com estratégia `credentials` e Google OAuth
- Token JWT armazenado na session do NextAuth
- Middleware em `src/middleware.ts` protege rotas privadas:
  - Sem token → redireciona para `/login`
  - Token sem `profileComplete` → redireciona para `/complete-profile`
  - `profileComplete` + `/complete-profile` → redireciona para `/dashboard`
- Acesso ao usuário autenticado via `useSession()` ou hook `useGetProprietario`

---

## ⏱️ Gerenciamento de Sessão / Token

- `useAuthSession` — hook para verificar expiração do JWT e renovar automaticamente
- Verifica a cada **5 segundos** se o token expira em menos de 60s, chamando `update()` do NextAuth
- Se o refresh falhar (`ENUM_AUTH_ERROR.ERROR_REFRESH_TOKEN`), exibe toast e faz `signOut`
- Deve ser chamado em layouts privados para manter a sessão ativa
- Retorna `{ session, status, isAuthenticated }`

---

## 🛣️ Roteamento

- **App Router** do Next.js 15
- Route groups: `(private)` para rotas autenticadas, `(public)` para públicas
- Rotas públicas: `/`, `/login`, `/register`
- Rotas privadas: `/dashboard`, `/complete-profile`

---

## 📦 Imports

- Alias `@/` aponta para `src/`
- Alias `@/.interface/` para `src/.interface/`
- Sem barrel files (`index.ts`) — imports diretos por arquivo
- Ordem sugerida: libs externas → `@/components` → `@/hooks` → `@/services` → `@/.interface` → `@/utils`

---

## 🧰 Libs Principais

| Lib                                  | Uso                                 |
| ------------------------------------ | ----------------------------------- |
| `next` 15                            | Framework (App Router)              |
| `next-auth` v4                       | Autenticação                        |
| `@tanstack/react-query` v5           | Estado de servidor / cache          |
| `axios`                              | HTTP client                         |
| `formik`                             | Formulários                         |
| `yup`                                | Validação de schemas                |
| `react-toastify`                     | Notificações                        |
| `tailwindcss` v4                     | Estilização                         |
| `@radix-ui/*`                        | Componentes primitivos (via shadcn) |
| `lucide-react`                       | Ícones                              |
| `framer-motion`                      | Animações                           |
| `next-themes`                        | Dark/light mode                     |
| `js-cookie`                          | Cookies client-side                 |
| `@mui/material` + `@mui/x-data-grid` | Tabelas de dados                    |
