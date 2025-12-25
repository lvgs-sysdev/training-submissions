import Link from "next/link"
import { SpotifyArtist } from "../../types"
import Image from "next/image"

interface Props {
  artists: SpotifyArtist[]
}

export const ArtistsList = ({ artists }: Props) => {
  return (
    <ul className="flex overflow-scroll gap-4 w-full">
      {artists.map((artist) => (
        <li
          key={artist.id}
          className="shrink-0 w-22 text-center"
        >
          <Link className="flex flex-col gap-2" href={`/post/search?artist=${encodeURIComponent(artist.name)}`}>
            <Image
              src={artist.images[0].url}
              alt={`Image of ${artist.name}`}
              width="88"
              height="88"
              className="rounded-full h-22"
            />
            <p className="self-center text-[12px] wrap-anywhere">{artist.name}</p>
          </Link>
        </li>
      ))}
    </ul>
  )
}
