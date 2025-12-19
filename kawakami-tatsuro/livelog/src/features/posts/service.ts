import pool from "@/lib/db"
import { Post, PostDB } from "./types"

const toPost = (row: PostDB): Post => {
  return {
    ...row,
    is_liked_by_me: row.is_liked_by_me === 1
  }
}

export const fetchPostById = async (currentUserId: number, id: string): Promise<Post | undefined> => {
  try {
    const [rows] = await pool.query<PostDB[]>(`
      SELECT
        posts.id,
        posts.user_id,
        users.user_name,
        users.pic_path,
        posts.show_date,
        artists.spotify_id AS artist_id,
        artists.artist_name,
        tracks.spotify_id AS track_id,
        tracks.title AS track_title,
        posts.content,
        posts.created_at,
        (SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.id) AS like_count,
        (SELECT COUNT(*) > 0 FROM likes WHERE likes.post_id = posts.id AND likes.user_id = :currentUserId) AS is_liked_by_me
      FROM
        posts
      JOIN
        users
      ON
        posts.user_id = users.id
      JOIN
        tracks
      ON
        posts.track_id = tracks.id
      JOIN
        artists
      ON
        tracks.artist_id = artists.id
      LEFT JOIN
        likes
      ON
        posts.id = likes.post_id
      WHERE
        posts.id = :id
      `,
    {
      id: id,
      currentUserId: currentUserId
    })

    if (rows.length === 0) return undefined;

    const post: Post = toPost(rows[0])

    return post

  } catch (error) {
    console.log(error);
    throw new Error('failed')
  }
}

export const fetchPosts = async (currentUserId: number): Promise<Post[]> => {
  try {
    const [rows] = await pool.query<PostDB[]>(`
      SELECT
        posts.id,
        posts.user_id,
        users.user_name,
        users.pic_path,
        posts.show_date,
        artists.spotify_id AS artist_id,
        artists.artist_name,
        tracks.spotify_id AS track_id,
        tracks.title AS track_title,
        posts.content,
        posts.created_at,
        (SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.id) AS like_count,
        (SELECT COUNT(*) > 0 FROM likes WHERE likes.post_id = posts.id AND likes.user_id = :currentUserId ) AS is_liked_by_me
      FROM
        posts
      JOIN
        users ON posts.user_id = users.id
      JOIN
        tracks ON posts.track_id = tracks.id
      JOIN
        artists ON tracks.artist_id = artists.id
      ORDER BY
        posts.created_at DESC;
      `,
      { currentUserId: currentUserId })
      console.log('success')
      
      const posts: Post[] = rows.map(toPost)

      return posts
      
  } catch (error) {
    console.log(error)
    throw new Error('failed')
  }
}

export const fetchPostsByUserId = async (currentUserId: number, userId: string): Promise<Post[]> => {
  try {
    const [rows] = await pool.query<PostDB[]>(`
      SELECT
        posts.id,
        posts.user_id,
        users.user_name,
        users.pic_path,
        posts.show_date,
        artists.spotify_id AS artist_id,
        artists.artist_name,
        tracks.spotify_id AS track_id,
        tracks.title AS track_title,
        posts.content,
        posts.created_at,
        (SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.id) AS like_count,
        (SELECT COUNT(*) > 0 FROM likes WHERE likes.post_id = posts.id AND likes.user_id = :currentUserId) AS is_liked_by_me
      FROM
        posts
      JOIN
        users
      ON
        posts.user_id = users.id
      JOIN
        tracks
      ON
        posts.track_id = tracks.id
      JOIN
        artists
      ON
        tracks.artist_id = artists.id
      LEFT JOIN
        likes
      ON
        posts.id = likes.post_id
      WHERE
        posts.user_id = :userId
      ORDER BY
        posts.created_at DESC
      `,
    {
      userId: userId,
      currentUserId: currentUserId
    })

    if (rows.length === 0) return [];

    const posts: Post[] = rows.map(toPost)

    return posts

  } catch (error) {
    console.log(error);
    throw new Error('failed')
  }
}

// export const fetchArtistId = async (spotifyId: string): Promise<number> => {
//   try {
//     const [rows] = await pool.query<Artist[]>(`
//       SELECT
//         id
//       FROM
//         artists
//       WHERE
//         spotify_id = :spotifyId
//       `,
//       { spotifyId: spotifyId })

//       console.log('success')
      
//       const artistId: number = rows[0].id
//       return artistId
//   } catch (error) {
//     console.log(error)
//     throw new Error('failed')
//   }
// }

// export const fetchTrackId = async (spotifyId: string): Promise<number> => {
//   try {
//     const [rows] = await pool.query<Artist[]>(`
//       SELECT
//         id
//       FROM
//         tracks
//       WHERE
//         spotify_id = :spotifyId
//       `,
//       { spotifyId: spotifyId })

//       console.log('success')
      
//       const trackId: number = rows[0].id
//       return trackId
//   } catch (error) {
//     console.log(error)
//     throw new Error('failed')
//   }
// }
