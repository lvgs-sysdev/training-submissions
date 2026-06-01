// ジャンル一覧と駅名一覧をAPIから取得するフック
import { useState, useEffect } from "react";

type Genre = { id: number; name: string };
type Station = { id: number; name: string };

export const useMasterData = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const [genreRes, stationRes] = await Promise.all([
          fetch("/api/genre", { signal: controller.signal }),
          fetch("/api/station", { signal: controller.signal }),
        ]);

        if (genreRes.ok && stationRes.ok) {
          const [gData, sData] = await Promise.all([
            genreRes.json(),
            stationRes.json(),
          ]);
          setGenres(gData);
          setStations(sData);
        }
      } catch (error: any) {
        if (error.name === "AbortError") {
          return;
        }
        console.error("Fetch error:", error);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    // クリーンアップ：画面から消えたら通信を止める
    return () => controller.abort();
  }, []);

  return { genres, stations, isLoading };
};
