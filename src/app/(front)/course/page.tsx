import FeaturesCourse from "@/components/features-course";
import { fetchCourses } from "@/lib/course-service";

// http://localhost:3000/course
export default async function CoursePage() {
  const courses = await fetchCourses();

  return (
    <main>
      {courses.length > 0 && <FeaturesCourse courses={courses} />}
    </main>
  );
}