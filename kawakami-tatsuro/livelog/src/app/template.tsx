import { Header } from "@/components/Header";

export default function Template ({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="p-4 md:p-8 flex-1 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </>
  )
}
