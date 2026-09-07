"use client";

import { useSearchParams, useRouter } from "next/navigation";

import { cn, formUrlQuery } from "@/lib/utils";

export const BankTabItem = ({ account, appwriteItemId }: BankTabItemProps) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const isActive = appwriteItemId === account?.appwriteItemId;

    const handleBankChange = () => {
        const newUrl = formUrlQuery({
            params: searchParams.toString(),
            key: "id",
            value: account?.appwriteItemId,
        });
        router.push(newUrl, { scroll: false });
    };

    return (
        <div
            onClick={handleBankChange}
            className={cn(
                "cursor-pointer border-b-2 px-4 py-2.5 transition-all text-16 font-semibold whitespace-nowrap",
                isActive
                    ? "border-[#0179FE] text-[#0179FE]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
            )}
        >
            <p>{account.name}</p>
        </div>
    );
};