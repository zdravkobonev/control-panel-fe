import { isAxiosError } from "axios";

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}
function getStringProp(
  obj: Record<string, unknown>,
  key: string
): string | undefined {
  const v = obj[key];
  return typeof v === "string" ? v : undefined;
}
function firstDetailMsg(arr: unknown[]): string | undefined {
  for (const it of arr) {
    if (typeof it === "string") return it;
    if (isRecord(it)) {
      const m = getStringProp(it, "msg") ?? getStringProp(it, "message");
      if (m) return m;
    }
  }
  return undefined;
}

export function extractErrorMessage(err: unknown): string | undefined {
  if (isAxiosError(err)) {
    const { response, message } = err;

    // Няма отговор (network/CORS timeout и пр.)
    if (!response) return message || "Network error";

    const data = response.data;

    // Текстов отговор
    if (typeof data === "string") return data;

    if (isRecord(data)) {
      // FastAPI: detail: string | [{ msg }] | { msg }
      if ("detail" in data) {
        const detail = (data as Record<string, unknown>)["detail"];

        if (typeof detail === "string") return detail;

        if (Array.isArray(detail)) {
          const m = firstDetailMsg(detail);
          if (m) return m;
        }

        if (isRecord(detail)) {
          const m =
            getStringProp(detail, "msg") ?? getStringProp(detail, "message");
          if (m) return m;
        }
      }

      // други често срещани ключове
      const top =
        getStringProp(data, "message") ??
        getStringProp(data, "error") ??
        getStringProp(data, "detail");
      if (top) return top;
    }

    // fallback
    return response.statusText || message;
  }

  // не-axios грешки с message
  if (isRecord(err)) {
    const msg = getStringProp(err, "message");
    if (msg) return msg;
  }

  return;
}
