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
            <span className={cn("size-2 rounded-full", style.dot)} />
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
            <span className={cn("size-2 rounded-full", style.dot)} />
            <span>{status}</span>
        </div>
    );
};

// Generates initials or logo circle for transaction row
const TransactionAvatar = ({ name }: { name: string }) => {
    const cleanName = removeSpecialCharacters(name).trim();
    const words = cleanName.split(" ").filter(Boolean);
    const initials = words.length >= 2
        ? `${words[0][0]}${words[1][0]}`.toUpperCase()
        : cleanName.slice(0, 2).toUpperCase();

    // Brand specific background colors
    let bgStyle = "bg-gray-100 text-gray-700";
    const lowerName = cleanName.toLowerCase();
    if (lowerName.includes("spotify")) bgStyle = "bg-[#1DB954] text-white";
    else if (lowerName.includes("figma")) bgStyle = "bg-black text-white";
    else if (lowerName.includes("alexa")) bgStyle = "bg-emerald-100 text-emerald-800";
    else if (lowerName.includes("sam")) bgStyle = "bg-amber-100 text-amber-800";

    return (
        <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-full text-14 font-bold shadow-xs", bgStyle)}>
            {initials}
        </div>
    );
};

const TransactionsTable = ({ transactions = [] }: TransactionTableProps) => {
    if (!transactions || transactions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-25/50 p-12 text-center">
                <div className="flex size-12 items-center justify-center rounded-full bg-blue-25 text-bankGradient">
                    <ReceiptText className="size-6" />
                </div>
                <h3 className="mt-4 text-16 font-semibold text-gray-900">No transactions found</h3>
                <p className="mt-1 text-14 text-gray-500 max-w-sm">
                    There are no transactions recorded for this account yet. Transferred or synced funds will appear here.
                </p>
            </div>
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
                {transactions.map((t: Transaction) => {
                    const status = getTransactionStatus(new Date(t.date));
                    const rawAmount = Math.abs(Number(t.amount) || 0).toFixed(2);

                    const isDebit = t.type === 'debit' || Number(t.amount) < 0;
                    const isCredit = t.type === 'credit' || Number(t.amount) > 0;

                    const dateObj = new Date(t.date);
                    const formattedDate = dateObj.toLocaleDateString("en-US", {
                        weekday: "short",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                    });

                    return (
                        <TableRow
                            key={t.id}
                            className={cn(
                                "border-b border-gray-100 transition-colors hover:bg-gray-50/80",
                                isCredit ? "bg-[#F6FEF9]/60" : "bg-white"
                            )}
                        >
                            {/* Transaction Name & Avatar */}
                            <TableCell className="py-4 pl-4 pr-6">
                                <div className="flex items-center gap-3">
                                    <TransactionAvatar name={t.name} />
                                    <h1 className="text-14 truncate font-semibold text-gray-900">
                                        {removeSpecialCharacters(t.name)}
                                    </h1>
                                </div>
                            </TableCell>

                            {/* Formatted Amount */}
                            <TableCell className={cn("py-4 px-6 text-14 font-bold whitespace-nowrap", isDebit ? "text-[#D92D20]" : "text-[#039855]")}>
                                {isDebit ? `- $${rawAmount}` : `+ $${rawAmount}`}
                            </TableCell>

                            {/* Status Badge */}
                            <TableCell className="py-4 px-6 whitespace-nowrap">
                                <StatusBadge status={status} />
                            </TableCell>

                            {/* Date */}
                            <TableCell className="py-4 px-6 text-14 text-gray-600 whitespace-nowrap">
                                {formattedDate}
                            </TableCell>

                            {/* Category Badge */}
                            <TableCell className="py-4 pl-6 pr-4 text-right whitespace-nowrap">
                                <CategoryBadge category={t.category || "General"} />
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
};

export default TransactionsTable;