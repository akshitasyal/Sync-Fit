import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Auth Guard: Redirect unauthenticated users back to login
  if (!session || !session.user) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8f7f5]">
      <Sidebar />
      <div className="flex-1 overflow-y-auto w-full md:pl-64">
        <main className="min-h-full flex flex-col">{children}</main>
      </div>
    </div>
  );
}
