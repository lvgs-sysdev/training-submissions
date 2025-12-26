import pool from "@/lib/db"
import { Artist, ArtistDB } from "../types"

export const searchArtistsOfPosts = async (input: string): Promise<Artist[]> => {
  const searchPattern = `%${input}%` // 部分一致で検索
  try {
    const [rows] = await pool.query<ArtistDB[]>(`
      SELECT
        *
      FROM
        artists
      WHERE
        artist_name
      LIKE
        :searchPattern
      `,
      { searchPattern: searchPattern })

    return rows
  } catch (error) {
    console.log(error)
    throw new Error('failed to get artists from DB')
  }
}
