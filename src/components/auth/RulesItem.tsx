"use client";

import { useRouter } from "next/navigation";

import { Icon } from "@components/Icon";

export default function RulesItem() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-[10px] text-primary w-[270px] h-fit p-[10px]">
      <div
        className="flex items-center gap-[18px] h-[70px] px-[19px] py-[18px] bg-surface rounded-[16px] shadow-md cursor-pointer"
        onClick={() => router.push("/regulamin")}
      >
        <Icon className="fill">book_5</Icon>
        <div className="font-extralight text-on-surface-variant text-[22px]">
          regulamin
        </div>
      </div>
    </div>
  );
}
