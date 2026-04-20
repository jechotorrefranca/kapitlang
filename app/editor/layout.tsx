import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const host = headersList.get("host") || "";
  
  if (!host.startsWith("localhost") && !host.startsWith("127.0.0.1")) {
    redirect("/");
  }

  return <>{children}</>;
}
