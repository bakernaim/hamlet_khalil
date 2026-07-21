import SettingsManager from "@/components/admin/SettingsManager";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function Page() {
  const session = await getSession();
  return <SettingsManager isAdmin={session?.role === "admin"} />;
}
