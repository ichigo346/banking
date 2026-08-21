import HeaderBox from '@/components/HeaderBox'
import PaymentTransferForm from '@/components/PaymentTransferForm';
import { getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';
import React from 'react'

export const dynamic = 'force-dynamic';

const Transfer = async () => {
    const loggedIn = await getLoggedInUser();
    if (!loggedIn) redirect('/sign-in');

    const accounts = await getAccounts({ userId: loggedIn.$id });
    if (!accounts) return;

    const accountsData = accounts?.data;
    return (
        <section className="payment-transfer">
            <HeaderBox
                title='Payment Transfer'
                subtext="Please provide any specificdetails or notes related to the payment transfer"
            />

            <section className="size-ful pt-5">
                <PaymentTransferForm accounts={accountsData} />
            </section>
        </section>
    )
}

export default Transfer