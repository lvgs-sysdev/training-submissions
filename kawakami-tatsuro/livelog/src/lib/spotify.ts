import { SpotifyAuthResponse, ArtistsResponse, TracksResponse, SeveralArtistsResponse, SpotifyArtist, SpotifyTrack } from "../types"

const API_BASE_URL = 'https://api.spotify.com/v1'
const SEARCH_ARTISTS_LIMIT = '10'
const SPOTIFY_MAX_IDS_PER_REQUEST = 50

let cachedToken: string | null = null
let tokenExpiration: number = 0

// キャッシュされたSpotifyのアクセストークンの有効性を確認する
const hasValidToken = (): boolean => {
  const isNotExpired = tokenExpiration > Date.now()
  if (cachedToken && isNotExpired) {
    return true
  } else {
    return false
  }
} 

// 有効なアクセストークンを持っていなければ取得する（持っていた場合はキャッシュを返却）
export const getSpotifyAccessToken = async (): Promise<string | null> => {
  if (hasValidToken()) return cachedToken
  console.log(!(process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET))
  if (!(process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET)) throw new Error('environment variables is undefined')
  
  const body = new URLSearchParams()
  body.append('grant_type', 'client_credentials')

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic '+ (Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64'))
      },
      body: body
    }
    )
    const responseData = await response.json() as SpotifyAuthResponse
    
    if(response.ok) {
      cachedToken = responseData.access_token
      tokenExpiration = Date.now() + Number(responseData.expires_in) * 1000 // アクセストークンの期限が切れる時間をミリ秒単位で計算（expires_inは通常3600が返却される）

      return cachedToken
    } else {
      const error = new Error('failed to fetch access token')
      throw error
    }
  } catch (error) {
    console.log(error)
    return null
  }
}

// クライアントから受け取った値をアーティスト名のクエリとしてSpotifyのアーティストデータを取得する
export const searchArtists = async (artistName: string) => {
  const query = new URLSearchParams()
  query.append('q', artistName)
  query.append('type', 'artist')
  query.append('limit', SEARCH_ARTISTS_LIMIT)

  try {
    const response = await fetch(API_BASE_URL + `/search?${query}`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + await getSpotifyAccessToken()
      }
    })
    const data = await response.json() as ArtistsResponse

    if (response.ok) {
      return data.artists.items
    } else {
      const error = new Error ('failed to fetch artists')
      throw error
    }
  } catch (error) {
    console.log(error)
  }
}

// クライアントから受け取った値をトラック名のクエリとしてSpotifyの楽曲データを取得する
export const searchTracks = async (trackTitleInput: string, artistName: string): Promise<SpotifyTrack[]> => {
  const query = new URLSearchParams()
  query.append('q', `${trackTitleInput} artist:${artistName}`)
  query.append('type', 'track')

  try {
    const response = await fetch(API_BASE_URL + `/search?${query}`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + await getSpotifyAccessToken()
      }
    })
    const data = await response.json() as TracksResponse

    if (response.ok) {
      return data.tracks.items
    } else {
      const error = new Error ('failed to fetch tracks')
      throw error
    }
  } catch (error) {
    console.log(error)
    throw error
  }
}

// クライアントから受け取ったアーティストのSpotify IDの配列を結合して、それらに該当するSpotifyのアーティストデータを取得する
export const fetchArtistsByIds = async (artistIds: string[]): Promise<SpotifyArtist[]> => {
  if (artistIds.length === 0) return []

  const idsString = artistIds.slice(0, SPOTIFY_MAX_IDS_PER_REQUEST).join()
  const query = new URLSearchParams()
  query.append('ids', idsString)

    try {
    const response = await fetch(API_BASE_URL + `/artists?${query}`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + await getSpotifyAccessToken()
      }
    })
    const data = await response.json() as SeveralArtistsResponse

    if (response.ok) {
      return data.artists
    } else {
      const error = new Error ('failed to fetch artists')
      throw error
    }
  } catch (error) {
    console.log(error)
    throw error
  }
}
