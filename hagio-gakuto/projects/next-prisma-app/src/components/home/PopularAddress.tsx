import Image from "next/image";
import Link from "next/link";

export default function PopularAddress() {
  const areas = [
    {
      name: "渋谷区",
      averageRent: "50000円",
      href: "/properties?city=shibuya",
      image: "/images/areas/meguro.jpg",
    },
    {
      name: "港区",
      averageRent: "50000円",
      href: "/properties?city=minato",
      image: "/images/areas/meguro.jpg",
    },
    {
      name: "目黒区",
      averageRent: "50000円",
      href: "/properties?city=meguro",
      image: "/images/areas/meguro.jpg",
    },
  ];

  return (
    <section className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          人気のエリア
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {areas.map((area) => (
            <Link
              href={area.href}
              key={area.name}
              className="group block overflow-hidden rounded-xl shadow-lg"
            >
              <div className="relative">
                <Image
                  src={area.image}
                  alt={`${area.name}の街並み`}
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300 opacity-50" // ★ opacity-75を追加
                />

                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className=" text-2xl font-bold">{area.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
