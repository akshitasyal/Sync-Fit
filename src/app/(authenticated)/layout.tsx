import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import Sidebar from "@/components/Sidebar";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Guard 1: Not logged in → redirect to login
  if (!session || !session.user) {
    redirect("/login");
  }

  // Read the current path to exempt /onboarding/* from the profile guard
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || headersList.get("x-invoke-path") || "";
  const isOnboarding = pathname.startsWith("/onboarding");

  if (!isOnboarding) {
    await connectToDatabase();
    const user = await User.findOne({ email: session.user.email }).lean() as any;

    // Guard 2: Profile not set up → redirect to onboarding
    if (!user?.recommendations) {
      redirect("/onboarding/setup");
    }
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
