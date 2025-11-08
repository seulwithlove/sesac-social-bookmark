"use server";
import ogs from "open-graph-scraper";

export const scrapOgs = async (url: string) => {
  const { result } = await ogs({ url });
  console.log("💻 - og.action.ts - result:", result);

  return result;
};
