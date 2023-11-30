import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation";

import { getDashboardCourses } from "@/actions/get-dashboard-courses";

import { DashboardCoursesList } from "@/components/dashboard-course-list";

export default async function Dashboard() {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const {
    completedCourses,
    coursesInProgress
  } = await getDashboardCourses(userId);

  return (
    <div className="p-6 space-y-4">
      <DashboardCoursesList
        items={[...coursesInProgress, ...completedCourses]}
      />
    </div>
  )
}