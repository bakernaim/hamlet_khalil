import { requireSession } from "@/lib/session";
import AccountManager from "@/components/admin/AccountManager";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await requireSession();
  return (
    <AccountManager username={session.username} name={session.name} role={session.role} />
  );
}
