interface Props {
  trackId: string;
}

export const SpotifyPreview = ({ trackId }: Props) => {
  return (
    <iframe
      data-testid="embed-iframe"
      style={{ borderRadius: '12px' }}
      src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator`}
      width="100%"
      height="80"
      frameBorder="0"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
      ></iframe>
  )
}
