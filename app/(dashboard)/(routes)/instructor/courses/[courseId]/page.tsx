// "use client"
import { auth, clerkClient } from "@clerk/nextjs";
import { useState } from "react";
import { useRouter } from "next/router";
import { redirect } from "next/navigation";
import { LayoutDashboard, ListChecks, File } from "lucide-react";

import { db } from "@/lib/db";
import { IconBadge } from "@/components/icon-badge";

import { TitleForm } from "./_components/title-form";
import { DescriptionForm } from "./_components/description-form";
import { ImageForm } from "./_components/image-form";
import { ChaptersForm } from "./_components/chapters-form";
import { Banner } from "@/components/banner";
import { Actions } from "./_components/actions";

const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
  const { userId } = auth();
  let userNameList;

  try {
    const enrolledUsers = await db.enroll.findMany({
      where: {
        courseId: params.courseId,
      },
      select: {
        userId: true,
      },
    });

    const userId = enrolledUsers.map((enrollment) => enrollment.userId);

    userNameList = await clerkClient.users.getUserList({ userId });

    console.log({ userNameList });
  } catch {}

  if (!userId) {
    return redirect("/");
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      userId,
    },
    include: {
      chapters: {
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!course) {
    return redirect("/");
  }

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.chapters.some((chapter) => chapter.isPublished),
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!course.isPublished && (
        <Banner label="This course is unpublished. It will not be visible to the students." />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Course setup</h1>
            <span className="text-sm text-slate-700">
              Complete all fields {completionText}
            </span>
          </div>
          <Actions
            disabled={!isComplete}
            courseId={params.courseId}
            isPublished={course.isPublished}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Customize your course</h2>
            </div>
            <TitleForm initialData={course} courseId={course.id} />
            <DescriptionForm initialData={course} courseId={course.id} />
            <ImageForm initialData={course} courseId={course.id} />
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">Course modules</h2>
              </div>
              <ChaptersForm initialData={course} courseId={course.id} />
              <div></div>
              <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
                <div className="font-medium">
                  <h2 className="font-meidum p-2">Enrolled Students</h2>
                  <table className="w-full table-auto border-collapse">
                    <thead>
                      <tr>
                        <th className="p-2 px-4  bg-gray-200 text-gray-900 font-medium">
                          First Name
                        </th>
                        <th className="p-2 px-4 bg-gray-200 text-gray-900 font-medium">
                          Last Name
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {userNameList!.map((user) => (
                        <tr key={user.id} className="border-b border-gray-200">
                          <td className="p-2 px-4 text-center text-sm">
                            {user.firstName}
                          </td>
                          <td className="p-2 px-4 text-center text-sm">
                            {user.lastName}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div></div>
          </div>
          <div></div>
        </div>
      </div>
    </>
  );
};

export default CourseIdPage;
