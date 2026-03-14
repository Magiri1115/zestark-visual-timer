# ファイル構成

## 1. ディレクトリ構成

```
visual-bar-timer/
│
├── src/                          # フロントエンド（React + TypeScript）
│   ├── main.tsx                  # Reactエントリーポイント
│   ├── App.tsx                   # ルートコンポーネント
│   │
│   ├── components/               # UIコンポーネント
│   │   ├── Clock/
│   │   │   ├── Clock.tsx         # 時計表示コンポーネント
│   │   │   ├── Clock.module.css
│   │   │   └── index.ts
│   │   ├── Timer/
│   │   │   ├── Timer.tsx         # タイマー全体コンポーネント
│   │   │   ├── Timer.module.css
│   │   │   └── index.ts
│   │   ├── VisualBar/
│   │   │   ├── VisualBar.tsx     # 30セグメントバーコンポーネント
│   │   │   ├── VisualBar.module.css
│   │   │   └── index.ts
│   │   ├── TimeDisplay/
│   │   │   ├── TimeDisplay.tsx   # MM分SS秒 表示コンポーネント
│   │   │   ├── TimeDisplay.module.css
│   │   │   └── index.ts
│   │   ├── Controls/
│   │   │   ├── Controls.tsx      # 開始/停止/リセットボタン
│   │   │   ├── Controls.module.css
│   │   │   └── index.ts
│   │   └── AlarmBanner/
│   │       ├── AlarmBanner.tsx   # タイマー終了通知バナー
│   │       ├── AlarmBanner.module.css
│   │       └── index.ts
│   │
│   ├── hooks/                    # カスタムフック
│   │   ├── useClock.ts           # 現在時刻・タイムゾーン管理
│   │   ├── useTimer.ts           # タイマーロジック・状態管理
│   │   └── useAlarm.ts           # アラーム音・通知トリガー
│   │
│   ├── store/                    # 状態管理
│   │   ├── timerReducer.ts       # タイマー状態のreducer
│   │   └── types.ts              # 状態型定義
│   │
│   ├── lib/                      # ユーティリティ
│   │   ├── formatTime.ts         # 秒数 → MM分SS秒 変換
│   │   ├── calcSegments.ts       # 残り時間 → 点灯セグメント数計算
│   │   └── timezones.ts          # 選択可能タイムゾーン一覧
│   │
│   └── styles/
│       ├── global.css            # グローバルスタイル・CSS変数
│       └── reset.css             # CSSリセット
│
├── src-tauri/                    # バックエンド（Rust / Tauri）
│   ├── src/
│   │   ├── main.rs               # Tauriアプリエントリーポイント
│   │   ├── lib.rs                # コマンド登録
│   │   ├── timer.rs              # タイマー精度管理（tokio）
│   │   ├── alarm.rs              # アラーム音再生（rodio）
│   │   └── notification.rs       # デスクトップ通知
│   │
│   ├── assets/
│   │   └── alarm.ogg             # アラーム音ファイル
│   │
│   ├── icons/                    # アプリアイコン（各OS用）
│   │   ├── icon.ico
│   │   ├── icon.icns
│   │   └── icon.png
│   │
│   ├── Cargo.toml                # Rustパッケージ定義
│   └── tauri.conf.json           # Tauriアプリ設定
│
├── public/                       # 静的ファイル（Vite）
│   └── favicon.ico
│
├── .vscode/
│   └── settings.json             # エディタ設定
│
├── index.html                    # Viteエントリーhtml
├── vite.config.ts                # Viteビルド設定
├── tsconfig.json                 # TypeScript設定
├── tsconfig.node.json
├── eslint.config.js              # ESLint設定
├── .prettierrc                   # Prettier設定
├── package.json
└── pnpm-lock.yaml
```

---

## 2. 主要ファイルの責務

### フロントエンド

| ファイル | 責務 |
|---|---|
| `App.tsx` | `Clock` と `Timer` をレイアウトする最上位コンポーネント |
| `useClock.ts` | `setInterval` で1秒ごとに現在時刻を更新。タイムゾーン切替を管理 |
| `useTimer.ts` | タイマーの状態（未開始 / 実行中 / 停止 / 終了）を管理。Rustバックエンドと通信 |
| `useAlarm.ts` | タイマー終了イベントを受け取り、Rustのアラームコマンドを呼び出す |
| `timerReducer.ts` | `useReducer` で状態遷移を一元管理。副作用なし |
| `formatTime.ts` | 残り秒数を `MM分SS秒` 形式の文字列に変換 |
| `calcSegments.ts` | 残り時間から点灯すべきセグメント数（0〜30）を計算 |

### バックエンド（Rust）

| ファイル | 責務 |
|---|---|
| `timer.rs` | `tokio::time::interval` を使用した高精度タイマー。フロントエンドにイベントを送信 |
| `alarm.rs` | `rodio` で `alarm.ogg` を再生・停止 |
| `notification.rs` | `tauri-plugin-notification` でOSネイティブ通知を発行 |

---

## 3. データフロー

```
[フロントエンド]                    [バックエンド (Rust)]
      │                                      │
      │  invoke("start_timer", {minutes})    │
      │─────────────────────────────────────►│
      │                                      │ tokio::interval
      │  emit("timer_tick", {remaining_sec}) │
      │◄─────────────────────────────────────│
      │                                      │
      │  emit("timer_finished")              │
      │◄─────────────────────────────────────│
      │                                      │
      │  invoke("play_alarm")                │
      │─────────────────────────────────────►│ rodio 再生
      │                                      │
      │  invoke("stop_alarm")                │
      │─────────────────────────────────────►│ rodio 停止
```

---

## 4. 命名規則

| 対象 | 規則 | 例 |
|---|---|---|
| Reactコンポーネント | PascalCase | `VisualBar`, `AlarmBanner` |
| カスタムフック | camelCase + `use` 接頭辞 | `useTimer`, `useClock` |
| ユーティリティ関数 | camelCase | `formatTime`, `calcSegments` |
| 型・インターフェース | PascalCase | `TimerState`, `TimerAction` |
| CSS Modulesクラス | camelCase | `.segmentActive`, `.timeDisplay` |
| Rustモジュール | snake_case | `timer.rs`, `alarm.rs` |
| Tauriコマンド | snake_case | `start_timer`, `play_alarm` |