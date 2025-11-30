import React from "react";
import { Sidebar, type PageType } from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";

// Note: header (Navbar) and footer are provided by the root `app/layout.tsx` via
// `ConditionalLayout`. Do NOT add site-level header/footer here to avoid
// duplication; this layout should only render dashboard-specific chrome.

export const metadata = {
  title: "Admin Dashboard",
  description: "Admin area for managing teachers, students and courses",
};
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  async function handleNavigate(page: PageType) {
    "use server";
    console.log('Server action handleNavigate called for page:', page);
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="flex">
        <Sidebar onNavigate={handleNavigate} />

          <main className="flex-1 overflow-auto pt-10">
            <TopBar />
            {children}
          </main>
      </div>

      {/* Optional modal root if you prefer to portal into a specific node */}
      <div id="modal-root" />
    </div>
  );
}