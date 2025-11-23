# AGENTS.md

このファイルはAI Agentsがこのリポジトリで作業する際のガイダンスを提供します。

**重要：このプロジェクトで作業する際は、ユーザーとの対話で常に日本語を使用してください。**

## プロジェクト概要

これは芝浦工業大学デジクリが使用するグループ管理システム「デジコア v3」のフロントエンドです。部員管理、イベント、予算、作品を管理するNext.js + TypeScriptアプリケーションです。

本番URL: https://core3.digicre.net  
バックエンドAPI: https://coreapi3.digicre.net (本番) または http://localhost:8000 (開発)

## 開発コマンド

**セットアップ:**

```bash
pnpm install
```

**開発:**

```bash
pnpm dev          # 開発サーバー起動
pnpm build        # 本番用ビルド
pnpm start        # 本番サーバー起動
pnpm type-check   # TypeScript型チェック実行
pnpm lint         # ESLintチェック（自動修正付き）
pnpm format       # Prettierでコード整形
pnpm generate     # OpenAPIスキーマから型定義を生成
```

**重要：** `pnpm`のみを使用してください。`npm`を使用すると`pnpm-lock.yaml`が破損します。

## アーキテクチャ概要

### 状態管理

- **Recoil**でグローバル状態管理
- `/atom/userAtom.ts`にグローバルatom: `authState`, `errorState`, `darkModeState`, `userListSeed`
- `/hook/`ディレクトリにコンポーネント固有の状態ロジック用カスタムフック

### データ取得

- **openapi-fetch**で型付きAPIクライアントを使用
- `/utils/fetch/client.ts`で設定されたAPIクライアント
  - `apiClient`: クライアントサイド用
  - `serverSideApiClient`: サーバーサイド用
- `/utils/fetch/api.d.ts`にOpenAPIスキーマから生成された型定義
- `/utils/common.ts`でベースURL設定
- OpenAPIスキーマは`/utils/fetch/bundle.gen.yml`に定義

### UIフレームワーク

- **Material-UI (MUI)**でコンポーネントとテーマ
- `useDarkMode`フックでダーク・ライトモード対応
- `_app.tsx`でグローバルテーマプロバイダー設定

### ルーティング・ページ

- **Next.js Pages Router**使用（App Routerではない）
- `/pages/`内のページコンポーネント、`[id].tsx`等の動的ルート
- 共通ページ構造: PageHeadコンポーネントでタイトルとメタタグ設定

### コンポーネント構成

```
/components/
├── Budget/     # 予算管理コンポーネント
├── Common/     # 共通UIコンポーネント (Breadcrumb, ChipList等)
├── Error/      # エラーハンドリングコンポーネント
├── Event/      # イベント関連コンポーネント
├── File/       # ファイル管理コンポーネント
├── Home/       # メインナビゲーション (AppBar, AccountMenu)
├── Mattermost/ # チャットプラットフォーム連携
├── Profile/    # ユーザープロフィールコンポーネント
├── Register/   # ユーザー登録フロー
└── Work/       # プロジェクト・作品コンポーネント
```

### 型定義

- `/interfaces/`ディレクトリに全インターフェース
- 主要型: `User`, `UserPrivateProfile`, APIレスポンス型
- 共通型は`/interfaces/index.ts`からインポート

### 認証

- JWTトークンをlocalStorageに保存
- `useAuthState`フックでログイン状態管理
- 認証失敗時は自動的にログインページにリダイレクト
- APIリクエストではBearer Token認証

## 開発ガイドライン

### コードスタイル

- ESLintで強制されるインポート順序: builtin → external → parent → sibling → index → object → type
- インポートグループ間は必ず改行
- console.logは禁止（console.warn/errorは可）

### ブランチ命名

- 新機能: `feat/(機能名)`
- 機能改善: `enhance/(機能名)`
- バグ修正: `fix/(機能名)`
- 機能名はケバブケースを使用

### コンポーネントパターン

- 全てのprops型にTypeScriptインターフェースを使用
- Material-UIコンポーネントとテーマを活用
- 複雑な状態ロジックはカスタムフックを使用
- ページタイトルとメタタグ設定にPageHeadコンポーネントを使用
- グローバルエラー表示にErrorViewコンポーネントを使用

### API連携

- `/hook/`内のカスタムフックでデータ取得
- 全てのAPIコールは型付きAPIクライアント（`apiClient`/`serverSideApiClient`）経由
- OpenAPIスキーマから生成された型定義により、エンドポイントとリクエスト/レスポンスの型安全性を保証
- グローバルエラー状態システムでエラーハンドリング
- リクエストヘッダーでBearer Token認証
- OpenAPIスキーマ更新時は`pnpm generate`で型定義を再生成
