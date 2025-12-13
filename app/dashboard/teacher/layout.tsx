import { TeacherSidebar } from '@/components/admin/TeacherSidebar';

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <TeacherSidebar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
