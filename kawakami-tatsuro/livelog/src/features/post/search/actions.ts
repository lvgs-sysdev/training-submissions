'use server'
import { ApiResponse } from "../../../../types"
import { Artist } from "../types"
import { searchArtistsOfPosts } from "./service"

// ユーザーの入力値をもとにSpotifyのアーティストを検索する
export const getArtistsFromInput = async (input: string): Promise<ApiResponse<Artist[]>> => {
  try {
    const artists = await searchArtistsOfPosts(input)
    
    return { success: true, status: 200, data: artists }
  } catch (error) {
    return { success: false, status: 500, message: 'Internal error', code: 'INTERNAL_ERROR' }
  }
}
