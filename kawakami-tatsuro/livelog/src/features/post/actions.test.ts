import pool from "@/lib/db"
import { FieldPacket, ResultSetHeader } from "mysql2"
import { createLike, createPost, deleteLike, deletePost, searchArtistsFromInput, searchTracksFromInput, updatePost } from './actions'
import { getVerifiedUser } from "@/lib/auth"
import { getOrInsertArtist, getOrInsertTrack } from "./service"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { searchArtists, searchTracks } from "@/lib/spotify"
import { SpotifyArtist, SpotifyTrack } from "../../types"

vi.mock('@/lib/db', () => ({
  default: {
    query: vi.fn()
  }
}))

vi.mock('@/lib/auth', () => ({
  getVerifiedUser: vi.fn()
}))

vi.mock('./service', () => ({
  getOrInsertArtist: vi.fn(),
  getOrInsertTrack: vi.fn()
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn()
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn()
}))

vi.mock('@/lib/spotify', () => ({
  searchArtists: vi.fn(),
  searchTracks: vi.fn()
}))

const createTestPostData = () => {
  const testPostData = new FormData()
  testPostData.append('content', 'test')
  testPostData.append('artistSpotifyId', 'test')
  testPostData.append('trackSpotifyId', 'test')
  testPostData.append('trackTitle', 'test')
  testPostData.append('showDate', '2026-01-01')

  return testPostData
}

const createMockSpotifyTrack = (id: string, trackName: string, artistName: string): SpotifyTrack => ({
  id: id,
  name: trackName,
  artists: [
    {
      id: `artist-${id}`,
      name: artistName,
      type: 'artist',
      uri: `spotify:artist:${id}`,
      external_urls: { spotify: `https://spotify.com/artist/${id}` },
      href: `https://api.spotify.com/v1/artists/${id}`,
    }
  ],
  album: {
    id: `album-${id}`,
    name: 'Dummy Album',
    album_type: 'album',
    total_tracks: 1,
    available_markets: ['JP'],
    external_urls: { spotify: 'https://spotify.com/artist/${id}' },
    href: `https://api.spotify.com/v1/artists/${id}`,
    images: [],
    release_date: '2024-01-01',
    release_date_precision: 'day',
    type: 'album',
    uri: `spotify:album:${id}`,
    artists: [],
  },
  available_markets: ['JP'],
  disc_number: 1,
  duration_ms: 180000,
  explicit: false,
  external_ids: {},
  external_urls: { spotify: 'https://spotify.com/artist/${id}' },
  href: `https://api.spotify.com/v1/artists/${id}`,
  is_playable: true,
  popularity: 50,
  track_number: 1,
  type: 'track',
  uri: `spotify:track:${id}`,
  is_local: false,
});

describe('createPost関数のテストコード', () => {
  test('正常に投稿データの作成に成功した場合、キャッシュを更新し、トップページにリダイレクトすること', async () => {
    vi.mocked(getVerifiedUser).mockResolvedValue({
      id: 1,
      userName: 'Test'
    })
    vi.mocked(getOrInsertArtist).mockResolvedValue(1)
    vi.mocked(getOrInsertTrack).mockResolvedValue(1)
    vi.mocked(pool.query).mockResolvedValue([{
      affectedRows: 1
    } as ResultSetHeader, [] as FieldPacket[]])

    const testPostData = createTestPostData()

    await createPost(testPostData)

    expect(revalidatePath).toHaveBeenCalledWith('/')
    expect(redirect).toHaveBeenCalledWith('/')
  })

  test('未ログイン状態の場合、Status 401 (Unauthorized)を返すこと', async () => {
    vi.mocked(getVerifiedUser).mockResolvedValue(null)

    const testPostData = createTestPostData()

    const result = await createPost(testPostData)

    expect(result).toEqual(expect.objectContaining({
      success: false,
      status: 401,
      code: 'UNAUTHORIZED'
    }))
  })

  test('正常に投稿データの作成をすることができなかった場合、エラーをthrowし、Status 500 (Internal Server Error)を返すこと', async () => {
    vi.mocked(getVerifiedUser).mockResolvedValue({
      id: 1,
      userName: 'Test'
    })
    vi.mocked(getOrInsertArtist).mockResolvedValue(1)
    vi.mocked(getOrInsertTrack).mockResolvedValue(1)
    vi.mocked(pool.query).mockResolvedValue([{
      affectedRows: 0
    } as ResultSetHeader, [] as FieldPacket[]])

    const testPostData = createTestPostData()

    const result = await createPost(testPostData)

    expect(result).toEqual(expect.objectContaining({
      success: false,
      status: 500,
      code: 'INTERNAL_ERROR'
    }))
  })
})

