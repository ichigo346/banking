import HeaderBox from '@/components/HeaderBox';
import RecentTransactions from '@/components/RecentTransactions';
import RightSidebar from '@/components/RightSidebar';
import TotalBalanceBox from '@/components/TotalBalanceBox';
import { getAccount, getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

const defaultMockAccounts: Account[] = [
    {
        id: 'acc_chase_1',
        name: 'Chase Bank',
        currentBalance: 2588.12,
        availableBalance: 2588.12,
        officialName: 'Chase Bank Premier Savings',
        mask: '1234',
        institutionId: 'ins_chase',
        type: 'depository',
        subtype: 'savings',
        appwriteItemId: 'acc_chase_1',
        sharebleId: 'acc_chase_1',
        sharableId: 'acc_chase_1',
    },
    {
        id: 'acc_boa_2',
        name: 'Bank of America',
        currentBalance: 110.00,
        availableBalance: 110.00,
        officialName: 'Bank of America Advantage Checking',
        mask: '5678',
        institutionId: 'ins_boa',
        type: 'depository',
        subtype: 'checking',
        appwriteItemId: 'acc_boa_2',
        sharebleId: 'acc_boa_2',
        sharableId: 'acc_boa_2',
    },
    {
        id: 'acc_platypus_3',
        name: 'First Platypus Bank',
        currentBalance: 0.00,
        availableBalance: 0.00,
        officialName: 'First Platypus Bank Checking',
        mask: '9012',
        institutionId: 'ins_platypus',
        type: 'depository',
        subtype: 'checking',
        appwriteItemId: 'acc_platypus_3',
        sharebleId: 'acc_platypus_3',
        sharableId: 'acc_platypus_3',
    }
];

const defaultMockTransactions: Transaction[] = [
    {
        id: 'tx_1',
        $id: 'tx_1',
        name: 'Spotify',
        paymentChannel: 'in store',
        type: 'debit',
        accountId: 'acc_chase_1',
        amount: 15.00,
        pending: true,
        category: 'Subscriptions',
        date: '2026-09-02T13:00:00.000Z',
        image: '/icons/spotify.svg',
        $createdAt: '2026-09-02T13:00:00.000Z',
        channel: 'online',
        senderBankId: 'acc_chase_1',
        receiverBankId: 'spotify',
    },
    {
        id: 'tx_2',
        $id: 'tx_2',
        name: 'Alexa Doe',
        paymentChannel: 'other',
        type: 'credit',
        accountId: 'acc_chase_1',
        amount: 88.00,
        pending: false,
        category: 'Deposit',
        date: '2026-09-02T02:45:00.000Z',
        image: '',
        $createdAt: '2026-09-02T02:45:00.000Z',
        channel: 'transfer',
        senderBankId: 'alexa',
        receiverBankId: 'acc_chase_1',
    },
    {
        id: 'tx_3',
        $id: 'tx_3',
        name: 'Figma',
        paymentChannel: 'online',
        type: 'debit',
        accountId: 'acc_chase_1',
        amount: 18.99,
        pending: true,
        category: 'Income',
        date: '2026-09-01T18:10:00.000Z',
        image: '/icons/figma.svg',
        $createdAt: '2026-09-01T18:10:00.000Z',
        channel: 'online',
        senderBankId: 'acc_chase_1',
        receiverBankId: 'figma',
    },
    {
        id: 'tx_4',
        $id: 'tx_4',
        name: 'Fresh F&V',
        paymentChannel: 'in store',
        type: 'debit',
        accountId: 'acc_chase_1',
        amount: 88.00,
        pending: false,
        category: 'Groceries',
        date: '2026-09-01T12:15:00.000Z',
        image: '',
        $createdAt: '2026-09-01T12:15:00.000Z',
        channel: 'in_store',
        senderBankId: 'acc_chase_1',
        receiverBankId: 'fresh_fv',
    },
    {
        id: 'tx_5',
        $id: 'tx_5',
        name: 'Sam Sulek',
        paymentChannel: 'in store',
        type: 'debit',
        accountId: 'acc_chase_1',
        amount: 40.20,
        pending: false,
        category: 'Food',
        date: '2026-09-01T05:40:00.000Z',
        image: '',
        $createdAt: '2026-09-01T05:40:00.000Z',
        channel: 'declined',
        senderBankId: 'acc_chase_1',
        receiverBankId: 'sam_sulek',
    }
];

const Home = async ({ searchParams }: SearchParamProps) => {
    const { id, page } = await searchParams;
    const currentPage = Number(page as string) || 1;
    const loggedIn = await getLoggedInUser();
    if (!loggedIn) redirect('/sign-in');

    const accounts = await getAccounts({ userId: loggedIn.$id });

    const realAccounts = accounts?.data && accounts.data.length > 0 ? accounts.data : defaultMockAccounts;
    const totalBanks = accounts?.totalBanks || realAccounts.length;
    const totalCurrentBalance = accounts?.totalCurrentBalance || realAccounts.reduce((sum: number, acc: Account) => sum + (acc.currentBalance || 0), 0);

    const appwriteItemId = (id as string) || realAccounts[0]?.appwriteItemId;
    const account = appwriteItemId && accounts?.data ? await getAccount({ appwriteItemId }) : null;

    const displayTransactions = account?.transactions && account.transactions.length > 0
        ? account.transactions
        : defaultMockTransactions;

    return (
        <section className="home">
            <div className="home-content">
                <header className="home-header">
                    <HeaderBox
                        type="greeting"
                        title="Welcome,"
                        user={loggedIn?.firstName || 'Adrian'}
                        subtext="Access & manage your account and transactions efficiently."
                    />

                    <TotalBalanceBox
                        accounts={realAccounts}
                        totalBanks={totalBanks}
                        totalCurrentBalance={totalCurrentBalance}
                    />
                </header>

                <RecentTransactions
                    accounts={realAccounts}
                    transactions={displayTransactions}
                    appwriteItemId={appwriteItemId}
                    page={currentPage}
                />
            </div>

            <RightSidebar
                user={loggedIn}
                transactions={displayTransactions}
                banks={realAccounts.slice(0, 2)}
            />
        </section>
    );
};

export default Home;