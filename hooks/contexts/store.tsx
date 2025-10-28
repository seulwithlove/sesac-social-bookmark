"use client";

import { likesAndReports } from "@/app/bookcase/[id]/book.action";
import type { MarkAllColumn } from "@/lib/db";
import { useSession } from "next-auth/react";
import {
  createContext,
  type PropsWithChildren,
  use,
  useCallback,
  useEffect,
  useState,
} from "react";

type ContextValueProps = {
  iLikedMarks: number[];
  iReportedMarks: number[];
  toggleLikes: (mark: number) => void;
  toggleReports: (mark: number) => void;
};

const StoreContext = createContext<ContextValueProps>({
  iLikedMarks: [],
  iReportedMarks: [],
  toggleLikes: () => {},
  toggleReports: () => {},
});

export function StoreProvider({ children }: PropsWithChildren) {
  const [iLikedMarks, setLikedMarks] = useState<number[]>([]);
  const [iReportedMarks, setReportedMarks] = useState<number[]>([]);
  const { data: session } = useSession();

  const setMarks = useCallback((likes: number[], reports: number[]) => {
    // console.log('🚀 ~ likes/reports:', likes, reports);

    setLikedMarks(likes);
    setReportedMarks(reports);
  }, []);

  const toggleLikesOrReports = (mark: MarkAllColumn, type: "likes" | "reports") => {
    const [state, setState] =
      type === "likes"
        ? [iLikedMarks, setLikedMarks]
        : [iReportedMarks, setReportedMarks];

    const hasNow = state.includes(mark.id);
    if (hasNow) setState(state.filter((id) => id !== mark.id));
    else setState([...state, mark.id]);

    mark._count.Likes += hasNow ? -1 : 1;
  };

  const toggleLikes = (mark: number) => toggleLikesOrReports(mark, "likes");
  const toggleReports = (mark: number) => toggleLikesOrReports(mark, "reports");

  useEffect(() => {
    if (session?.user) {
      likesAndReports(Number(session.user.id)).then((res) => {
        const [likes, reports] = res;
        setMarks(
          likes.map(({ mark }) => mark),
          reports.map(({ mark }) => mark),
        );
      });
    }
  }, [session?.user, setMarks]);

  return (
    <StoreContext.Provider
      value={{ iLikedMarks, iReportedMarks, toggleLikes, toggleReports }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => use(StoreContext);
