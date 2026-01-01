import { DashboardCourseDetail } from "./DashboardCourseDetail";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="p-6">
      <DashboardCourseDetail courseId={Number(id)} />
    </div>
  );
}
