'use server'
import pool from "@/lib/db"
import { Post } from "./types"
import { ResultSetHeader } from "mysql2";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { searchArtists, searchTracks } from "@/lib/spotify";
import { ApiResponse, SpotifyArtist, SpotifyTrack } from "../../types";
import { getVerifiedUser } from "@/lib/auth";
import { fetchPosts, fetchPostsByArtistName, fetchPostsByUserId, getOrInsertArtist, getOrInsertTrack } from "./service";

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
