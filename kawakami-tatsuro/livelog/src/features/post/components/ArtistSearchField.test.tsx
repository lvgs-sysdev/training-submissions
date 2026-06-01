import { queryByRole, render, screen } from "@testing-library/react"
import { searchArtistsFromInput } from "../actions"
import { ArtistSearchField } from "./ArtistSearchField"
import userEvent from "@testing-library/user-event"
import { SpotifyArtist } from "../../../../types"

const initialDataMock = 'Test Artist'
const onArtistSelectMock = vi.fn()
const onArtistInputChangeMock = vi.fn()

vi.mock('@/features/post/actions', () => ({
  searchArtistsFromInput: vi.fn()
}))

describe('ArtistSearchFieldコンポーネントのテストコード', () => {
  describe('初期表示', () => {
    test('新規投稿の場合（propsでinitialDataが渡されなかった場合）、入力欄は空で、Searchボタンが非活性になっていること', async () => {
      const user = userEvent.setup()

      render(<ArtistSearchField
        onArtistSelect={onArtistSelectMock}
        onArtistInputChange={onArtistInputChangeMock}
        />)
      
      const artistNameInput = await screen.findByRole('textbox')
      const searchBtn = await screen.findByRole('button')

      expect(artistNameInput).toHaveValue('')
      expect(searchBtn).toBeDisabled()
    })

    test('既存投稿の編集の場合（propsでinitialDataが渡された場合）、入力欄に値が設定されており、Searchボタンが活性になっていること', async () => {
      const user = userEvent.setup()

      render(<ArtistSearchField
        initialData={initialDataMock}
        onArtistSelect={onArtistSelectMock}
        onArtistInputChange={onArtistInputChangeMock}
        />)
      
      const artistNameInput = await screen.findByRole('textbox')
      const searchBtn = await screen.findByRole('button')

      expect(artistNameInput).toHaveValue(initialDataMock)
      expect(searchBtn).toBeEnabled()
    })
  })

  describe('入力と検索', () => {
    test('入力欄に文字を入力すると、Searchボタンが活性化され、親コンポーネントに変更が通知されること', async () => {
      const user = userEvent.setup()

      render(<ArtistSearchField
        onArtistSelect={onArtistSelectMock}
        onArtistInputChange={onArtistInputChangeMock}
        />)
      
      const artistNameInput = await screen.findByRole('textbox')
      const searchBtn = await screen.findByRole('button')

      await user.type(artistNameInput, 'a')

      expect(searchBtn).toBeEnabled()
      expect(onArtistInputChangeMock).toHaveBeenCalled()
    })

    test('Searchボタンをクリックすると、アーティストを検索し、取得したアーティスト一覧が表示されること', async () => {
      const user = userEvent.setup()

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

      vi.mocked(searchArtistsFromInput).mockResolvedValue(mockSpotifyArtists)

      render(<ArtistSearchField
        onArtistSelect={onArtistSelectMock}
        onArtistInputChange={onArtistInputChangeMock}
        />)
      
      const artistNameInput = await screen.findByRole('textbox')
      const searchBtn = await screen.findByRole('button')

      await user.type(artistNameInput, 'Test Artist')
      await user.click(searchBtn)

      expect(searchArtistsFromInput).toHaveBeenCalledWith('Test Artist')
      
      const items = await screen.findAllByRole('listitem')
      
      expect(items).toHaveLength(2)
      
      expect(items[0]).toHaveTextContent(mockSpotifyArtists[0].name)
      expect(items[1]).toHaveTextContent(mockSpotifyArtists[1].name)
    })
  })

  describe('アーティストの選択', () => {
    test('リストからアーティストを選択すると、親コンポーネントに通知され、入力欄の値が選択したアーティストの名前になり、リストが閉じること', async () => {
      const user = userEvent.setup()

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

      vi.mocked(searchArtistsFromInput).mockResolvedValue(mockSpotifyArtists)

      render(<ArtistSearchField
        onArtistSelect={onArtistSelectMock}
        onArtistInputChange={onArtistInputChangeMock}
        />)
      
      const artistNameInput = await screen.findByRole('textbox')
      const searchBtn = await screen.findByRole('button')

      await user.type(artistNameInput, 'Test Artist')
      await user.click(searchBtn)

      const items = await screen.findAllByRole('listitem')

      await user.click(items[0])

      expect(artistNameInput).toHaveValue(mockSpotifyArtists[0].name)
      expect(onArtistSelectMock).toHaveBeenCalledWith(mockSpotifyArtists[0])

      expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
    })
  })
})
