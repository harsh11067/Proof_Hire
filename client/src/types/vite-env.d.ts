/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly NEXT_PUBLIC_MOCA_PARTNER_ID: string
  readonly NEXT_PUBLIC_MOCA_API_BASE: string
  readonly NEXT_PUBLIC_AIR_VERIFY_ENDPOINT: string
  readonly NEXT_PUBLIC_AIR_VERIFY_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}