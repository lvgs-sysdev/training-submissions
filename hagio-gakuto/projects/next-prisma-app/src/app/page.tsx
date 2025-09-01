import PopularAddress from "@/components/home/PopularAddress";
import PopularRestaurant from "@/components/home/PopularRestaurant";
import Tasks from "@/components/home/Tasks";

export default function Home() {
  return (
    <div>
      <PopularAddress />
      <PopularRestaurant />
      <Tasks />
    </div>
  );
}
