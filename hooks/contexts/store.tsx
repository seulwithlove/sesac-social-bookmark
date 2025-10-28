"use client";

import { likesAndReports } from "@/app/bookcase/[id]/book.action";
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
  // setMarks: (likes: number[], reports: number[]) => void;
};

const StoreContext = createContext<ContextValueProps>({
  iLikedMarks: [],
  iReportedMarks: [],
  // setMarks: () => {},
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

  const toggleLikes = (mark: number) => {
    if (iLikedMarks.includes(mark))
      setLikedMarks(iLikedMarks.filter((id) => id !== mark));
    else setLikedMarks([...iLikedMarks, mark]);
  };
  const toggleReport = (mark: number) => {
    if (iReportedMarks.includes(mark))
      setLikedMarks(iReportedMarks.filter((id) => id !== mark));
    else setReportedMarks([...iReportedMarks, mark]);
  };

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
    <StoreContext.Provider value={{ iLikedMarks, iReportedMarks }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => use(StoreContext);
