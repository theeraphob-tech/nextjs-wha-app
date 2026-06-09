export interface Course {
  title: string;
  picture: string;
  detail: string;
  [key: string]: unknown;
}

export async function fetchCourses(): Promise<Course[]> {
  const response = await fetch('https://api.codingthailand.com/api/course', {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch courses: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  if (!data?.data || !Array.isArray(data.data)) {
    throw new Error('Invalid course response format');
  }

  return data.data as Course[];
}