// 以下Postに関するUpdateとDelete、Likeに関するCreateとDeleteについては正常系しか実装できていない
describe('updatePost関数のテストコード', () => {
  test('正常に投稿データの更新に成功した場合、キャッシュを更新し、トップページにリダイレクトすること', async () => {
    vi.mocked(getVerifiedUser).mockResolvedValue({
      id: 1,
      userName: 'Test'
    })
    vi.mocked(getOrInsertArtist).mockResolvedValue(1)
    vi.mocked(getOrInsertTrack).mockResolvedValue(1)
    vi.mocked(pool.query).mockResolvedValue([{
      affectedRows: 1
    } as ResultSetHeader, [] as FieldPacket[]])

    const testPostData = createTestPostData()

    await updatePost(1, testPostData)

    expect(revalidatePath).toHaveBeenCalledWith('/')
    expect(redirect).toHaveBeenCalledWith('/')
  })
})

describe('deletePost関数のテストコード', () => {
  test('正常に投稿データの更新に成功した場合、キャッシュを更新すること', async () => {
    vi.mocked(getVerifiedUser).mockResolvedValue({
      id: 1,
      userName: 'Test'
    })
    vi.mocked(pool.query).mockResolvedValue([{
      affectedRows: 1
    } as ResultSetHeader, [] as FieldPacket[]])

    await deletePost(1)

    expect(revalidatePath).toHaveBeenCalledWith('/')
  })
})

describe('createLike関数のテストコード', () => {
  test('正常にLikeデータの作成に成功した場合、キャッシュを更新すること', async () => {
    vi.mocked(pool.query).mockResolvedValue([{
      affectedRows: 1
    } as ResultSetHeader, [] as FieldPacket[]])

    await createLike(1, 1)

    expect(revalidatePath).toHaveBeenCalledWith('/')
  })
})

describe('deleteLike関数のテストコード', () => {
  test('正常にLikeデータの削除に成功した場合、キャッシュを更新すること', async () => {
    vi.mocked(pool.query).mockResolvedValue([{
      affectedRows: 1
    } as ResultSetHeader, [] as FieldPacket[]])

    await deleteLike(1, 1)

    expect(revalidatePath).toHaveBeenCalledWith('/')
  })
})

describe('searchArtistsFromInput関数のテストコード', () => {
  test('受け取った値でアーティストを検索し、アーティストの配列を返すこと', async () => {
    const mockSpotifyArtists: SpotifyArtist[] = [
      {
        id: 'spotify-artist-id-1',
        name: 'Test Artist A',
        external_urls: { spotify: 'https://spotify.com/artist/a' },
        followers: { total: 1000 },
        genres: ['pop', 'rock'],
        href: 'https://api.spotify.com/v1/artists/a',
        images: [{ url: 'https://example.com/image1.jpg', height: 640, width: 640 }],
        popularity: 70,
        type: 'artist',
        uri: 'spotify:artist:a',
      },
      {
        id: 'spotify-artist-id-2',
        name: 'Test Artist B',
        external_urls: { spotify: 'https://spotify.com/artist/b' },
        followers: { total: 500 },
        genres: ['jazz'],
        href: 'https://api.spotify.com/v1/artists/b',
        images: [],
        popularity: 50,
        type: 'artist',
        uri: 'spotify:artist:b',
      },
    ]

    vi.mocked(searchArtists).mockResolvedValue(mockSpotifyArtists)

    const result = await searchArtistsFromInput('Test Artist')

    expect(result).toEqual(mockSpotifyArtists)
  })
})

describe('searchTracksFromInput関数のテストコード', () => {
  test('受け取った楽曲タイトル、アーティスト名で楽曲を検索し、そのアーティストの該当する楽曲のデータを返すこと', async () => {
    const mockSpotifyTracks: SpotifyTrack[] = [
      createMockSpotifyTrack('1', 'Test Song 1', 'Target Artist'),
      createMockSpotifyTrack('2', 'Test Song 2', 'Other Artist'),
      createMockSpotifyTrack('3', 'Test Song 1', 'Target Artist')
    ]

    vi.mocked(searchTracks).mockResolvedValue(mockSpotifyTracks)

    const result = await searchTracksFromInput('Test Song', 'Target Artist')

    // アーティスト名でフィルタリングされていることを確認
    expect(result).toHaveLength(2)

    expect(result).toEqual([
      mockSpotifyTracks[0],
      mockSpotifyTracks[2]
    ])
  })
})
