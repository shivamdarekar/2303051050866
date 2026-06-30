/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LOG_AUTH_TOKEN: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
