export type OfflineQueueItem<TPayload = unknown> = {
  id: string;
  kind: string;
  payload: TPayload;
  createdAt: string;
};

export interface OfflineQueueAdapter {
  enqueue: <TPayload>(item: OfflineQueueItem<TPayload>) => Promise<void>;
  list: () => Promise<OfflineQueueItem[]>;
  remove: (id: string) => Promise<void>;
}

export function createOfflineQueue(adapter: OfflineQueueAdapter) {
  return adapter;
}
