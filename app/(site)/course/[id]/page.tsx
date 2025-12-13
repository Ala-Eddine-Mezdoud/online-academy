import { ClientCourseDetail } from "./ClientCourseDetail";

export default async function Page({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;
  return <ClientCourseDetail courseId={id} />;
}
