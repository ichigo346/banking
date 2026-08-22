import BankCard from '@/components/BankCard';
import HeaderBox from '@/components/HeaderBox'
import { getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';
import React from 'react'

export const dynamic = 'force-dynamic';

const MyBanks = async () => {
    const loggedIn = await getLoggedInUser();
    if (!loggedIn) redirect('/sign-in');

    const accounts = await getAccounts({ userId: loggedIn.$id });

    return (
        <section className='flex'>
            <div className="my-banks">
                <HeaderBox
                    title="Manage my Banks"
                    subtext="Effortlessly manage your linked bank accounts, view balances, and copy account details."
                />

                <div className="space-y-4">
                    <h2 className="header-2">
                        Your cards
                    </h2>
                    <div className="flex-wrap gap-6">
                        {accounts && accounts.data.map((a: Account) => (
                            <BankCard
                                key={a.id}
                                account={a}
                                userName={loggedIn?.firstName}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default MyBanks