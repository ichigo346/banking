import HeaderBox from '@/components/HeaderBox'
import PaymentTransferForm from '@/components/PaymentTransferForm';
import { getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Building2 } from 'lucide-react';
import React from 'react'

export const dynamic = 'force-dynamic';

const Transfer = async () => {
    const loggedIn = await getLoggedInUser();
    if (!loggedIn) redirect('/sign-in');

    const accounts = await getAccounts({ userId: loggedIn.$id });
    const accountsData = accounts?.data;

    return (
        <section className="payment-transfer">
            <HeaderBox
                title='Payment Transfer'
                subtext="Transfer funds securely between linked accounts or send money to another user."
            />

            <section className="size-full pt-5">
                {!accountsData || accountsData.length === 0 ? (
                    <div className="flex max-w-[850px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center shadow-sm">
                        <div className="flex size-14 items-center justify-center rounded-full bg-blue-25 text-bankGradient">
                            <Building2 className="size-7" />
                        </div>
                        <h3 className="mt-4 text-18 font-semibold text-gray-900">No linked bank accounts found</h3>
                        <p className="mt-1.5 max-w-md text-14 text-gray-600">
                            You need at least one connected bank account to send transfers. Link an account to get started.
                        </p>
                        <Link
                            href="/"
                            className="mt-6 inline-flex items-center justify-center rounded-lg bg-bank-gradient px-5 py-2.5 text-14 font-semibold text-white shadow-form hover:opacity-95 transition-opacity"
                        >
                            Return to Dashboard
                        </Link>
                    </div>
                ) : (
                    <PaymentTransferForm accounts={accountsData} />
                )}
            </section>
        </section>
    )
}

export default Transfer