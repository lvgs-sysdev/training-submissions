export type { SpotifyAuthResponse, ArtistsResponse, TracksResponse, SpotifyArtist, SpotifyTrack } from "./spotify.type";

export interface PageParams<T> {
  params: Promise<T>;
}

export interface SuccessResponse<T> {
  success: true;
  status: number;
  data: T;
}

export interface ErrorResponse {
  success: false;
  status: number;
  message: string;
  code?: string;
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse
