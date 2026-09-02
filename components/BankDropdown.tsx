"use client";

import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
} from "@/components/ui/select";
import { formUrlQuery, formatAmount } from "@/lib/utils";

export const BankDropdown = ({
    accounts = [],
    setValue,
    otherStyles,
}: BankDropdownProps) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [selected, setSeclected] = useState(accounts[0]);

    const handleBankChange = (id: string) => {
        const account = accounts.find((account) => account.appwriteItemId === id)!;

        setSeclected(account);
        const newUrl = formUrlQuery({
            params: searchParams.toString(),
            key: "id",
            value: id,
        });
        router.push(newUrl, { scroll: false });

        if (setValue) {
            setValue("senderBank", id);
        }
    };

    return (
        <Select
            defaultValue={selected?.appwriteItemId || selected?.id}
            onValueChange={(value) => handleBankChange(value)}
        >
            <SelectTrigger
                className={`flex w-full bg-white gap-3 md:w-[320px] border-gray-300 focus:border-bankGradient focus:ring-1 focus:ring-bankGradient/20 transition-all ${otherStyles}`}
            >
                <div className="flex size-7 items-center justify-center rounded-md bg-blue-25 text-bankGradient">
                    <Image
                        src="/icons/credit-card.svg"
                        width={18}
                        height={18}
                        alt="account"
                    />
                </div>
                <div className="flex flex-1 items-center justify-between overflow-hidden pr-2">
                    <p className="line-clamp-1 text-left text-14 font-medium text-gray-800">{selected?.name}</p>
                    {selected?.currentBalance !== undefined && (
                        <span className="text-12 font-semibold text-bankGradient shrink-0">
                            {formatAmount(selected.currentBalance)}
                        </span>
                    )}
                </div>
            </SelectTrigger>
            <SelectContent
                className={`w-full bg-white md:w-[320px] shadow-lg border-gray-200 rounded-xl ${otherStyles}`}
                align="start"
            >
                <SelectGroup>
                    <SelectLabel className="py-2 px-3 text-12 font-medium text-gray-500 uppercase tracking-wider">
                        Select a bank account
                    </SelectLabel>
                    {accounts.map((account: Account) => (
                        <SelectItem
                            key={account.id}
                            value={account.appwriteItemId}
                            className="cursor-pointer border-t border-gray-100 hover:bg-blue-25/60 focus:bg-blue-25 transition-colors py-2.5 px-3"
                        >
                            <div className="flex flex-1 items-center justify-between w-full gap-3">
                                <div>
                                    <p className="text-14 font-medium text-gray-900">{account.name}</p>
                                    <p className="text-12 text-gray-500">{account.officialName || account.mask ? `•••• ${account.mask}` : 'Checking'}</p>
                                </div>
                                <p className="text-14 font-semibold text-bankGradient">
                                    {formatAmount(account.currentBalance)}
                                </p>
                            </div>
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};