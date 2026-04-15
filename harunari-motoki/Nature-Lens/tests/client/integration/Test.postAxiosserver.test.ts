import { vi, describe, it, expect } from "vitest";
import { postAxiosserver } from "../../../src/FrontendScript/APIservice/postAxiosserver.ts";
import { userGeolocationdata } from "../../../src/sharedObject/typeDeffinition.ts";
import axios from "axios";
vi.mock("axios");

describe("getAccessGeolocationAPI", () => {
  it("サーバからの該当ありのレスポンス取得に成功したとき、正しいデータを返すこと", async () => {
    // 1. モックの作成（タイポを修正し、vi.stubGlobalでグローバルに登録）
    const URL: string = "/scanResult";
    const data: userGeolocationdata = {
      latitude: 40,
      longitude: 130,
    };
    const mockResponseData = {
      status: "Applicable",
      data: {
        offset: 0,
        limit: 1,
        endOfRecords: false,
        count: 41,
        results: [
          {
            offset: 0,
            limit: 1,
            endOfRecords: false,
            count: 41,
            results: [
              {
                key: 3345671468,
                year: 2009,
                month: 9,
                day: 15,
                gbifID: "3345671468",
                occurrenceID: "AB559014",
              },
            ],
            facets: [],
          },
        ],
        facets: [],
      },
      message: "該当データあり",
    };
    //HTTPレスポンスのdata部分のみを取り出す
    vi.mocked(axios.post).mockResolvedValue({ data: mockResponseData });

    // 2. テストの実行（itのブロック内に含める）
    const result = await postAxiosserver(URL, data);

    // 3. 検証
    expect(result.status).toBe("Applicable");
    if (result.status === "Applicable" && result.data) {
      expect(result).toEqual({
        status: "Applicable",
        data: {
          offset: 0,
          limit: 1,
          endOfRecords: false,
          count: 41,
          results: [
            {
              offset: 0,
              limit: 1,
              endOfRecords: false,
              count: 41,
              results: [
                {
                  key: 3345671468,
                  year: 2009,
                  month: 9,
                  day: 15,
                  gbifID: "3345671468",
                  occurrenceID: "AB559014",
                },
              ],
              facets: [],
            },
          ],
          facets: [],
        },
        message: "該当データあり",
      });
    }
  });

  it("サーバからの該当なしレスポンス取得に成功したとき、正しいデータを返すこと", async () => {
    // 1. モックの作成（タイポを修正し、vi.stubGlobalでグローバルに登録）
    const URL: string = "/scanResult";
    const data: userGeolocationdata = {
      latitude: -50,
      longitude: -122,
    };
    const mockResponseData = {
      status: "NotApplicable",
      message: "該当データなし",
    };
    //HTTPレスポンスのdata部分のみを取り出す
    vi.mocked(axios.post).mockResolvedValue({ data: mockResponseData });

    // 2. テストの実行（itのブロック内に含める）
    const result = await postAxiosserver(URL, data);

    // 3. 検証
    expect(result.status).toBe("NotApplicable");
    if (result.status === "NotApplicable" && result.message) {
      expect(result).toEqual({
        status: "NotApplicable",
        message: "該当データなし",
      });
    }
  });

  it("サーバーが400を返したとき、'error'という例外を投げること", async () => {
    // 1. モックの作成（タイポを修正し、vi.stubGlobalでグローバルに登録）
    const URL: string = "/scanResult";
    const data: userGeolocationdata = {
      latitude: -50,
      longitude: -122,
    };
    // 1. axios.post がエラー（400など）を返すように設定
    vi.mocked(axios.post).mockRejectedValue(new Error("なんでもいいエラー"));

    await expect(postAxiosserver(URL, data)).rejects.toThrow("error");
  });
});
