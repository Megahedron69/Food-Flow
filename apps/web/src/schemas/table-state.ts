import { z } from "zod";

export const tablePaginationSchema = z.object({
  pageIndex: z.number().int().min(0),
  pageSize: z.number().int().min(1).max(100)
});

export type TablePagination = z.infer<typeof tablePaginationSchema>;
