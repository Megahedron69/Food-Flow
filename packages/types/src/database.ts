export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      outlets: {
        Row: {
          address: string | null;
          code: string;
          created_at: string;
          id: string;
          is_active: boolean;
          name: string;
          tenant_id: string;
        };
        Insert: {
          address?: string | null;
          code: string;
          created_at?: string;
          id?: string;
          is_active?: boolean;
          name: string;
          tenant_id: string;
        };
        Update: {
          address?: string | null;
          code?: string;
          created_at?: string;
          id?: string;
          is_active?: boolean;
          name?: string;
          tenant_id?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          assigned_mode: "kds" | "pos" | null;
          created_at: string;
          email: string | null;
          full_name: string;
          id: string;
          is_active: boolean;
          outlet_id: string | null;
          pin_hash: string | null;
          role: "manager" | "owner" | "platform_admin" | "staff";
          tenant_id: string | null;
        };
        Insert: {
          assigned_mode?: "kds" | "pos" | null;
          created_at?: string;
          email?: string | null;
          full_name: string;
          id: string;
          is_active?: boolean;
          outlet_id?: string | null;
          pin_hash?: string | null;
          role: "manager" | "owner" | "platform_admin" | "staff";
          tenant_id?: string | null;
        };
        Update: {
          assigned_mode?: "kds" | "pos" | null;
          created_at?: string;
          email?: string | null;
          full_name?: string;
          id?: string;
          is_active?: boolean;
          outlet_id?: string | null;
          pin_hash?: string | null;
          role?: "manager" | "owner" | "platform_admin" | "staff";
          tenant_id?: string | null;
        };
        Relationships: [];
      };
      staff_sessions: {
        Row: {
          created_at: string;
          expires_at: string;
          id: string;
          last_seen_at: string | null;
          outlet_id: string;
          profile_id: string;
          revoked_at: string | null;
          session_token_hash: string;
          tenant_id: string;
        };
        Insert: {
          created_at?: string;
          expires_at: string;
          id?: string;
          last_seen_at?: string | null;
          outlet_id: string;
          profile_id: string;
          revoked_at?: string | null;
          session_token_hash: string;
          tenant_id: string;
        };
        Update: {
          created_at?: string;
          expires_at?: string;
          id?: string;
          last_seen_at?: string | null;
          outlet_id?: string;
          profile_id?: string;
          revoked_at?: string | null;
          session_token_hash?: string;
          tenant_id?: string;
        };
        Relationships: [];
      };
      tenants: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          plan: string;
          slug: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          plan?: string;
          slug: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          plan?: string;
          slug?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      can_manage_staff: {
        Args: { target_outlet_id: string };
        Returns: boolean;
      };
      current_outlet_id: {
        Args: Record<string, never>;
        Returns: string | null;
      };
      current_role: {
        Args: Record<string, never>;
        Returns: string | null;
      };
      current_tenant_id: {
        Args: Record<string, never>;
        Returns: string | null;
      };
      is_platform_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: {
      assigned_mode: "kds" | "pos";
      user_role: "manager" | "owner" | "platform_admin" | "staff";
    };
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
