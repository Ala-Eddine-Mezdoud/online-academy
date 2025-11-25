import Image from "next/image";
import TeacherDetailPage from "./teacher/[id]/page";
export default function Home() {
  return (
    <div className="bg-white">
      <TeacherDetailPage></TeacherDetailPage>
    </div>
  );
}
