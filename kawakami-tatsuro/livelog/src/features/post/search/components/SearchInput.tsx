'use client'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Artist } from '../../types'
import Link from 'next/link'
import { ApiResponse } from '../../../../types'

interface Props {
  getArtistsFromInput: (input: string) => Promise<ApiResponse<Artist[]>>
  defaultValue?: string
}

export const SearchInput = ({ getArtistsFromInput, defaultValue }: Props) => {
  const [artistNameInput, setArtistNameInput] = useState<string>('')
  const [artistsResult, setArtistsResult] = useState<Artist[]>()

  const handleSearchClick = async () => {
    const response = await getArtistsFromInput(artistNameInput)
    if (response.success === true) {
      response.data.length ? setArtistsResult(response.data) : alert('No posts for this artist yet.')
    } else {
      alert('Something went wrong. Please try again later.')
    }
  }

  const handleArtistClick = (selectedArtistName: string) => {
    console.log(selectedArtistName)
    setArtistNameInput(selectedArtistName)
    setArtistsResult(undefined)
  }

  return (
    <div className="relative p-4">
      <Search className="absolute left-6.5 top-5.5 size-5.5 text-muted-foreground" />
      <div className="flex gap-2">
        <Input
          name='artistName'
          placeholder="Artist Name"
          onChange={(e) => setArtistNameInput(e.target.value)}
          value={artistNameInput}
          className="pl-10"
        />
        <Button className="cursor-pointer" onClick={handleSearchClick}>
          Search
        </Button>
      </div>
      {artistsResult && (
        <ul className="absolute  bg-background z-1000 rounded-b-2xl overflow-scroll w-[85%] max-h-52">
          {artistsResult.map((artist) => (
            <li
              className="py-2 px-4 border-b border-b-accent cursor-pointer"
              key={artist.id}
            >
              <Link
                onClick={() => handleArtistClick(artist.artist_name)}
                href={`/post/search?artist=${encodeURIComponent(artist.artist_name)}`}
                className='w-full h-full block'
              >
                {artist.artist_name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
