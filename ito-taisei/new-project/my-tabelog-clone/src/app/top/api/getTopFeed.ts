// トップフィード（人気・新着）を取得するAPI
export async function getTopFeed() {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  // popular
  const popularRes = await fetch(`${baseUrl}/api/restaurants/popular`, {
    cache: "no-store",
  });
  const popular = popularRes.ok ? await popularRes.json() : [];

  // new-arrivals
  const newArrivalsRes = await fetch(
    `${baseUrl}/api/restaurants/new-arrivals`,
    {
      cache: "no-store",
    }
  );
  const newArrivals = newArrivalsRes.ok ? await newArrivalsRes.json() : [];

  return { popular, newArrivals };
}
