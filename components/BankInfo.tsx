"use client";

import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";

import {
    cn,
    formUrlQuery,
    formatAmount,
    getAccountTypeColors,
} from "@/lib/utils";

const getBankInitials = (name?: string) => {
    if (!name) return 'CB';
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
        return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
};

const BankInfo = ({ account, appwriteItemId, type }: BankInfoProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const isActive = appwriteItemId === account?.appwriteItemId;

    const handleBankChange = () => {
        const newUrl = formUrlQuery({
            params: searchParams.toString(),
            key: "id",
            value: account?.appwriteItemId,
        });
        router.push(newUrl, { scroll: false });
    };

    const initials = getBankInitials(account?.name);

    return (
        <div
            onClick={handleBankChange}
            className={cn(
                "flex items-center justify-between gap-4 rounded-xl bg-[#F5FAFF] p-5 transition-all",
                {
                    "shadow-sm border border-blue-700 cursor-pointer": type === "card" && isActive,
                    "hover:shadow-xs cursor-pointer": type === "card",
                }
            )}
        >
            <div className="flex items-center gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#0179FE] text-16 font-bold text-white shadow-xs">
                    {initials}
                </div>
                <div className="flex flex-col gap-0.5">
                    <h2 className="text-16 font-bold text-gray-900">
                        {account?.name || 'Chase Bank'}
                    </h2>
                    <p className="text-16 font-bold text-[#0179FE]">
                        {formatAmount(account?.currentBalance ?? 2588.12)}
                    </p>
                </div>
            </div>

            {account?.subtype && (
                <span className="rounded-full bg-[#ECFDF3] px-3.5 py-1 text-12 font-medium text-[#027A48] capitalize">
                    {account.subtype}
                </span>
            )}
        </div>
    );
};

export default BankInfo;