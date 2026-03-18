# React 19 `useTransition` / `startTransition` メモ

最終確認日: 2026-03-18

## 背景

このリポジトリでは issue #202 の修正時に、「React 19 では `startTransition` に `async` 関数を渡せる」という前提と、「それでも多重送信防止のフラグとして `isPending` をそのまま使ってよいか」は別問題である、という整理が必要になった。

そのため、React 公式ドキュメントの最新仕様を確認したうえで、このリポジトリでの運用方針をまとめる。

## 公式仕様の要点

### 1. React 19 では `startTransition(async () => { ... })` がサポートされている

React 19 の公式ブログは、Actions の説明として「非同期関数を Transition の中で使える」ことを明記している。

参照:

- https://react.dev/blog/2024/12/05/react-19

要点:

- React 19 では async function を使う Transition が正式機能として紹介されている
- `useTransition` の `isPending` を pending UI に使う例もブログに掲載されている

### 2. ただし、`await` の後の state update は追加の `startTransition` が必要

React 19.2 の `useTransition` / `startTransition` リファレンスでは、`action` 内で `await` した後の state update は、現時点では追加でもう一度 `startTransition` で包む必要があると書かれている。

参照:

- https://react.dev/reference/react/useTransition
- https://react.dev/reference/react/startTransition

要点:

- `startTransition` に渡す関数は async でもよい
- ただし `await` 後の `setState` は、現状の既知制限として追加の `startTransition` が必要

### 3. `isPending` は「Transition が pending か」を表す

React 公式の `useTransition` リファレンスでは、`isPending` は pending Transition の有無を表すフラグとして説明されている。

参照:

- https://react.dev/reference/react/useTransition

要点:

- `isPending` は React の Transition 状態に紐づく
- 任意の API リクエスト全体を表す、汎用的な「送信中フラグ」とは別物として扱うほうが安全

## このリポジトリでの運用方針

### 多重送信防止

API リクエストの二重送信を防ぐ目的では、`useState` で `isSubmitting` を明示管理する。

理由:

- ボタン無効化と再送防止の責務を、ネットワークリクエスト単位で明確に持てる
- React の Transition の内部実装や将来の挙動差分に依存しすぎない

### `useTransition` を使う場面

`useTransition` / `startTransition` は以下に使う。

- `await` 後に行う UI 更新を Transition 扱いにしたいとき
- 画面再取得や軽量な UI 更新を non-blocking にしたいとき
- 既存コードベースの「await 後の更新は追加の `startTransition` で包む」という流儀に合わせるとき

## 今回の実装への反映

issue #202 対応では次のように整理する。

- 多重送信防止: `isSubmitting`
- `await` 後の UI 更新: `startTransition`
- 画面再取得: `router.replace(router.asPath)` を Transition 内で呼ぶ

この方針により、「React 19 の async Transition を使う」ことと、「多重送信を確実に防ぐ」ことを両立する。
