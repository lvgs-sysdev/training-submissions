import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { PostDB } from "@/features/posts/types";

export async function GET () {
  try {
    const [rows] = await pool.query<PostDB[]>(`
      SELECT
        posts.id,
        posts.user_id,
        posts.content,
        posts.track_id,
        posts.show_date,
        posts.created_at,
        users.user_name,
        tracks.title AS track_title,
        artists.artist_name
      FROM
        posts
      JOIN
        users ON posts.user_id = users.id
      JOIN
        tracks ON posts.track_id = tracks.track_id
      JOIN
        artists ON tracks.artist_id = artists.artist_id
      ORDER BY
        posts.created_at DESC;
      `)

      return NextResponse.json({ success: true, data: rows }, { status: 200 } )
  } catch (error) {
    return NextResponse.json({ success: false, message: String(error) }, { status: 500 })
  }
}
