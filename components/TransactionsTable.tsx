import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { transactionCategoryStyles } from "@/constants"
import { cn, formatAmount, formatDateTime, getTransactionStatus, removeSpecialCharacters } from "@/lib/utils"
import { ReceiptText } from "lucide-react"

const CategoryBadge = ({ category }: CategoryBadgeProps) => {
    const {
        borderColor,
        backgroundColor,
        textColor,
        chipBackgroundColor,
    } = transactionCategoryStyles[category as keyof typeof transactionCategoryStyles] ||
        transactionCategoryStyles.default

    return (
        <div className={cn('category-badge', borderColor, chipBackgroundColor)}>
            <div className={cn('size-2 rounded-full', backgroundColor)} />
            <p className={cn('text-[12px] font-medium', textColor)}>{category}</p>
        </div>
    )
}

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
        )
    }

    return (
        <Table>
            <TableHeader className="bg-[#f9fafb]">
                <TableRow>
                    <TableHead className="px-2">Transaction</TableHead>
                    <TableHead className="px-2">Amount</TableHead>
                    <TableHead className="px-2">Status</TableHead>
                    <TableHead className="px-2">Date</TableHead>
                    <TableHead className="px-2 max-md:hidden">Channel</TableHead>
                    <TableHead className="px-2 max-md:hidden">Category</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {transactions.map((t: Transaction) => {
                    const status = getTransactionStatus(new Date(t.date))
                    const amount = formatAmount(t.amount)

                    const isDebit = t.type === 'debit';
                    const isCredit = t.type === 'credit';

                    return (
                        <TableRow key={t.id} className={`${isDebit || amount[0] == '-' ? 'bg-[#FFFBFA]' : 'bg-[#F6FEF9]'} !hover:bg-none !border-b-gray-100`}>
                            <TableCell className="max-w-[250px] pl-2 pr-10">
                                <div className="flex items-center gap-3">
                                    <h1 className="text-14 truncate font-semibold text-[#344054]">
                                        {removeSpecialCharacters(t.name)}
                                    </h1>
                                </div>
                            </TableCell>

                            <TableCell className={`pl-2 pr-10 font-semibold ${isDebit || amount[0] == '-' ?
                                'text-[#C11574]'
                                : 'text-[#039855]'
                                } `} >
                                {isDebit ? `-${amount}` : isCredit ? amount : amount}
                            </TableCell>

                            <TableCell className="pl-2 pr-10">
                                <CategoryBadge category={status} />
                            </TableCell>

                            <TableCell className="min-w-32 pl-2 pr-10 text-14 text-gray-600">
                                {formatDateTime(new Date(t.date)).dateTime}
                            </TableCell>

                            <TableCell className="pl-2 pr-10 capitalize min-w-24 text-14 text-gray-600">
                                {t.paymentChannel}
                            </TableCell>

                            <TableCell className="pl-2 pr-10 max-md:hidden">
                                <CategoryBadge category={t.category} />
                            </TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    )
}

export default TransactionsTable