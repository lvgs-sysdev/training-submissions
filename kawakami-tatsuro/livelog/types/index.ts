export type { SpotifyAuthResponse, ArtistsResponse, TracksResponse, SpotifyArtist, SpotifyTrack, SeveralArtistsResponse } from "./spotify.type";

export interface PageParams<T> {
  params: Promise<T>;
}

export interface SuccessResponse<T> {
  success: true;
  status: number;
  data: T;
  code?: string;
}

export interface ErrorResponse {
  success: false;
  status: number;
  message: string;
  code?: string;
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse

export interface MySqlError extends Error {
  code?: string;
}
