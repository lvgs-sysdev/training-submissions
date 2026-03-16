export interface ArticleData {
  user_id?: string | number;
  genre: string;
  title: string;
  imgSrc: string;
  imgAlt: string;
  date: string;
  url: string;
  body: string;
}

export interface NewArticleData {
  imgSrc: string;
  imgAlt: string;
  date: string;
  genre: string;
  body: string;
  url: string;
}

export interface Author {
  img: string;
  name: string;
}

export interface ProfileData {
  avatarUrl: string;
  name: string;
  date: string;
  sns: { platform: string; url: string }[];
}
