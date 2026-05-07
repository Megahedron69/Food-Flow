export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type RpcResponse<TData> = {
  data: TData;
  requestId: string;
};

export type TenantScoped = {
  tenantId: string;
};

export type OutletScoped = TenantScoped & {
  outletId: string;
};
