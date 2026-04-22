import { useEffect, useState } from "react";

export type DirtyKind = "content" | "setting" | "theme";

export type DirtyEntry =
  | {
      kind: "content";
      page: string;
      section: string;
      key: string;
      value: unknown;
      original: unknown;
    }
  | {
      kind: "setting";
      key: string;
      value: unknown;
      original: unknown;
    }
  | {
      kind: "theme";
      key: string; // colors_json | fonts_json | headings_json
      value: unknown;
      original: unknown;
    };

const store = new Map<string, DirtyEntry>();
const listeners = new Set<() => void>();

const notify = () => listeners.forEach((l) => l());

function entryId(e: Pick<DirtyEntry, "kind"> & Record<string, unknown>): string {
  if (e.kind === "content") return `c:${e.page}:${e.section}:${e.key}`;
  if (e.kind === "setting") return `s:${e.key}`;
  return `t:${e.key}`;
}

export const cmsDirty = {
  set(entry: DirtyEntry) {
    const id = entryId(entry as never);
    // If reverted to original, remove from dirty.
    const same = JSON.stringify(entry.value) === JSON.stringify(entry.original);
    if (same) store.delete(id);
    else store.set(id, entry);
    notify();
  },
  get(id: string) {
    return store.get(id);
  },
  all(): DirtyEntry[] {
    return Array.from(store.values());
  },
  count(): number {
    return store.size;
  },
  clear() {
    store.clear();
    notify();
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
};

export function useDirtyCount(): number {
  const [n, setN] = useState(store.size);
  useEffect(() => cmsDirty.subscribe(() => setN(store.size)), []);
  return n;
}

export function useDirtyValue<T>(id: string, fallback: T): T {
  const [v, setV] = useState<T>((store.get(id)?.value as T) ?? fallback);
  useEffect(
    () =>
      cmsDirty.subscribe(() => {
        const cur = store.get(id);
        setV((cur?.value as T) ?? fallback);
      }),
    [id, fallback],
  );
  return v;
}

export function makeContentId(page: string, section: string, key: string) {
  return `c:${page}:${section}:${key}`;
}
export function makeSettingId(key: string) {
  return `s:${key}`;
}
export function makeThemeId(key: string) {
  return `t:${key}`;
}

/** Browser-close warning when there are unsaved changes. */
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", (e) => {
    if (store.size > 0) {
      e.preventDefault();
      e.returnValue = "";
    }
  });
}