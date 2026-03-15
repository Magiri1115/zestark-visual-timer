# Visual Timer (Zestark Visual Timer)

Tauri と React で構築された、デスクトップ向けのビジュアルタイマーアプリケーションです。

## 特徴

- **視覚的な進捗**: タイマーの残り時間が視覚的にわかりやすく表示されます。
- **マルチタイムゾーン**: 世界時計（Clock）機能を備え、タイムゾーンの切り替えが可能です。
- **OS通知**: タイマー終了時にデスクトップ通知とアラーム音で知らせます。
- **Rust バックエンド**: タイマーロジックとアラーム処理は Rust で実装されており、正確で安定した動作を提供します。

## 開発環境のセットアップ

このプロジェクトをローカルで実行するには、以下のツールが必要です。

- [Node.js](https://nodejs.org/) (pnpm 推奨)
- [Rust](https://www.rust-lang.org/ja/learn/get-started)
- [Tauri 依存関係](https://tauri.app/v1/guides/getting-started/prerequisites)

### セットアップ手順

1. 依存関係のインストール:
   ```bash
   pnpm install
   ```

2. 開発モードで起動:
   ```bash
   pnpm tauri dev
   ```

### ビルド

アプリケーションをパッケージ化（ビルド）するには以下のコマンドを実行します。

```bash
pnpm tauri build
```

## プロジェクト構造

- `src/`: React フロントエンド (TypeScript, CSS Modules)
- `src-tauri/`: Rust バックエンド (Tauri 設定, タイマーロジック)
- `dist/`: フロントエンドのビルド済み資産
