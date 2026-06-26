import Sidebar from "@/components/shared/Sidebar/Sidebar";
import Wrapper from "@/components/shared/ui/Wrapper";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 pt-4">
      <Wrapper>
        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6 py-6">
          <aside className="hidden md:block">
            <Sidebar />
          </aside>
          <main>{children}</main>
        </div>
      </Wrapper>
    </div>
  );
}
