'use client'

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArtistSearchField } from "./ArtistSearchField"
import { TrackSearchField } from "./TrackSearchField"
import { SpotifyPreview } from "@/components/SpotifyPreview"
import { ApiResponse, SpotifyArtist, SpotifyTrack } from "../../../../types"
import { SelectedArtist, SelectedTrack } from "../types"
import { formatDateForInput } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface Props {
  initialData?: {
    show_date: string;
    artist_id: string;
    artist_name: string;
    track_id: string;
    track_title: string;
    content: string;
  };
  action: (formData: FormData) => Promise<ApiResponse<null>>;
}

export const PostForm = ({ initialData, action }: Props ) => {
  const router = useRouter()
  const [selectedArtist, setSelectedArtist] = useState<SelectedArtist | undefined>(
    initialData
    ? { id: initialData.artist_id, name: initialData.artist_name }
    : undefined
  )
  const [selectedTrack, setSelectedTrack] = useState<SelectedTrack | undefined>(
    initialData
    ? { id: initialData.track_id, name: initialData.track_title }
    : undefined
  )

  const onArtistSelect = (artist: SpotifyArtist) => {
    const selectedArtist: SelectedArtist = {
      id: artist.id,
      name: artist.name
    }
    setSelectedArtist(selectedArtist)
  }

  const onArtistInputChange = () => {
    setSelectedArtist(undefined)
    setSelectedTrack(undefined)
  }

  const onTrackSelect = (track: SpotifyTrack) => {
    const selectedTrack: SelectedTrack = {
      id: track.id,
      name: track.name
    }
    setSelectedTrack(selectedTrack)
  }

  const onTrackInputChange = () => {
    setSelectedTrack(undefined)
  }

  const handleSubmit = async (formData: FormData) => {
    const response: ApiResponse<null> = await action(formData)

    if (response.status === 401) return alert('Your session has timed out.\nPlease log in again.')
    if (response.status === 500) return alert('Something went wrong. Please try again later.')

    if (response.status === 404) {
      alert('This post is not found.\nIt may have already been deleted. ')
      router.push('/')
      router.refresh()
      return
    }
  }

  return (
    <form action={handleSubmit}>
      <div className="flex flex-col gap-2 mb-6">
        <Label htmlFor="showDate">Date of the Show</Label>
        <Input type="date" name="showDate" id="showDate" className="cursor-pointer" defaultValue={formatDateForInput(initialData?.show_date) || ''} required/>
      </div>
      <ArtistSearchField initialData={selectedArtist?.name} onArtistSelect={onArtistSelect} onArtistInputChange={onArtistInputChange} />
      <TrackSearchField initialData={selectedTrack?.name} artistName={selectedArtist?.name || ''} onTrackSelect={onTrackSelect} onTrackInputChange={onTrackInputChange} />
      {selectedTrack &&
      <SpotifyPreview  trackId={selectedTrack?.id || ''} />}
      <div className="flex flex-col gap-2 my-6 relative">
        <Label htmlFor="content">Content</Label>
        <Textarea id="content" name="content" className="h-24" defaultValue={initialData?.content || ''}></Textarea>
      </div>
      <input type="hidden" name="artistSpotifyId" value={selectedArtist?.id || ''} />
      <input type="hidden" name="artistName" value={selectedArtist?.name || ''} />
      <input type="hidden" name="trackSpotifyId" value={selectedTrack?.id || ''} />
      <input type="hidden" name="trackTitle" value={selectedTrack?.name || ''} />
      <Input type="submit" className="cursor-pointer bg-foreground text-background h-12" value="Post" />
    </form>
  )
}
