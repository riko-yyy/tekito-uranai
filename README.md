# テキトー占い

星占い風のランキングではなく、「今日やってみる小さな行動」を提案する占いアプリ。
星評価・ラッキーカラーは補助情報として添える程度に留め、「結果をシェア」をメインアクションにしている。

- 公開URL: https://tekito-uranai.vercel.app
- 方針・技術選定の背景: [docs/decision.md](docs/decision.md)

## 主な機能

- 今日のアクションをランダムに1つ提示(1日1回、直近7日間は重複回避)
- 履歴・お気に入り(IndexedDBで端末内に保存。アカウント登録・ログイン不要)
- アクションの完了トグル(「これ、やった」)と、達成専用のシェア画像
- 結果・達成をCanvas生成した画像でシェア(Web Share API、非対応環境はダウンロードにフォールバック)
- PWA対応(ホーム画面に追加してインストール可能、オフライン動作)

## 技術スタック

- React 19 + TypeScript + Vite
- IndexedDB(`idb`)によるクライアント内永続化
- `vite-plugin-pwa`(Workbox)によるPWA化
- Vitest + `fake-indexeddb` によるユニットテスト
- デプロイ: Vercel(GitHub連携で自動デプロイ)

バックエンドは無し。静的JSON配信 + クライアント処理のみで完結するサーバーレス構成。

## セットアップ

Node.js 20系が必要(`.nvmrc`参照)。

```bash
nvm use
npm install
npm run dev
```

`http://localhost:5173` で起動する。

## スクリプト

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | 型チェック + 本番ビルド |
| `npm run preview` | 本番ビルドをローカルで確認(Service Worker込み) |
| `npm run test` | ユニットテスト実行(Vitest) |
| `npm run lint` | Lint実行(oxlint) |

## プロジェクト構成(抜粋)

```
src/
  components/   画面・UIコンポーネント
  hooks/        データ取得・状態管理(useActionsData, useHistory)
  lib/          占いロジック・IndexedDB・シェア処理などの純粋関数/ユーティリティ
  data/         型定義
docs/
  decision.md                     プロダクト・技術方針の意思決定サマリー
  teki_uranai_actions.json        アクションDB(元データ。配信用は public/data/ に複製)
```

## 開発ワークフロー

`main` ブランチへの直接コミットはせず、機能ごとに `feature/*` ブランチを切ってPRを作成し、マージする運用。
