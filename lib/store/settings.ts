/** Store settings (GST, delivery, booking amount). Edited in /admin/settings; live after Publish. Server only. */
import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { dbInsert, dbList, dbUpdate, type Row } from "@/lib/db";
import { DEFAULT_SETTINGS, type StoreSettings } from "./pricing";
import { getSnapshot } from "./publish";

const TABLE = "store_settings";
type SettingsRow = StoreSettings & { key: string; updated_at: string };

const clean = (r: Partial<StoreSettings> | null | undefined): StoreSettings => ({ ...DEFAULT_SETTINGS, ...(r ?? {}) });

/** The admin's working copy. */
export async function getDraftSettings(): Promise<{ settings: StoreSettings; exists: boolean }> {
  const rows = await dbList<SettingsRow & Row>(TABLE, "key.asc");
  const row = rows?.find((r) => r.key === "store");
  if (!row) return { settings: DEFAULT_SETTINGS, exists: false };
  const { key: _k, updated_at: _u, ...rest } = row;
  void _k;
  void _u;
  return { settings: clean(rest as Partial<StoreSettings>), exists: true };
}

export async function saveDraftSettings(s: StoreSettings): Promise<boolean> {
  const { exists } = await getDraftSettings();
  const row = { ...s, updated_at: new Date().toISOString() };
  return exists ? dbUpdate(TABLE, "key", "store", row) : dbInsert(TABLE, { key: "store", ...row });
}

/** What the public site and checkout use: the last published settings. */
export async function getPublicSettings(): Promise<StoreSettings> {
  "use cache";
  cacheTag("store");
  cacheLife("hours");
  try {
    return clean((await getSnapshot<StoreSettings>("store"))?.data);
  } catch (e) {
    console.error(e);
    return DEFAULT_SETTINGS;
  }
}
