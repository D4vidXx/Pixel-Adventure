/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MULTIPLAYER_HOST?: string;
  readonly BASE_URL: string;
  readonly MODE: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.png' {
  const src: string;
  export default src;
}
