import { describe, it, expect, vi, beforeEach } from "vitest";
import { createPostWithImages } from "./posts.service";
import pool from "../../../shared/database/db"; // DB設定のパス

// --- 💡 モックの設定（本物のDBに接続しないようにする） ---
vi.mock("../../../shared/database/db", () => ({
  default: {
    getConnection: vi.fn(),
  },
}));

describe("posts.service - createPostWithImages", () => {
  let mockConn: any;

  beforeEach(() => {
    // 各テストの前に、偽のDB接続オブジェクト（Connection）をリセットして準備する
    mockConn = {
      beginTransaction: vi.fn(),
      query: vi.fn().mockResolvedValue([{ insertId: 1 }]), // INSERT成功を装う
      commit: vi.fn(),
      rollback: vi.fn(),
      release: vi.fn(),
    };
    // pool.getConnection が呼ばれたら、この偽の接続を返すように設定
    (pool.getConnection as any).mockResolvedValue(mockConn);
  });

  it("画像が1枚以上ある場合、post_imagesへの挿入が実行されること", async () => {
    const imageUrls = ["http://example.com/dog.jpg"];

    await createPostWithImages(1, "テスト投稿", [1], imageUrls);

    // post_images への INSERT 文が呼ばれたか確認
    expect(mockConn.query).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO post_images"),
      expect.anything(),
    );
  });

  it("画像が空配列の場合、post_imagesへの挿入がスキップされること", async () => {
    const imageUrls: string[] = [];

    await createPostWithImages(1, "テスト投稿", [1], imageUrls);

    // post_images への INSERT が「呼ばれていないこと」を確認
    expect(mockConn.query).not.toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO post_images"),
      expect.anything(),
    );
  });
});
