import { vi, describe, it, expect } from "vitest";
import { getAccessGeolocationAPI } from "../../../src/FrontendScript/APIservice/getAccessGeolocationAPI.ts";

it("ボタンを押すと、偽の位置情報を使って画面に生物データが表示されること", async () => {
  // 1. GPSを偽物に差し替える（シミュレータ化）
  vi.stubGlobal("navigator", {
    geolocation: {
      getCurrentPosition: vi
        .fn()
        .mockImplementation((success) =>
          success({ coords: { latitude: 40, longitude: 140 } }),
        ),
    },
  });

  // 2. 画面（コンポーネント）を表示する
  // render(<App />);

  // 3. 実行：ボタンをクリックする操作をシミュレート
  // const button = screen.getByText("位置情報をスキャン");
  // await fireEvent.click(button);

  // 4. 検証：画面にサーバーから届いた「生物名」が表示されたか確認
  // await waitFor(() => {
  //   expect(screen.getByText("Uncultured bacterium")).toBeInTheDocument();
  // });
});
