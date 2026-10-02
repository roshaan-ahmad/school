const KEY = "savedTests";

export const readLocal  = () => { try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; } };
export const writeLocal = (t) => localStorage.setItem(KEY, JSON.stringify(t));
export const getUserEmail = () => { try { return JSON.parse(localStorage.getItem("user") || "null")?.email?.trim().toLowerCase() || ""; } catch { return ""; } };

async function api(method, body) {
  const res  = await fetch("/api/tests", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || `HTTP ${res.status}`);
  return data.tests;
}

export async function saveTest(email, test) {
  // Always save locally first
  const local = readLocal();
  const exists = local.find((t) => t.id === test.id);
  const updated = exists ? local.map((t) => t.id === test.id ? test : t) : [test, ...local];
  writeLocal(updated);

  // Then try MongoDB silently
  if (!email) return;
  try {
    const synced = await api("POST", { email, tests: updated });
    writeLocal(synced);
  } catch (e) {
    // Silent fail — local copy is already saved
    console.warn("MongoDB sync skipped:", e.message);
  }
}

export async function loadTests(email) {
  if (!email) return readLocal();
  try {
    const res = await fetch(`/api/tests?email=${encodeURIComponent(email)}`);
    const data = await res.json();
    if (data.success && Array.isArray(data.tests)) {
      writeLocal(data.tests);
      return data.tests;
    }
  } catch (e) {
    console.warn("MongoDB load failed, using local:", e.message);
  }
  return readLocal();
}

export async function deleteTest(email, id) {
  const updated = readLocal().filter((t) => t.id !== id);
  writeLocal(updated);
  if (!email) return updated;
  try {
    const synced = await api("DELETE", { email, id });
    writeLocal(synced);
    return synced;
  } catch (e) {
    console.warn("MongoDB delete failed (local deleted):", e.message);
    return updated;
  }
}
