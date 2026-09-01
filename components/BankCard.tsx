"use client";

import { formatAmount } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Copy from './Copy'
import { motion } from 'framer-motion'

const BankCard = ({ account, userName, showBalance }: CreditCardProps) => {
    return (
        <motion.div
            className="flex flex-col"
            whileHover={{ y: -4, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
            <Link href={`/transaction-history/?id=${account?.appwriteItemId}`} className="bank-card shadow-creditCard">
                <div className="bank-card_content">
                    <div>
                        <h1 className="text-16 font-semibold text-white">
                            {account.name}
                        </h1>
                        <p className="font-ibm-plex-serif font-black text-white">
                            {formatAmount(account.currentBalance)}
                        </p>
                    </div>

                    <article className="flex flex-col gap-2">
                        <div className='flex justify-between'>
                            <h1 className='text-12 font-semibold text-white'>
                                {userName}
                            </h1>
                            <h2 className='text-12 font-semibold text-white'>
                                ●● / ●●
                            </h2>
                        </div>
                        <p className="text-14 font-semibold tracking-[1px] text-white">
                            ●●●● ●●●● ●●●● <span className="text-16">{account?.mask}</span>
                        </p>
                    </article>
                </div>

                <div className='bank-card_icon'>
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
                    className="absolute top-0 left-0 rounded-[20px] object-cover pointer-events-none size-full"
                />
            </Link>

            {showBalance && <Copy title={account?.sharebleId} />}
        </motion.div>
    )
}
export default BankCard