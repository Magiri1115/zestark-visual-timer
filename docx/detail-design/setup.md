# 環境構築（ローカル開発 & GitHub Actions）

## 1. 前提条件

Tauri アプリの開発には、OSごとのビルドツールが必要です。

### 共通ツール
| ツール | 確認コマンド | 役割 |
|---|---|---|
| Node.js (LTS) | `node --version` | フロントエンド実行環境 |
| pnpm | `pnpm --version` | パッケージマネージャー |
| Rust | `rustc --version` | バックエンド（Tauri）言語 |

### OSごとの依存関係
- **Windows**: [WebView2 Runtime](https://developer.microsoft.com/en-us/microsoft-edge/webview2/) および [C++ ビルドツール](https://visualstudio.microsoft.com/visual-cpp-build-tools/) が必要です。
- **macOS**: Xcode Command Line Tools が必要です。
- **Linux**: `libwebkit2gtk-4.1-dev` 等のシステムライブラリが必要です。

詳細な手順は [Tauri 公式ドキュメント](https://v2.tauri.app/start/prerequisites/) を参照してください。

---

## 2. 開発環境の起動方法

### 手順 1: プロジェクトのクローンと依存関係のインストール

```bash
git clone <repository-url>
cd zestark-visual-timer
pnpm install
```

### 手順 2: 開発サーバーの起動

```bash
# フロントエンド + Tauri の同時起動
pnpm tauri dev
```

---

## 3. GitHub Actions による自動ビルド・配布

本プロジェクトでは、Docker の代わりに **GitHub Actions** を使用して、複数プラットフォーム向けのバイナリを自動生成します。

- **CI (ビルドチェック)**: `main` ブランチへのプッシュまたは PR 時に、フロントエンドと Rust のビルドチェックが自動実行されます。
- **リリース**: `main` ブランチにプッシュされると、Windows/macOS/Linux 用のインストーラーが自動ビルドされ、GitHub Releases にドラフトとして作成されます。

---

## 4. GitHub Packages / Artifacts の活用

ビルドされた成果物は GitHub の **Actions Artifacts** または **Releases** からダウンロード可能です。これにより、ローカル環境にすべてのビルドツールを揃えなくても、最終的な成果物を確認できます。
