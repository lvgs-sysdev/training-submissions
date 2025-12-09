interface Props {
  heading: string
}

export const PageHeading = ({ heading }: Props) => {
  return (
    <h2 className="mb-8 text-4xl font-bold">{heading}</h2>
  )
}
