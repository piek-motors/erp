/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_NODE_ENV: string
  readonly VITE_API_URL?: string
  readonly VITE_RPC_URL?: string
  // add other VITE_ variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
