# 寄り道クエスト

いつもの帰り道を、5〜15分の小さな冒険に変えるスマートフォン向けPWAです。

## ローカル実行

```sh
npm ci
npm run dev
```

`http://localhost:5173/?sample=1` では、位置情報の許可なしで主要フローを確認できます。

## 検証

```sh
npm run check
npm run test:e2e
```

## GitHub Pages

`main` ブランチへのpushでGitHub Actionsがビルドし、GitHub Pagesへ公開します。Pages用のサブパスはリポジトリ名から自動設定されます。
