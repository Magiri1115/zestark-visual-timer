# 環境構築（Docker/Dev Container）

## 1. 前提条件

ローカル環境には以下のツールのみが必要です。

| ツール | 確認コマンド | 役割 |
|---|---|---|
| Docker Desktop | `docker --version` | 開発環境のコンテナ化 |
| VS Code | `code --version` | 推奨エディタ |
| Dev Containers (拡張機能) | - | VS Code 内でコンテナを開くため |

**※ ローカルに Node.js, pnpm, Rust, Cargo をインストールする必要はありません。**

---

## 2. 開発環境の起動方法

### 手順 1: プロジェクトを VS Code で開く

```bash
code zestark-visual-timer
```

### 手順 2: コンテナをビルド・起動する

1. VS Code 右下に表示される **「Reopen in Container」** ポップアップをクリック。
2. または、コマンドパレット（`Ctrl+Shift+P`）から **`Dev Containers: Reopen in Container`** を選択。

### 手順 3: 依存関係のインストール（自動）

コンテナ起動時に `pnpm install` が自動的に実行されます。

---

## 3. 開発コマンド（コンテナ内）

VS Code の内蔵ターミナル（コンテナ内）で実行します。

```bash
# フロントエンドの開発サーバー起動
pnpm dev

# Tauri アプリのビルド・実行（Linux/WSL2環境でGUI表示が必要）
pnpm tauri dev
```

---

## 4. GitHub Actions でのビルド

ローカルでのビルドが困難な場合、GitHub にプッシュするだけで Actions が自動的に実行バイナリを生成します。

```bash
git push origin main
```

---

## 5. Docker 構成の仕組み

- **[Dockerfile.dev](Dockerfile.dev)**: `rust:1.77` をベースに Node.js, pnpm, Tauri 依存パッケージをプリインストールした開発用イメージ。
- **[docker-compose.yml](docker-compose.yml)**: 
  - ホストのソースコードを `/app` にマウント。
  - `pnpm-cache`, `cargo-cache` などのボリュームを使用して、再起動時のビルド速度を高速化。
- **[.devcontainer/devcontainer.json](.devcontainer/devcontainer.json)**: VS Code の開発環境をコンテナと連携させる設定。
