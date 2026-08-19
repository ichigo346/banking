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
            <header className="flex items-center justify-between ">
                <h2 className='recent-transactions-title'>
                    Recent Transactions
                </h2>
                <Link href={`/transaction-history/?id=${appwriteItemId}`} className="view-all-btn">
                    View all
                </Link>
            </header>

            <Tabs defaultValue={appwriteItemId} className="w-full">
                <TabsList className="reccent-transanctions-tablist">
                    {accounts.map((account: Account) => (
                        <TabsTrigger key={account.id} value={account.appwriteItemId}>
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