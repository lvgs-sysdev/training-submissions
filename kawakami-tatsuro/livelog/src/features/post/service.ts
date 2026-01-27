import pool from "@/lib/db"
import { ArtistDB, Post, PostDB, TrackDB } from "./types"
import { ResultSetHeader } from "mysql2"

// DBから取得したポストのデータのis_liked_by_me(ログイン中のユーザーがいいね済みか否か)は0か1であるのでbooleanに変換するヘルパー関数
const toPost = (row: PostDB): Post => {
  return {
    ...row,
    is_liked_by_me: row.is_liked_by_me === 1
  }
}

// クライアントから受け取ったポストのIDに該当するポストを1件取得する
export const fetchPostById = async (currentUserId: number | undefined, id: string): Promise<Post | undefined> => {
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
      WHERE
        posts.id = :id;
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

// cursorIdよりもIDの数字が小さいポストをlimitの件数分取得する（cursorIdがundefinedの場合は最新のポストをlimitの件数分取得する）
export const fetchPosts = async (currentUserId: number | undefined, cursorId: number | undefined, limit: number): Promise<Post[]> => {
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
      WHERE
        (:cursorId IS NULL OR posts.id < :cursorId)
      ORDER BY
        posts.id DESC
      LIMIT
        :limit;
      `,
      { 
        currentUserId: currentUserId,
        cursorId: cursorId || null,
        limit: limit
      })
      
      const posts: Post[] = rows.map(toPost)

      return posts
      
  } catch (error) {
    console.log(error)
    throw new Error('failed')
  }
}

// クライアントから受け取ったユーザーIDに該当するユーザーのポストを引数limit件で指定された件数分取得する
export const fetchPostsByUserId = async (currentUserId: number | undefined, userId: string, cursorId: number | undefined, limit: number): Promise<Post[]> => {
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
      WHERE
        posts.user_id = :userId AND (:cursorId IS NULL OR posts.id < :cursorId)
      ORDER BY
        posts.id DESC
      LIMIT
        :limit;
      `,
    {
      currentUserId: currentUserId,
      userId: userId,
      cursorId: cursorId,
      limit: limit
    })

    if (rows.length === 0) return [];

    const posts: Post[] = rows.map(toPost)

    return posts

  } catch (error) {
    console.log(error);
    throw new Error('failed')
  }
}

// クライアントから受け取ったアーティスト名と紐づいたポストを引数limitで指定された件数分取得する
export const fetchPostsByArtistName = async (currentUserId: number | undefined, artistName: string, cursorId: number | undefined, limit: number): Promise<Post[]> => {
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
      WHERE
        artists.artist_name = :artistName AND (:cursorId IS NULL OR posts.id < :cursorId)
      ORDER BY
        posts.id DESC
      LIMIT
        :limit;
      `,
      {
        currentUserId: currentUserId,
        artistName: artistName,
        cursorId: cursorId,
        limit: limit
      })

      if (rows.length === 0) return []

      const posts: Post[] = rows.map(toPost)

      return posts
  } catch (error) {
    console.log(error)
    throw new Error('failed to search posts')
  }
}

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

export const getOrInsertArtist = async (spotifyId: string, artistName: string): Promise<number> => {
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

export const getOrInsertTrack = async (trackSpotifyId: string, artistId: number, trackTitle: string): Promise<number> => {
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
