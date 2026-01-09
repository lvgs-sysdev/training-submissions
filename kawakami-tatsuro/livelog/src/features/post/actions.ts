'use server'
import pool from "@/lib/db"
import { ArtistDB, Post, TrackDB } from "./types"
import { ResultSetHeader } from "mysql2";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { searchArtists, searchTracks } from "@/lib/spotify";
import { ApiResponse, SpotifyArtist, SpotifyTrack } from "../../../types";
import { getVerifiedUser } from "@/lib/auth";
import { fetchPosts, fetchPostsByArtistName, fetchPostsByUserId } from "./service";

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
    const [rows] = await pool.query<ArtistDB[]>(`
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
    const [rows] = await pool.query<TrackDB[]>(`
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

export const createPost = async (formData: FormData): Promise<ApiResponse<null>> => {
  const user = await getVerifiedUser()
  if (!user) return { success: false, status: 401, message: 'The session timed out.', code: 'UNAUTHORIZED' }

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
        (:userId, :content, :trackId, :showDate)
      `,
      { 
        userId: user.id,
        content: content,
        trackId: trackId,
        showDate: showDate
      })

      if (result.affectedRows !== 1) throw new Error('failed to create a new post')
    } catch (error) {
      console.log(error);
      return { success: false, status: 500, message: 'Internal error', code: 'INTERNAL_ERROR' }
    }
    revalidatePath('/')
    redirect('/')
}

export const updatePost = async (postId: number, formData: FormData): Promise<ApiResponse<null>> => {
  const user = await getVerifiedUser()
  if (!user) return { success: false, status: 401, message: 'The session timed out.', code: 'UNAUTHORIZED' }

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
        id = :postId AND user_id = :userId
      `,
      { 
        content: content,
        trackId: trackId,
        showDate: showDate,
        postId: postId,
        userId: user.id
      }
    )
    if(result.affectedRows !== 1) {
      return { success: false, status: 404, message: 'The post is not found.', code: 'NOT_FOUND' }
    }
  } catch (error) {
    console.log(error)
    return { success: false, status: 500, message: 'Internal error', code: 'INTERNAL_ERROR' }
  }
  revalidatePath('/')
  redirect('/')
}

export const deletePost = async (postId: number): Promise<ApiResponse<null>> => {
  const user = await getVerifiedUser()
  if (!user) return { success: false, status: 401, message: 'The session timed out.', code: 'UNAUTHORIZED' }

  try {
    const [result] = await pool.query<ResultSetHeader>(`
      DELETE
      FROM
        posts
      WHERE
        id = :postId AND posts.user_id = :userId
      `,
      { 
        postId: postId,
        userId: user.id
      }
    )
    if (result.affectedRows !== 1) {
      return { success: false, status: 404, message: 'This post is not found.', code: 'NOT_FOUND' }
    }
    revalidatePath('/')
    return { success: true, status: 200, data: null }
  } catch (error) {
    console.log(error)
    return { success: false, status: 500, message: 'Internal error.', code: 'INTERNAL_ERROR' }
  }
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

export const getPosts = async (currentUserId: number | undefined, cursorId: number | undefined, limit: number): Promise<Post[]> => {
  try {
    return await fetchPosts(currentUserId, cursorId, limit)
  } catch (error) {
    console.log(error)
    throw new Error('failed to get posts')
  }
}

export const getPostsByUserId = async (currentUserId: number | undefined, userId: string, cursorId: number | undefined, limit: number): Promise<Post[]> => {
  try {
    return await fetchPostsByUserId(currentUserId, userId, cursorId, limit)
  } catch (error) {
    console.log(error)
    throw new Error('failed to get posts')
  }
}

export const getPostsByArtistName = async (currentUserId: number | undefined, artistName: string, cursorId: number | undefined, limit: number): Promise<Post[]> => {
  try {
    return await fetchPostsByArtistName(currentUserId, artistName, cursorId, limit)
  } catch (error) {
    console.log(error)
    throw new Error('failed to get posts')
  }
}
