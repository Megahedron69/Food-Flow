import { useEffect } from "react";
import { createOutletChannel } from "@foodflow/lib";
import { supabase } from "@/lib/supabase";

export function useOutletChannel(tenantId: string | null, outletId: string | null) {
  useEffect(() => {
    if (!tenantId || !outletId) {
      return;
    }

    const channel = createOutletChannel(supabase, tenantId, outletId);
    void channel.subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [tenantId, outletId]);
}
