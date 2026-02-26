type FlushFn = () => void;

const pendingFlushes = new Map<string, FlushFn>();

export function registerPendingFlush(key: string, flush: FlushFn) {
  pendingFlushes.set(key, flush);
}

export function unregisterPendingFlush(key: string) {
  pendingFlushes.delete(key);
}

export function flushAllPendingSaves() {
  pendingFlushes.forEach((flush) => {
    try { flush(); } catch {}
  });
  pendingFlushes.clear();
}
