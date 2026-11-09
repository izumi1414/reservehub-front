# ReserveHub Frontend

ReserveHub の Web フロントエンドです。一般ユーザー向けの予約操作と、管理者向けの予約枠・予約・月別レポート管理を提供します。バックエンド API は [`reservehub-api`](https://github.com/izumi1414/reservehub-api) と連携します。

## システム概要

### 一般ユーザー

- ユーザー登録・ログイン・ログアウト
- 予約可能枠のカレンダー表示
- 新規予約、予約内容の確認、予約完了画面
- 自分の予約一覧・予約詳細・予約キャンセル
- メールアドレス・パスワード・アカウント情報の管理

### 管理者

- 予約枠の一覧、作成、編集、削除
- 予約の一覧と詳細確認
- 月別予約レポートの確認
- ユーザーレイアウトと管理者レイアウトの切り分け

## 使用技術

| 区分 | 技術 |
|---|---|
| フレームワーク | React 19.2、React Router 8 / React Router Framework |
| 言語 | TypeScript 5.9 |
| ビルドツール | Vite 8 |
| スタイリング | Tailwind CSS 4、CSS |
| アイコン | Lucide React |
| 認証 | JWT、ブラウザの `sessionStorage` |
| API通信 | Fetch API をラップした共通 API クライアント |
| コンテナ | Docker、Node.js 24 Alpine |
| パッケージ管理 | npm |

主な特徴は、React Router のレイアウト機能を使った一般ユーザー画面と管理者画面の分離、機能単位で API・型・UI コンポーネント・画面をまとめた構成です。

## ディレクトリ構成

```text
reserve-hub-frontend/
├── app/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── shared/       # 共通ヘッダー・ページヘッダー
│   │   │   ├── user/         # 一般ユーザー向けレイアウト
│   │   │   └── admin/        # 管理者向けレイアウト
│   │   └── ui/               # Button、Input、Modal、DataTable 等
│   ├── features/
│   │   ├── auth/             # 認証コンテキスト、ログイン、登録
│   │   ├── account/          # アカウント情報・メール・パスワード変更
│   │   ├── slots/            # 一般ユーザー向け予約枠・カレンダー
│   │   ├── reservations/     # 一般ユーザー向け予約操作
│   │   ├── admin-slots/      # 管理者向け予約枠管理
│   │   ├── admin-reservations/ # 管理者向け予約管理
│   │   └── monthly-report/   # 月別予約レポート
│   ├── lib/api/
│   │   ├── client.ts         # 共通 Fetch API クライアント
│   │   ├── errors.ts         # API エラー定義
│   │   └── token.ts          # JWT の sessionStorage 操作
│   ├── routes/
│   │   ├── auth/             # ログイン、ユーザー登録
│   │   ├── user/             # 一般ユーザー向け画面
│   │   └── admin/            # 管理者向け画面
│   ├── app.css               # Tailwind CSS とグローバルスタイル
│   ├── root.tsx              # アプリケーションルート
│   └── routes.ts             # URL とルートコンポーネントの定義
├── public/                   # favicon、ログイン背景画像など
├── Dockerfile
├── package.json
├── react-router.config.ts    # SSR 設定
├── vite.config.ts            # Vite・React Router・Tailwind 設定
└── tsconfig.json
```

## 主な画面ルート

### 認証

| パス | 内容 |
|---|---|
| `/login` | ログイン |
| `/register` | ユーザー登録 |

### 一般ユーザー

| パス | 内容 |
|---|---|
| `/reservations` | 予約枠一覧・カレンダー |
| `/reservations/new` | 新規予約入力 |
| `/reservations/confirm` | 予約内容確認 |
| `/reservations/complete` | 予約完了 |
| `/my/reservations` | 自分の予約一覧 |
| `/my/reservations/:reservationId` | 予約詳細・キャンセル |
| `/account` | アカウント情報 |
| `/account/email-edit` | メールアドレス変更 |
| `/account/password-edit` | パスワード変更 |

### 管理者

| パス | 内容 |
|---|---|
| `/admin/slots` | 予約枠一覧 |
| `/admin/slots/new` | 予約枠作成 |
| `/admin/slots/:slotId/edit` | 予約枠編集 |
| `/admin/reservations` | 予約一覧 |
| `/admin/reservations/:reservationId` | 予約詳細 |
| `/admin/reports/monthly` | 月別予約レポート |

## 認証と API 通信

- JWT を取得後、ブラウザの `sessionStorage` の `accessToken` キーに保存します。
- `apiClient` が認証が必要なリクエストに `Authorization` ヘッダーを付与します。
- アプリ起動時に `AuthProvider` が保存済みトークンから現在のユーザー情報を取得します。
- トークンがない、またはユーザー情報の取得に失敗した場合は未認証状態として扱います。
- API の基準 URL は環境変数 `VITE_API_BASE_URL` で設定します。
- API エラーは共通の `ApiError` として扱います。

## 開発環境でのセットアップ

### 前提条件

- Node.js 24 または互換バージョン
- npm
- ReserveHub API を `http://localhost:3000` で起動できる環境

### インストールと起動

```bash
cd reservehub-frontend
npm install
```

`.env` に API の接続先を設定します。

```dotenv
VITE_API_BASE_URL=http://localhost:3000
```

開発サーバーを起動します。

```bash
npm run dev
```

標準では `http://localhost:5173` でアクセスできます。

バックエンド API の詳細は、[フロントエンド向け API ガイド](../reservehub-api/docs/frontend-api-guide.md)を参照してください。

## npm コマンド

| コマンド | 内容 |
|---|---|
| `npm run dev` | 開発サーバーを起動します |
| `npm run build` | 本番用ビルドを `build/` 配下へ生成します |
| `npm run start` | ビルド済みサーバーを起動します |
| `npm run typecheck` | React Router 型生成後に TypeScript 型チェックを実行します |


## 本番ビルド

```bash
npm run build
npm run start
```

ビルド成果物は `build/client` と `build/server` に生成されます。

- `build/client`：ブラウザへ配信する静的アセット
- `build/server`：React Router のサーバーサイド実行ファイル
