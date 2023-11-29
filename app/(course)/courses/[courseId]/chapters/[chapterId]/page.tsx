import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { File } from "lucide-react";

import { getChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/banner";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";

import { VideoPlayer } from "./_components/video-player";
import { CourseEnrollButton } from "./_components/course-enroll-button";
import { CourseProgressButton } from "./_components/course-progress-button";

const ChapterIdPage = async ({
  params
}: {
  params: { courseId: string; chapterId: string }
}) => {
  const { userId } = auth();
  
  if (!userId) {
    return redirect("/");
  } 

  const {
    chapter,
    course,
    muxData,
    assignments,
    nextChapter,
    userProgress,
    enroll,
  } = await getChapter({
    userId,
    chapterId: params.chapterId,
    courseId: params.courseId,
  });

  if (!chapter || !course) {
    return redirect("/")
  }


  const completeOnEnd = !!enroll && !userProgress?.isCompleted;

  return ( 
    <div>
      {userProgress?.isCompleted && (
        <Banner
          variant="success"
          label="You already completed this chapter."
        />
      )}
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4">
          <VideoPlayer
            chapterId={params.chapterId}
            title={chapter.title}
            courseId={params.courseId}
            nextChapterId={nextChapter?.id}
            playbackId={muxData?.playbackId!}
            // playbackId="I01xjZKlSR7IU1vgpE5FKkQ9bbq7eDi48zg6UTz5Xe54"
            completeOnEnd={completeOnEnd}
          />
        </div>
        <div>
          <div className="p-4 flex flex-col md:flex-row items-center justify-between">
            <h2 className="text-2xl font-semibold mb-2">
              {chapter.title}
            </h2>
            {/* {enroll ? ( */}
              <CourseProgressButton
                chapterId={params.chapterId}
                courseId={params.courseId}
                nextChapterId={nextChapter?.id}
                isCompleted={!!userProgress?.isCompleted}
              />
          </div>
          <Separator />
          <div>
            <Preview value={chapter.description!} />
          </div>
          {!!assignments.length && (
            <>
              <Separator />
              <div className="p-4">
                {assignments.map((assignment) => (
                  <a 
                    href={assignment.url}
                    target="_blank"
                    key={assignment.id}
                    className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                  >
                    <File />
                    <p className="line-clamp-1">
                      {assignment.name}
                    </p>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
   );
}
 
export default ChapterIdPage;




// import { auth } from "@clerk/nextjs";
// import { redirect } from "next/navigation";
// import { File } from "lucide-react";

// import { getChapter } from "@/actions/get-chapter";
// import { Banner } from "@/components/banner";
// import { Separator } from "@/components/ui/separator";
// import { Preview } from "@/components/preview";

// import { VideoPlayer } from "./_components/video-player";
// import { CourseEnrollButton } from "./_components/course-enroll-button";

// const ChapterIdPage = async ({
//   params
// }: {
//   params: { courseId: string; chapterId: string }
// }) => {
//   const { userId } = auth();
  
//   if (!userId) {
//     return redirect("/");
//   } 

//   const {
//     chapter,
//     course,
//     muxData,
//     assignments,
//     nextChapter,
//     userProgress,
//   } = await getChapter({
//     userId,
//     chapterId: params.chapterId,
//     courseId: params.courseId,
//   });

//   if (!chapter || !course) {
//     return redirect("/")
//   }


//   const completeOnEnd =  !userProgress?.isCompleted;

//   return ( 
//     <div>
//       {userProgress?.isCompleted && (
//         <Banner
//           variant="success"
//           label="You already completed this chapter."
//         />
//       )}
//       {/* <div className="flex flex-col max-w-4xl mx-auto pb-20"> */}
//         {/* <div className="p-4"> */}
//           <VideoPlayer
//             chapterId={params.chapterId}
//             title={chapter.title}
//             courseId={params.courseId}
//             nextChapterId={nextChapter?.id}
//             playbackId="I01xjZKlSR7IU1vgpE5FKkQ9bbq7eDi48zg6UTz5Xe54"
//             completeOnEnd={completeOnEnd}
//           />
//         {/* </div> */}
        
//       {/* </div> */}
//     </div>
//    );
// }
 
// export default ChapterIdPage;