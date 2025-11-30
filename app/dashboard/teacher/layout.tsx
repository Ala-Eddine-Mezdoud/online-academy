import React from "react";
import SidebarTeacher from "@/components/dashboard/SidebarTeacher";
import TopBar from "@/components/dashboard/TopBar";

// Note: header (Navbar) and footer are provided by the root `app/layout.tsx` via
// `ConditionalLayout`. Do NOT add site-level header/footer here to avoid
// duplication; this layout should only render dashboard-specific chrome.

export const metadata = {
  title: "Teacher Dashboard",
  description: "Teacher area for managing courses, livestreams and profile",
};

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  async function handleNavigate(page: string) {
    "use server";
    console.log('Server action handleNavigate called for teacher page:', page);
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="flex">
          <SidebarTeacher onNavigate={handleNavigate} />

          <main className="flex-1 overflow-auto pt-10">
            <TopBar />
            {children}
          </main>
        </div>

      <div id="modal-root" />
    </div>
  );
}
