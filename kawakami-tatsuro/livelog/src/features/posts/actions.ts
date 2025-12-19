'use server'
import pool from "@/lib/db"
import { Artist, Track } from "./types"
import { ResultSetHeader } from "mysql2";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { searchArtists, searchTracks } from "@/lib/spotify";
import { SpotifyArtist, SpotifyTrack } from "../../../types";

const updateArtistName = async (artistName: string, artistId: number) => {
  try {
    const [result] = await pool.query<ResultSetHeader>(`
      UPDATE
        artists
      SET
        artist_name = :artistName
      WHERE
        id = :artistId
      `,
      { 
        artistName: artistName,
        artistId: artistId
       })
       // 更新が成功 or 変更が不要だった場合はエラーにしない
    if (result.affectedRows === 0 && result.info?.includes('Rows matched: 1')) {
      // データが同じで更新されなかった場合は何もしない（呼び出し元でチェックしているので affectedRows === 1 になるはず）
    } else if (result.affectedRows !== 1) {
      throw new Error('failed to update the artist name')
    }
  } catch (error) {
      console.log(error)
      throw new Error('failed')
    }
}

const updateTrackTitle = async (trackTitle: string, trackId: number) => {
  try {
    const [result] = await pool.query<ResultSetHeader>(`
      UPDATE
        tracks
      SET
        track_title = :trackTitle
      WHERE
        id = :trackId
      `,
      { 
        trackTitle: trackTitle,
        trackId: trackId
       })
       // 更新が成功 or 変更が不要だった場合はエラーにしない
    if (result.affectedRows === 0 && result.info?.includes('Rows matched: 1')) {
      // データが同じで更新されなかった場合は何もしない（呼び出し元でチェックしているので affectedRows === 1 になるはず）
    } else if (result.affectedRows !== 1) {
      throw new Error('failed to update the track name')
    }
  } catch (error) {
      console.log(error)
      throw new Error('failed')
    }
}


const getOrInsertArtist = async (spotifyId: string, artistName: string): Promise<number> => {
  try {
    const [rows] = await pool.query<Artist[]>(`
      SELECT
        id,
        artist_name
      FROM
        artists
      WHERE
        spotify_id = :spotifyId
      `,
    { spotifyId: spotifyId })
    
    if (rows.length !== 0 && rows[0].artist_name === artistName) return rows[0].id
    if (rows.length !== 0 && rows[0].artist_name !== artistName) {
      await updateArtistName(artistName, rows[0].id)
      return rows[0].id
    }

    const [result] = await pool.query<ResultSetHeader>(`
      INSERT INTO
        artists
        (spotify_id, artist_name)
      VALUES
      (:spotifyId, :artistName)
      `,
    {
      spotifyId: spotifyId,
      artistName: artistName
    })
    if (result.affectedRows === 1) {
        console.log('success')
        return result.insertId
      } else {
        throw new Error('failed to insert an artist')
      }
    } catch (error) {
      console.log(error);
      throw new Error('failed')
    }
  }

const getOrInsertTrack = async (trackSpotifyId: string, artistId: number, trackTitle: string): Promise<number> => {
  try {
    const [rows] = await pool.query<Track[]>(`
      SELECT
        id,
        title
      FROM
        tracks
      WHERE
        spotify_id = :trackSpotifyId
      `,
    { trackSpotifyId: trackSpotifyId })

    if (rows.length !== 0 && rows[0].title === trackTitle) return rows[0].id
    if (rows.length !== 0 && rows[0].title !== trackTitle) {
      await updateTrackTitle(trackTitle, rows[0].id)
      return rows[0].id
    }

    const [result] = await pool.query<ResultSetHeader>(`
      INSERT INTO
        tracks
        (spotify_id, artist_id, title)
      VALUES
        (:trackSpotifyId, :artistId, :trackTitle)
      `,
    {
      trackSpotifyId: trackSpotifyId,
      artistId: artistId,
      trackTitle: trackTitle
    })
    if (result.affectedRows === 1) {
        console.log('success')
        return result.insertId
      } else {
        throw new Error('failed to insert a track')
      }
    } catch (error) {
      console.log(error);
      throw new Error('failed')
    }
}

export const createPost = async (formData: FormData) => {
  const { content, artistSpotifyId, artistName, trackSpotifyId, trackTitle, showDate } = Object.fromEntries(formData.entries()) as {
    content: string;
    artistSpotifyId: string;
    artistName: string;
    trackSpotifyId: string;
    trackTitle: string;
    showDate: string;
  }

  try {
    const artistId = await getOrInsertArtist(artistSpotifyId, artistName)
    const trackId = await getOrInsertTrack(trackSpotifyId, artistId, trackTitle) 

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
      } else {
        throw new Error('failed to create a new post')
      }
    } catch (error) {
      console.log(error);
      throw new Error('failed')
    }
    revalidatePath('/')
    redirect('/')
}

export const updatePost = async (postId: number, formData: FormData) => {
  const { content, artistSpotifyId, artistName, trackSpotifyId, trackTitle, showDate } = Object.fromEntries(formData.entries()) as {
    content: string;
    artistSpotifyId: string;
    artistName: string;
    trackSpotifyId: string;
    trackTitle: string;
    showDate: string;
  }

  try {
    const artistId = await getOrInsertArtist(artistSpotifyId, artistName)
    const trackId = await getOrInsertTrack(trackSpotifyId, artistId, trackTitle)
    
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
    } else {
      throw new Error('failed to update the post')
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

export const createLike = async (userId: number, postId: number) => {
  try {
    const [result] = await pool.query<ResultSetHeader>(`
      INSERT INTO
        likes
        (user_id, post_id)
      VALUES
        (:userId, :postId)
      `,
      { 
        userId: userId,
        postId: postId
      })
    if (result.affectedRows === 1) {
      console.log('success')
    } else {
      throw new Error('failed to create like')
    }
  } catch (error) {
    console.log(error)
    throw new Error('failed')
  }

  revalidatePath('/')
}

export const deleteLike = async (userId: number, postId: number) => {
  try {
    const [result] = await pool.query<ResultSetHeader>(`
      DELETE FROM
        likes
      WHERE
        likes.user_id = :userId AND likes.post_id = :postId
      `,
      { 
        userId: userId,
        postId: postId
      })
    if (result.affectedRows === 1) {
      console.log('success')
    } else {
      throw new Error('failed to delete like')
    }
  } catch (error) {
    console.log(error)
    throw new Error('failed')
  }

  revalidatePath('/')
}
