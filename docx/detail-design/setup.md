# 環境構築

## 1. 前提条件

以下がインストール済みであること。

| ツール | 最低バージョン | 確認コマンド |
|---|---|---|
| Node.js | 20.x LTS | `node -v` |
| pnpm | 9.x | `pnpm -v` |
| Rust (rustup) | stable | `rustc --version` |
| Git | 2.x | `git --version` |

---

## 2. OS別の追加要件

### Windows

```powershell
# Microsoft C++ Build Tools が必要
# Visual Studio Installer から "C++ によるデスクトップ開発" をインストールする
# WebView2 は Windows 11 に標準搭載。Windows 10 は自動インストールされる
```

### macOS

```bash
# Xcode Command Line Tools
xcode-select --install
```

### Linux（Ubuntu / Debian 系）

```bash
sudo apt update
sudo apt install -y \
  libwebkit2gtk-4.1-dev \
  libssl-dev \
  libgtk-3-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev \
  libasound2-dev
```

---

## 3. Rust のセットアップ

```bash
# rustup のインストール（未インストールの場合）
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# stable ツールチェーンの確認
rustup default stable
rustup update

# バージョン確認
rustc --version
cargo --version
```

---

## 4. プロジェクトの作成

```bash
# pnpm のインストール（未インストールの場合）
npm install -g pnpm

# Tauri CLI のインストール
pnpm add -g @tauri-apps/cli

# Tauri + React + TypeScript プロジェクトの作成
pnpm create tauri-app@latest visual-bar-timer \
  --template react-ts \
  --manager pnpm

cd visual-bar-timer

# 依存パッケージのインストール
pnpm install
```

---

## 5. Tauri プラグインの追加

```bash
# デスクトップ通知プラグイン
pnpm tauri add notification

# 音声再生クレートの追加（Cargo.toml に追記）
cd src-tauri
cargo add rodio
cargo add tokio --features full
```

---

## 6. 開発サーバーの起動

```bash
# プロジェクトルートで実行
pnpm tauri dev
```

フロントエンド（Vite）とTauriウィンドウが同時に起動する。  
ホットリロードにより、フロントエンドの変更はウィンドウに即時反映される。

---

## 7. ビルド（本番）

```bash
# 各OSのネイティブインストーラーを生成
pnpm tauri build
```

出力先：`src-tauri/target/release/bundle/`

| OS | 生成物 |
|---|---|
| Windows | `.msi` / `.exe` |
| macOS | `.dmg` / `.app` |
| Linux | `.deb` / `.AppImage` |

---

## 8. 推奨エディタ設定（VS Code）

```bash
# 推奨拡張機能
code --install-extension rust-lang.rust-analyzer
code --install-extension tauri-apps.tauri-vscode
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
```

`.vscode/settings.json`

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[rust]": {
    "editor.defaultFormatter": "rust-lang.rust-analyzer"
  },
  "rust-analyzer.checkOnSave.command": "clippy"
}
```

---

## 9. 環境変数

本アプリはオフライン動作を前提とするため、環境変数は不要。  
開発時のみ以下を `.env.local` に設定できる。

```env
# Vite 開発サーバーポート（任意）
VITE_PORT=1420
```

---

## 10. トラブルシューティング

| 症状 | 対処 |
|---|---|
| `cargo build` が失敗する | `rustup update` でツールチェーンを更新する |
| Linux で WebView が表示されない | `libwebkit2gtk-4.1-dev` がインストールされているか確認する |
| Windows で MSVC エラーが出る | C++ Build Tools が正しくインストールされているか確認する |
| 音声が再生されない | Linux は `libasound2-dev` が必要。macOS / Windows は標準で動作する |
| `pnpm tauri dev` が遅い | Rust の初回ビルドは数分かかる。2回目以降はキャッシュにより高速化される |