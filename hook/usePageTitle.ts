import { atom, useRecoilState } from "recoil";

const pageTitleState = atom<string>({
  key: "pageTitleState",
  default: "ページタイトル",
});

export const usePageTitle = () => {
  const [title, setTitle] = useRecoilState(pageTitleState);
  return { title, setTitle };
};
