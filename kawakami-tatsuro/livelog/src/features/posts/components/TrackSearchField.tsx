import { useState } from 'react'
import { SpotifyTrack } from '../../../../types'
import { searchTracksFromInput } from '@/features/posts/actions'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

interface Props {
  initialData?: string;
  artistName?: string;
  onTrackSelect: (track: SpotifyTrack) => void;
  onTrackInputChange: () => void;
}

export const TrackSearchField = ({  initialData, artistName, onTrackSelect, onTrackInputChange }: Props) => {
  const [trackTitleInput, setTrackTitleInput] = useState<string>(initialData || '')
  const [trackResult, setTrackResult] = useState<SpotifyTrack[]>()

  const handleInputTrackTitle = async (input: string) => {
    setTrackTitleInput(input || '')
    onTrackInputChange()
  }

  const handleTrackSearchButton = async (trackTitleInput: string) => {
    if (!artistName) return
    const tracks = await searchTracksFromInput(
      trackTitleInput,
      artistName
    )
    setTrackResult(tracks)
  }

  const handleSelectTrack = (track: SpotifyTrack) => {
    onTrackSelect(track)
    setTrackTitleInput(track.name)
    setTrackResult(undefined)
  }

  return (
    <div>
      <div className="flex flex-col gap-2 mb-6 relative">
        <Label htmlFor="trackTitle">Track of the Show</Label>
        <div className="flex gap-4">
          <Input
            id="trackTitle"
            value={trackTitleInput || ''}
            onChange={(event) => handleInputTrackTitle(event.target.value)}
            type="text"
          />
          {artistName
          ? (
            <Button
              type="button"
              className="cursor-pointer"
              onClick={() => handleTrackSearchButton(trackTitleInput || '')}
            >
              Search
            </Button>
          ) : (
            <Button type="button" disabled>
              Search
            </Button>
          )}
        </div>
        {trackResult && (
          <ul className="absolute top-full  bg-background z-1000 rounded-b-2xl overflow-scroll w-3xs h-52">
            {trackResult.map((track) => (
              <li
                className="py-2 px-4 border-b border-b-accent cursor-pointer"
                onClick={() => handleSelectTrack(track)}
                key={track.id}
              >
                {track.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
