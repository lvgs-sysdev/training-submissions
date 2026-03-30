import Navbar from "../../components/Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="min-h-screen">{children}</div>
      <div className="bg-black p-10 text-center">
        <p className="text-xl text-white">footer</p>
      </div>
    </>
  );
}
