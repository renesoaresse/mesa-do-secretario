export function seedStorage(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function readStorage<T>(key: string) {
  const raw = localStorage.getItem(key);

  return raw ? (JSON.parse(raw) as T) : null;
}
