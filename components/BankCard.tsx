"use client";

import { cn, formatAmount } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Copy from './Copy'
import { motion } from 'framer-motion'

const BankCard = ({ account, userName, showBalance, cardTheme = 'dark' }: CreditCardProps) => {
    const isDark = cardTheme === 'dark';

    return (
        <motion.div
            className="flex flex-col"
            whileHover={{ y: -4, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
            <Link
                href={`/transaction-history/?id=${account?.appwriteItemId}`}
                className={cn(
                    "relative flex h-[190px] w-full max-w-[320px] justify-between rounded-[20px] border border-white/20 shadow-creditCard backdrop-blur-[6px] overflow-hidden",
                    isDark ? "bg-[#222F3E]" : "bg-bank-gradient"
                )}
            >
                <div className={cn(
                    "relative z-10 flex size-full max-w-[228px] flex-col justify-between rounded-l-[20px] px-5 pb-4 pt-5",
                    isDark ? "bg-[#222F3E]" : "bg-bank-gradient"
                )}>
                    <div>
                        <h1 className="text-16 font-semibold text-white">
                            {account.name || 'JS Mastery Pro.'}
                        </h1>
                        <p className="font-ibm-plex-serif font-black text-white">
                            {formatAmount(account.currentBalance)}
                        </p>
                    </div>

                    <article className="flex flex-col gap-2">
                        <div className='flex justify-between'>
                            <h1 className='text-12 font-semibold text-white uppercase'>
                                {userName}
                            </h1>
                            <h2 className='text-12 font-semibold text-white'>
                                06/24
                            </h2>
                        </div>
                        <p className="text-14 font-semibold tracking-[1px] text-white">
                            1234 1234 1234 <span className="text-14">{account?.mask || '1234'}</span>
                        </p>
                    </article>
                </div>

                <div className={cn(
                    "flex size-full flex-1 flex-col items-end justify-between rounded-r-[20px] bg-cover bg-center bg-no-repeat py-5 pr-5",
                    isDark ? "bg-[#222F3E]" : "bg-bank-gradient"
                )}>
                    <Image
                        src="/icons/Paypass.svg"
                        width={20}
                        height={24}
                        alt='pay'
                    />
                    <Image
                        src="/icons/mastercard.svg"
                        width={45}
                        height={32}
                        alt="mastercard"
                        className="ml-5"
                    />
                </div>

                <Image
                    src="/icons/lines.png"
                    width={316}
                    height={190}
                    alt="lines"
                    className="absolute top-0 left-0 rounded-[20px] object-cover pointer-events-none size-full opacity-60"
                />
            </Link>

            {showBalance && <Copy title={account?.sharebleId} />}
        </motion.div>
    )
}
export default BankCard