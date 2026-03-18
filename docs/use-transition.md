# `useTransition` / `startTransition` の使い方

最終確認日: 2026-03-18

## 概要

React 19 では、`startTransition` に渡すコールバックを非同期関数にできる。  
これにより、非同期処理を含む Action を Transition として扱える。

参照:

- https://react.dev/blog/2024/12/05/react-19
- https://react.dev/reference/react/useTransition
- https://react.dev/reference/react/startTransition

## 基本形

```tsx
const [isPending, startTransition] = useTransition();

const handleAction = () => {
  startTransition(async () => {
    const result = await fetchSomething();

    startTransition(() => {
      setData(result);
    });
  });
};
```

## ポイント

### 1. `isPending` で pending UI を制御できる

`useTransition` は `[isPending, startTransition]` を返す。  
`isPending` は Transition が pending の間 `true` になるため、ボタンの `disabled` やスピナー表示に使える。

```tsx
<Button disabled={isPending}>{isPending ? <CircularProgress size={16} /> : "送信"}</Button>
```

### 2. React 19 では `async` な Action を渡せる

React 19 では、`startTransition(async () => { ... })` の形がサポートされている。

```tsx
startTransition(async () => {
  await submit();
});
```

### 3. `await` 後の state update は追加で `startTransition` で包む

React 公式リファレンスでは、`await` の後に行う state update は、現時点では追加でもう一度 `startTransition` で包む必要があると説明されている。

```tsx
startTransition(async () => {
  const response = await submit();

  startTransition(() => {
    setResponse(response);
  });
});
```

## このリポジトリでの方針

このリポジトリでは、非同期 Action を含む UI 更新に `useTransition` を使う。

主な使い方:

- API 呼び出しを含む処理を `startTransition(async () => { ... })` で包む
- `await` 後の `setState` や `router.replace(...)` は追加の `startTransition` で包む
- ボタン無効化やローディング表示は `isPending` に紐づける

## 例

```tsx
const [isPending, startTransition] = useTransition();

const handleSubmit = () => {
  startTransition(async () => {
    const { error } = await apiClient.POST("/example", { body: payload });

    if (error) {
      startTransition(() => {
        setError("送信に失敗しました");
      });
      return;
    }

    startTransition(() => {
      removeError("example-fail");
      void router.replace(router.asPath);
    });
  });
};
```
