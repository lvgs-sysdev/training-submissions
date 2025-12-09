import { RowDataPacket } from "mysql2";

export interface Post extends RowDataPacket {
  id: number;
  user_id: number;
  content: string;
  track_id: string;
  show_date: string;
  created_at: string;
  user_name: string;
  track_title: string;
  artist_name: string;
}

export interface Artist extends RowDataPacket {
  id: number;
  artist_id: string;
  artist_name: string;
  created_at: string;
}

export interface Track extends RowDataPacket {
  id: number;
  track_id: string;
  artist_id: string;
  title: string;
  created_at: string;
}

export interface SelectedArtist {
  id: string;
  name: string;
}

export interface SelectedTrack {
  id: string;
  name: string;
}

// export interface PostInput  {
//   content: string;
//   show_date: string;
// }
