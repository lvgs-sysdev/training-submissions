export type CourseItem = {
  id: number;
  course_name: string;
  thumbnail: Buffer | string | null;
  course_description: string;
  user_id: string;
  user_name: string;
  updated_at: string;
  published?: boolean;
  section?: string;
  isEnrollment?: boolean;
  isStar?: boolean;
};

export type CourseItems = CourseItem[];

export type CourseDetail = {
  section_id: number;
  section_name: string;
  section_number: string;
  contents: string;
};

export type CourseDetails = CourseDetail[];

export type LectureItem = {
  course_name: string;
  course_description: string;
  thumbnail: Buffer | string | null;
  course_id?: number;
  published: number;
};

export type Content = {
  content_name: string;
  body: string;
  content_id?: number;
  content_type: string;
  question_id?: number;
  choice_body?: string[];
  answer_idx?: number;
};

export type LectureDetail = {
  section_name: string;
  section_id?: number;
  contents: Content[];
};

export type LectureDetails = LectureDetail[];

export type NavItem = {
  title: string;
  href: string;
};

export type UserItem = {
  userId: string;
  userName: string;
  userIcon?: string;
};
