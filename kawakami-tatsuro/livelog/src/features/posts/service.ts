'use server'

import pool from "@/lib/db"
import { Post, Artist, Track } from "./types"
import { ResultSetHeader } from "mysql2";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { searchArtists, searchTracks } from "@/lib/spotify";
import { SpotifyArtist, SpotifyTrack } from "../../../types";

export const fetchPostById = async (id: string): Promise<Post | undefined> => {
  try {
    const [rows] = await pool.query<Post[]>(`
      SELECT
        posts.id,
        posts.user_id,
        users.user_name,
        posts.show_date,
        artists.artist_id,
        artists.artist_name,
        posts.track_id,
        tracks.title AS track_title,
        posts.content,
        posts.created_at
      FROM
        posts
      JOIN
        users
      ON
        posts.user_id = users.id
      JOIN
        tracks
      ON
        posts.track_id = tracks.track_id
      JOIN
        artists
      ON
        tracks.artist_id = artists.artist_id
      WHERE
        posts.id = :id
      `,
    { id: id })

    if (rows.length === 0) return undefined;

    return rows[0];
  } catch (error) {
    console.log(error);
    throw new Error('failed')
  }
}

const insertArtist = async (artistId: string, artistName: string) => {
  try {
    const [rows] = await pool.query<Artist[]>(`
      SELECT
        *
      FROM
        artists
      WHERE
        artist_id = :artistId
      `,
    { artistId: artistId })
    
    if (rows.length !== 0) return

    const [result] = await pool.query<ResultSetHeader>(`
      INSERT INTO
        artists
        (artist_id, artist_name)
      VALUES
        (:artistId, :artistName)
      `,
    {
      artistId: artistId,
      artistName: artistName
    })
    if (result.affectedRows === 1) {
        console.log('success')
      }
    } catch (error) {
      console.log(error);
      throw new Error('failed')
    }
  }

const insertTrack = async (trackId: string, artistId: string, trackTitle: string) => {
  try {
    const [rows] = await pool.query<Track[]>(`
      SELECT
        *
      FROM
        tracks
      WHERE
        track_id = :trackId
      `,
    { trackId: trackId })

    if(rows.length !== 0) return

    const [result] = await pool.query<ResultSetHeader>(`
      INSERT INTO
        tracks
        (track_id, artist_id, title)
      VALUES
        (:trackId, :artistId, :trackTitle)
      `,
    {
      trackId: trackId,
      artistId: artistId,
      trackTitle: trackTitle
    })
    if (result.affectedRows === 1) {
        console.log('success')
      }
    } catch (error) {
      console.log(error);
      throw new Error('failed')
    }
}

export const createPost = async (formData: FormData) => {
  const { content, artistId, artistName, trackId, trackTitle, showDate } = Object.fromEntries(formData.entries()) as {
    content: string;
    artistId: string;
    artistName: string;
    trackId: string;
    trackTitle: string;
    showDate: string;
  }

  try {
    await insertArtist(artistId, artistName)
    await insertTrack(trackId, artistId, trackTitle)

    const [result] = await pool.query<ResultSetHeader>(`
      INSERT INTO
        posts
        (user_id, content, track_id, show_date)
      VALUES
        (1, :content, :trackId, :showDate)
      `,
      { 
        content: content,
        trackId: trackId,
        showDate: showDate
      })

      if (result.affectedRows === 1) {
        console.log('success')
      }
    } catch (error) {
      console.log(error);
      throw new Error('failed')
    }
    revalidatePath('/')
    redirect('/')

}

export const updatePost = async (postId: number, formData: FormData) => {
  const { content, artistId, artistName, trackId, trackTitle, showDate } = Object.fromEntries(formData.entries()) as {
    content: string;
    artistId: string;
    artistName: string;
    trackId: string;
    trackTitle: string;
    showDate: string;
  }

  try {
    await insertArtist(artistId, artistName)
    await insertTrack(trackId, artistId, trackTitle)
    
    const [result] = await pool.query<ResultSetHeader>(`
      UPDATE
        posts
      SET
        content = :content,
        track_id = :trackId,
        show_date = :showDate
      WHERE
        id = :postId
      `,
      { 
        content: content,
        trackId: trackId,
        showDate: showDate,
        postId: postId
      }
    )
    if(result.affectedRows === 1) {
      console.log('success')
    }
  } catch (error) {
    console.log(error)
    throw new Error('failed')
  }

  revalidatePath('/')
  redirect('/')
}

export const deletePost = async (postId: number) => {
  try {
    const [result] = await pool.query<ResultSetHeader>(`
      DELETE
      FROM
        posts
      WHERE
        id = :postId
      `,
      { postId: postId }
    )
    if (result.affectedRows === 1) [
      console.log('success')
    ]
  } catch (error) {
    console.log(error)
    throw new Error('failed')
  }

  revalidatePath('/')
  redirect('/')
}

export const searchArtistsFromInput = async (artistNameInput: string): Promise<SpotifyArtist[]> => {
  const artists = await searchArtists(artistNameInput)
  return artists || []
}

export const searchTracksFromInput = async (trackTitleInput: string, artistName: string): Promise<SpotifyTrack[]> => {
  const tracks = await searchTracks(trackTitleInput, artistName)
  const tracksOfSelectedArtist = tracks?.filter(track => track.artists[0].name === artistName)
  return tracksOfSelectedArtist || []
}
