export interface Breed {
  id: number;
  name: string;
}

export interface Post {
  id: number;
  content: string;
  user_name: string;
  breed_name: string;
  created_at: string;
  image_urls: string[];
  like_count: number;
  is_liked: boolean;
  user_id: number;
  is_following: boolean;
  profile_image_url: string | null;
}
