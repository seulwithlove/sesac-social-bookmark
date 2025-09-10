import { use } from "react";

type Props = {
  params: Promise<{ nickname: string }>;
};

export default function BookcaseNickname({ params }: Props) {
  const { nickname } = use(params);
  return (
    <div>
      <h1 className="text-3xl">{decodeURI(nickname)}` Bookcase</h1>
    </div>
  );
}
