# chakoshi API クライアント

chakoshi Judge API用のTypeScriptクライアントライブラリ - 生成AIシステムのためのガードレールサービスです。

## 概要

このプロジェクトは、テキスト内の不適切なコンテンツを検出するのに役立つchakoshi Judge APIと対話するためのTypeScriptクライアントを提供します。このAPIは、ハラスメント、暴力、プライバシー侵害、不適切な性的コンテンツなど、さまざまな有害コンテンツのカテゴリを識別できます。

## 機能

- 完全な型定義付きのTypeScriptサポート
- 複数のカテゴリにわたる包括的なコンテンツモデレーション
- フラグ付きコンテンツの高信頼度スコアリング
- 日本語コンテンツのサポート
- 使いやすいクライアントインターフェース

## インストール

```bash
npm install
```

## 設定

1. 環境変数のサンプルファイルをコピーします：
```bash
cp .env.example .env
```

2. `.env`ファイルにchakoshi APIキーを追加します：
```
CHAKOSHI_API_KEY=あなたのAPIキーをここに入力
```

## 使い方

### 基本的な使い方

```typescript
import { ChakoshiClient } from './chakoshi-client';

const client = new ChakoshiClient({
  apiKey: 'あなたのAPIキー',
  baseUrl: 'https://api.beta.chakoshi.ntt.com' // オプション
});

const result = await client.checkContent('不適切なコンテンツをチェックするテキスト');

console.log('ステータス:', result.status); // 'safe' または 'flagged'
console.log('信頼度:', result.confidence);
console.log('違反内容:', result.violations);
```

### レスポンスフォーマット

```typescript
interface GuardrailResponse {
  id: string;
  status: 'safe' | 'flagged' | 'blocked';
  violations?: string[];
  confidence: number;
  timestamp: string;
}
```

## APIカテゴリ

[公式ドキュメント](https://docs.chakoshi.ntt.com/docs/guide/category)を参照してください

## 実行例

```bash
npm run build

## または

npm run build && node dist/example.js
```

## プロジェクト構成

```
├── chakoshi-client.ts    # メインクライアント実装
├── example.ts           # テスト例とバッチテスト
├── package.json         # プロジェクトの依存関係
├── tsconfig.json        # TypeScript設定
├── .env.example         # 環境変数テンプレート
└── .gitignore          # Git無視ルール
```

## 環境変数

- `CHAKOSHI_API_KEY`: あなたのchakoshi APIキー（必須）
- `CHAKOSHI_BASE_URL`: カスタムベースURL（オプション、デフォルト: https://api.beta.chakoshi.ntt.com）

## APIドキュメント

より詳細なAPIドキュメントについては、こちらをご覧ください: https://docs.chakoshi.ntt.com/docs/api/