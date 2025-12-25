import { zalandSansExpanded } from "@/lib/fonts"

interface Props {
  heading: string
}

export const PageHeading = ({ heading }: Props) => {
  return (
    <h2 className={`${zalandSansExpanded.variable} font-zaland-sans-expanded mb-8 text-3xl font-bold`}>{heading}</h2>
  )
}
