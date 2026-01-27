import { useState } from 'react'
import { SpotifyArtist } from '../../../types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { searchArtistsFromInput } from '@/features/post/actions'


interface Props {
  initialData?: string;
  onArtistSelect: (artist: SpotifyArtist) => void;
  onArtistInputChange: () => void;
}

export const ArtistSearchField = ({ initialData, onArtistSelect, onArtistInputChange }: Props) => {
  const [artistNameInput, setArtistNameInput] = useState<string>(initialData || '')
  const [artistsResult, setArtistsResult] = useState<SpotifyArtist[]>()

  const handleInputArtistName = async (input: string) => {
    setArtistNameInput(input || '')
    onArtistInputChange()
  }

  const handleArtistSearchButton = async (input: string) => {
    if (!input) return
    const artists = await searchArtistsFromInput(input)
    setArtistsResult(artists)
  }

  const handleSelectArtist = (artist: SpotifyArtist) => {
    onArtistSelect(artist)
    setArtistNameInput(artist.name)
    setArtistsResult(undefined)
  }

  return (
    <div className="flex flex-col gap-2 mb-6 relative">
      <Label htmlFor="artistName">Artist Name</Label>
      <div className="flex gap-4">
        <Input
          id="artistName"
          value={artistNameInput || ''}
          onChange={(event) => handleInputArtistName(event.target.value)}
          type="text"
        />
        <Button
          type="button"
          className="cursor-pointer"
          onClick={() => handleArtistSearchButton(artistNameInput)}
          disabled={artistNameInput === ''}
        >
          Search
        </Button>
      </div>
      {artistsResult && (
        <ul className="absolute top-full  bg-background z-1000 rounded-b-2xl overflow-scroll w-3xs h-52">
          {artistsResult.map((artist) => (
            <li
              className="py-2 px-4 border-b border-b-accent cursor-pointer"
              onClick={() => handleSelectArtist(artist)}
              key={artist.id}
            >
              {artist.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
