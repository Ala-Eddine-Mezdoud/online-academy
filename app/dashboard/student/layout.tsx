import { StudentSidebar } from '@/components/admin/StudentSidebar';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudentSidebar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
