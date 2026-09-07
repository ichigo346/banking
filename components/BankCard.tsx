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
                    isDark ? "bg-[#232F3E]" : "bg-bank-gradient"
                )}
            >
                {/* Left Content Area */}
                <div className="relative z-10 flex size-full max-w-[215px] flex-col justify-between p-5">
                    <div>
                        <h1 className="text-16 font-semibold text-white">
                            {account.name || 'JS Mastery Pro.'}
                        </h1>
                        {showBalance && (
                            <p className="font-ibm-plex-serif font-black text-white">
                                {formatAmount(account.currentBalance)}
                            </p>
                        )}
                    </div>

                    <article className="flex flex-col gap-2">
                        <div className="flex items-center gap-6">
                            <h1 className="text-11 font-semibold text-white/90 uppercase tracking-wider">
                                {userName}
                            </h1>
                            <h2 className="text-11 font-semibold text-white/90">
                                06/24
                            </h2>
                        </div>
                        <p className="text-13 font-semibold tracking-[2px] text-white">
                            1234 1234 1234 <span className="text-13">{account?.mask || '1234'}</span>
                        </p>
                    </article>
                </div>

                {/* Right Hologram / Brand Area */}
                <div className={cn(
                    "relative z-10 flex size-full flex-1 flex-col items-end justify-between p-4",
                    isDark
                        ? "bg-gradient-to-b from-[#B8A4E3] via-[#F4B4D7] to-[#FCA5A5]"
                        : "bg-transparent"
                )}>
                    <div className="flex justify-end pr-1 pt-1">
                        <Image
                            src="/icons/Paypass.svg"
                            width={18}
                            height={22}
                            alt="pay"
                            className={cn(isDark ? "brightness-200" : "")}
                        />
                    </div>
                    
                    <div className="flex justify-end pr-1 pb-1">
                        {isDark ? (
                            <Image
                                src="/icons/visa.svg"
                                width={48}
                                height={24}
                                alt="visa"
                                className="brightness-0 invert"
                            />
                        ) : (
                            <Image
                                src="/icons/mastercard.svg"
                                width={42}
                                height={30}
                                alt="mastercard"
                            />
                        )}
                    </div>
                </div>

                {/* Subtle wave lines overlay */}
                <Image
                    src="/icons/lines.png"
                    width={316}
                    height={190}
                    alt="lines"
                    className="absolute top-0 left-0 rounded-[20px] object-cover pointer-events-none size-full opacity-40 mix-blend-overlay"
                />
            </Link>

            {showBalance && <Copy title={account?.sharebleId} />}
        </motion.div>
    )
}
export default BankCard