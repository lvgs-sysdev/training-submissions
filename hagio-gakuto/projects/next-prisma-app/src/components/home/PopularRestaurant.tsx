import LocationOnIcon from "@mui/icons-material/LocationOn";
import StorefrontIcon from "@mui/icons-material/Storefront";

export default function PopularRestaurant() {
  const restaurants = [
    {
      district: "渋谷区",
      name: "美味しいパスタ屋",
      description: "本格イタリアンが楽しめる",
    },
    {
      district: "港区",
      name: "絶品ラーメン道",
      description: "濃厚スープが自慢",
    },
    {
      district: "新宿区",
      name: "健康志向の定食屋",
      description: "野菜たっぷりでヘルシー",
    },
  ];

  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center mb-8">
          <StorefrontIcon className="w-8 h-8 text-sky-600 mr-3" />
          <h2 className="text-3xl font-bold text-gray-800">
            オフィス周辺の人気ランチ
          </h2>
        </div>
        <div className="max-w-2xl mx-auto space-y-4">
          {restaurants.map((resto) => (
            <div
              key={resto.name}
              className="p-4 border rounded-lg flex items-start gap-4 hover:shadow-md transition-shadow"
            >
              <LocationOnIcon className="w-6 h-6 text-sky-500 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-500 text-sm">
                  {resto.district}
                </p>
                <h3 className="text-lg font-bold text-gray-900">
                  {resto.name}
                </h3>
                <p className="text-gray-600">{resto.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
