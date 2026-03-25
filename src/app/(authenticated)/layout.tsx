import Sidebar from "@/components/Sidebar";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      <Sidebar />
      <div className="flex-1 overflow-y-auto w-full md:pl-64">
        <main className="min-h-full flex flex-col">{children}</main>
      </div>
    </div>
  );
}
