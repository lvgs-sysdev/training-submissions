テスト実装の推奨順序

  フェーズ1：単純な読み書き処理（基礎の強化）

  優先度：高

  まずは、これまでの知識を応用できる、比較的シンプルなものから片付けていきましょう。

   1. `user/service.ts` の `fetchUserById`
       * 理由: account の fetchAccountInfo とほぼ同じ構造です。DB (pool.query) をモックする良い復習になり、自信をつけるのに最適です。

   2. `post/search/service.ts` の `searchArtistsOfPosts`
       * 理由: これもシンプルな SELECT文ですが、LIKE句を使った検索のテスト方法を学べます。

   3. `post/actions.ts` の `deletePost`
       * 理由: シンプルな DELETE 処理のテストです。認証 (getVerifiedUser) とDB操作 (pool.query) のモックを組み合わせる、updateAccountInfoのテストと似た構成で取りかかりやすいでしょう。

  ---

  フェーズ2：外部API連携のテスト（新しい重要スキル）

  優先度：高

  ここが次の大きな学びのポイントです。

   4. `post/actions.ts` の `searchArtistsFromInput` と `searchTracksFromInput`
       * 理由: これらの関数は、内部でSpotify APIを呼び出しています。テストでは、実際のAPIを叩かずに、`@/lib/spotify` モジュール（または、それが内部で使っている
         `fetch`）をモックし、偽の検索結果を返すようにします。ネットワークに依存しない、高速で安定したテストの書き方を学ぶ絶好の機会です。

  ---

  フェーズ3：複雑なビジネスロジックのテスト

  優先度：中

  ここからは、依存関係やロジックが少しずつ複雑になります。

   5. `post/service.ts` の `fetchPosts` や `fetchPostById`
       * 理由: 複数のテーブルを JOIN しているため、モックで返すデータ構造を組み立てるのが少し複雑になります。しかし、pool.query をモックする基本は同じです。

   6. `post/actions.ts` の `createPost` と `updatePost`
       * 理由: getOrInsertArtist のような、内部で条件分岐して SELECT や INSERT を使い分ける関数を呼び出しています。複数のDB操作が連鎖するロジックのテスト方法を学びます。

  ---

  フェーズ4：特に複雑な依存関係を持つ認証処理

  優先度：低

  これらは最も難易度が高いので、最後に回しましょう。

   7. `auth` feature の `login`、`register`、 `logout`
       * 理由: bcrypt での暗号化処理、cookies() や redirect() といったNext.jsのサーバー専用機能、register に至ってはファイルシステムの操作まで含まれます。これらをモックするのは特殊な知識が必要になるため、今は後回しにするのが賢明です。

  まとめ

  `user` (service) → `post/search` (service) → `post` (action: delete) → `post` (action: search with Spotify) ... の順で進めていくのが、スキルを段階的に積み上げられる最も効率的なルートです。
