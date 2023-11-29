import { db } from "@/lib/db";
import axios from "axios";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";



const CourseIdPage = async ({
  params
}: {
  params: { courseId: string; }
}) => {
  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        orderBy: {
          position: "asc"
        }
      }
    }
  });

  if (!course) {
    return redirect("/");
  }

  const user = await currentUser();

  if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const enroll = await db.enroll.findUnique({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId: params.courseId
      }
    }
  });

  if(!enroll){
    const enrolled = await db.enroll.create({
      data: {
          userId: user.id,
          courseId: params.courseId,
      }
    });

  }

  return redirect(`/courses/${course.id}/chapters/${course.chapters[0].id}`);
}
 
export default CourseIdPage;