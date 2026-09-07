import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BankTabItem } from './BankTabItem'
import BankInfo from './BankInfo'
import TransactionsTable from './TransactionsTable'
import { Pagination } from './Pagination'

const RecentTransactions = ({
    accounts,
    transactions = [],
    appwriteItemId,
    page = 1
}: RecentTransactionsProps) => {
    const rowsPerpage = 10;
    const totalPages = Math.ceil(transactions.length / rowsPerpage);

    const indexOfLastTransaction = page * rowsPerpage;
    const indexOfFirstTransaction = indexOfLastTransaction - rowsPerpage;

    const currentTransactions = transactions
        .slice(indexOfFirstTransaction, indexOfLastTransaction);

    return (
        <section className="recent-transactions">
            <header className="flex items-center justify-between">
                <h2 className="text-20 md:text-24 font-bold text-gray-900">
                    Recent transactions
                </h2>
                <Link href={`/transaction-history/?id=${appwriteItemId}`} className="text-14 rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                    View all
                </Link>
            </header>

            <Tabs defaultValue={appwriteItemId || accounts?.[0]?.appwriteItemId} className="w-full">
                <TabsList className="flex w-full justify-start gap-2 border-b border-gray-200 bg-transparent p-0 rounded-none">
                    {accounts.map((account: Account) => (
                        <TabsTrigger
                            key={account.id}
                            value={account.appwriteItemId}
                            className="p-0 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                        >
                            <BankTabItem
                                key={account.id}
                                account={account}
                                appwriteItemId={appwriteItemId}
                            />
                        </TabsTrigger>
                    ))}
                </TabsList>

                {accounts.map((account: Account) => (
                    <TabsContent
                        key={account.id}
                        value={account.appwriteItemId}
                        className="space-y-4"
                    >
                        <BankInfo
                            account={account}
                            appwriteItemId={appwriteItemId}
                            type="full"
                        />

                        <TransactionsTable transactions={currentTransactions} />


                        {totalPages > 1 && (
                            <div className="my-4-full">
                                <Pagination totalPages={totalPages} page={page} />
                            </div>
                        )}
                    </TabsContent>
                ))}
            </Tabs>
        </section>
    )
}

export default RecentTransactions