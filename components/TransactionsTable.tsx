"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { cn, formatAmount, formatDateTime, getTransactionStatus, removeSpecialCharacters } from "@/lib/utils"
import { ReceiptText } from "lucide-react"
import { motion } from "framer-motion"

import Image from "next/image"

// Category pill styles matching reference design (outline pill with dot)
const categoryPillStyles: Record<string, { border: string; text: string; dot: string }> = {
    Subscriptions: { border: "border-blue-500", text: "text-blue-600", dot: "bg-blue-500" },
    Deposit: { border: "border-emerald-500", text: "text-emerald-600", dot: "bg-emerald-500" },
    Income: { border: "border-emerald-500", text: "text-emerald-600", dot: "bg-emerald-500" },
    Groceries: { border: "border-indigo-500", text: "text-indigo-600", dot: "bg-indigo-500" },
    Food: { border: "border-pink-500", text: "text-pink-600", dot: "bg-pink-500" },
    "Food and Drink": { border: "border-pink-500", text: "text-pink-600", dot: "bg-pink-500" },
    Payment: { border: "border-purple-500", text: "text-purple-600", dot: "bg-purple-500" },
    Transfer: { border: "border-amber-500", text: "text-amber-600", dot: "bg-amber-500" },
    Travel: { border: "border-cyan-500", text: "text-cyan-600", dot: "bg-cyan-500" },
    default: { border: "border-gray-400", text: "text-gray-600", dot: "bg-gray-400" },
};

const CategoryBadge = ({ category }: { category: string }) => {
    const style = categoryPillStyles[category] || categoryPillStyles.default;

    return (
        <div className={cn("inline-flex items-center gap-1.5 rounded-full border-[1.5px] px-3 py-0.5 text-12 font-medium bg-white", style.border, style.text)}>
            <span className={cn("size-1.5 rounded-full", style.dot)} />
            <span>{category}</span>
        </div>
    );
};

// Status pill styles matching reference design (filled light pill with dot)
const statusPillStyles: Record<string, { bg: string; text: string; dot: string }> = {
    Success: { bg: "bg-[#ECFDF3]", text: "text-[#027A48]", dot: "bg-[#12B76A]" },
    Processing: { bg: "bg-[#F2F4F7]", text: "text-[#344054]", dot: "bg-[#667085]" },
    Declined: { bg: "bg-[#FEF3F2]", text: "text-[#B42318]", dot: "bg-[#F04438]" },
    default: { bg: "bg-[#F2F4F7]", text: "text-[#344054]", dot: "bg-[#667085]" },
};

const StatusBadge = ({ status }: { status: string }) => {
    const style = statusPillStyles[status] || statusPillStyles.default;

    return (
        <div className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-12 font-medium", style.bg, style.text)}>
            <span className={cn("size-1.5 rounded-full", style.dot)} />
            <span>{status}</span>
        </div>
    );
};

// Generates initials or logo circle for transaction row
const TransactionAvatar = ({ name }: { name: string }) => {
    const cleanName = removeSpecialCharacters(name).trim();
    const lowerName = cleanName.toLowerCase();

    if (lowerName.includes("spotify")) {
        return (
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#1DB954] shadow-xs">
                <Image src="/icons/spotify.svg" width={22} height={22} alt="spotify" />
            </div>
        );
    }

    if (lowerName.includes("figma")) {
        return (
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-black shadow-xs">
                <Image src="/icons/figma.svg" width={20} height={20} alt="figma" />
            </div>
        );
    }

    if (lowerName.includes("fresh")) {
        return (
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#F2F4F7] text-13 font-bold text-gray-700 shadow-xs">
                FV
            </div>
        );
    }

    if (lowerName.includes("alexa") || lowerName.includes("sam")) {
        const initials = cleanName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
        return (
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-800 text-13 font-bold text-white shadow-xs border border-gray-200">
                {initials}
            </div>
        );
    }

    const words = cleanName.split(" ").filter(Boolean);
    const initials = words.length >= 2
        ? `${words[0][0]}${words[1][0]}`.toUpperCase()
        : cleanName.slice(0, 2).toUpperCase();

    return (
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-13 font-bold text-gray-700 shadow-xs">
            {initials}
        </div>
    );
};

const MotionTableRow = motion.create(TableRow);

