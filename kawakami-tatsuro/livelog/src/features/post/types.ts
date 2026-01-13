import { RowDataPacket } from "mysql2";

export interface Post {
  id: number;
  user_id: number;
  user_name: string;
  pic_path: string;
  show_date: string;
  artist_id: string;
  artist_name: string;
  track_id: string;
  track_title: string;
  content: string;
  created_at: Date;
  like_count: number;
  is_liked_by_me: boolean;
}

export type PostDB = Omit<Post, 'is_liked_by_me'> & {
  is_liked_by_me: number;
} & RowDataPacket

export interface Artist {
  id: number;
  spotify_id: string;
  artist_name: string;
  created_at: Date;
}

export interface ArtistDB extends Artist, RowDataPacket {}

export interface TrackDB extends RowDataPacket {
  id: number;
  spotify_id: string;
  artist_id: number;
  title: string;
  created_at: Date;
}

export interface SelectedArtist {
  id: string;
  name: string;
}

export interface SelectedTrack {
  id: string;
  name: string;
}

export interface DisplayPost {
  id: number;
  user_id: number;
  user_name: string;
  pic_path: string;
  show_date: string;
  content: string;
  artist_name: string;
  track_id: number;
  track_title: string;
  created_at: string;
} 
