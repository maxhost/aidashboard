import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { TopBar } from "@/components/dashboard/top-bar";
import { DashboardFooter } from "@/components/dashboard/dashboard-footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <SidebarNav />
      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar />
        <main className="flex-1">{children}</main>
        <DashboardFooter />
      </div>
    </div>
  );
}