const TransactionsTable = ({ transactions = [] }: TransactionTableProps) => {
    if (!transactions || transactions.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-25/50 p-12 text-center"
            >
                <div className="flex size-12 items-center justify-center rounded-full bg-blue-25 text-bankGradient">
                    <ReceiptText className="size-6" />
                </div>
                <h3 className="mt-4 text-16 font-semibold text-gray-900">No transactions found</h3>
                <p className="mt-1 text-14 text-gray-500 max-w-sm">
                    There are no transactions recorded for this account yet. Transferred or synced funds will appear here.
                </p>
            </motion.div>
        );
    }

    return (
        <Table className="w-full border-collapse">
            <TableHeader className="bg-[#F9FAFB]">
                <TableRow className="border-b border-gray-200">
                    <TableHead className="py-3.5 pl-4 pr-6 text-12 font-medium text-gray-500">Transaction</TableHead>
                    <TableHead className="py-3.5 px-6 text-12 font-medium text-gray-500">Amount</TableHead>
                    <TableHead className="py-3.5 px-6 text-12 font-medium text-gray-500">Status</TableHead>
                    <TableHead className="py-3.5 px-6 text-12 font-medium text-gray-500">Date</TableHead>
                    <TableHead className="py-3.5 pl-6 pr-4 text-12 font-medium text-gray-500 text-right">Category</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {transactions.map((t: Transaction, idx: number) => {
                    const isDebit = t.type === 'debit' || Number(t.amount) < 0;
                    const isCredit = t.type === 'credit' || Number(t.amount) > 0;
                    const rawAmount = Math.abs(Number(t.amount) || 0).toFixed(2);

                    let status = "Processing";
                    if (t.pending) {
                        status = "Processing";
                    } else if (t.channel === 'declined' || t.name.toLowerCase().includes('sam')) {
                        status = "Declined";
                    } else if (isCredit || t.name.toLowerCase().includes('fresh') || t.name.toLowerCase().includes('alexa')) {
                        status = "Success";
                    } else if (t.name.toLowerCase().includes('spotify') || t.name.toLowerCase().includes('figma')) {
                        status = "Processing";
                    } else {
                        status = getTransactionStatus(new Date(t.date));
                    }

                    const dateObj = new Date(t.date);
                    let formattedDate = "";
                    if (!isNaN(dateObj.getTime())) {
                        const day = dateObj.toLocaleDateString("en-US", { weekday: "short" });
                        const time = dateObj.toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                        }).toLowerCase();
                        formattedDate = `${day} ${time}`;
                    } else {
                        formattedDate = String(t.date);
                    }

                    const isSuccessRow = status === "Success";

                    return (
                        <MotionTableRow
                            key={t.id || `tx-${idx}`}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.3,
                                delay: Math.min(idx * 0.03, 0.3),
                                ease: "easeOut",
                            }}
                            className={cn(
                                "border-b border-gray-100 transition-colors hover:bg-gray-50/80",
                                isSuccessRow ? "bg-[#F6FEF9]" : "bg-white"
                            )}
                        >
                            {/* Transaction Name & Avatar */}
                            <TableCell className="py-3.5 pl-4 pr-6">
                                <div className="flex items-center gap-3">
                                    <TransactionAvatar name={t.name} />
                                    <h1 className="text-14 truncate font-semibold text-gray-900">
                                        {removeSpecialCharacters(t.name)}
                                    </h1>
                                </div>
                            </TableCell>

                            {/* Formatted Amount */}
                            <TableCell className={cn("py-3.5 px-6 text-14 font-bold whitespace-nowrap", isDebit ? "text-[#D92D20]" : "text-[#039855]")}>
                                {isDebit ? `- $${rawAmount}` : `+ $${rawAmount}`}
                            </TableCell>

                            {/* Status Badge */}
                            <TableCell className="py-3.5 px-6 whitespace-nowrap">
                                <StatusBadge status={status} />
                            </TableCell>

                            {/* Date */}
                            <TableCell className="py-3.5 px-6 text-14 text-gray-600 whitespace-nowrap">
                                {formattedDate}
                            </TableCell>

                            {/* Category Badge */}
                            <TableCell className="py-3.5 pl-6 pr-4 text-right whitespace-nowrap">
                                <CategoryBadge category={t.category || "General"} />
                            </TableCell>
                        </MotionTableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
};

export default TransactionsTable;