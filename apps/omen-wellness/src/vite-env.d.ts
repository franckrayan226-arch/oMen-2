/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_STORE_ID_WELLNESS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
