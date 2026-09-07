import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import BankCard from './BankCard'
import { countTransactionCategories } from '@/lib/utils'
import Category from './Category'
import { MoreVertical } from 'lucide-react'

const defaultCategories: CategoryCount[] = [
    { name: "Subscriptions", count: 25, totalCount: 100 },
    { name: "Food and booze", count: 120, totalCount: 200 },
    { name: "Savings", count: 50, totalCount: 100 },
];

const RightSidebar = ({ user, transactions, banks }: RightSidebarProps) => {
    const categories: CategoryCount[] = countTransactionCategories(transactions);
    const displayCategories = categories.length > 0 ? categories : defaultCategories;

    return (
        <aside className="right-sidebar">
            <section className="flex flex-col pb-8">
                <div className="profile-banner" />
                <div className="profile">
                    <div className="profile-img overflow-hidden bg-white">
                        <Image
                            src="/icons/jsm.svg"
                            width={72}
                            height={72}
                            alt="avatar"
                            className="size-full object-contain"
                        />
                    </div>

                    <div className="profile-details">
                        <h1 className='profile-name'>
                            {user?.firstName ? `${user.firstName} ${user.lastName}` : 'Adrian Hajdin'}
                        </h1>
                        <p className="profile-email">
                            {user?.email || 'adrian@jsmastery.pro'}
                        </p>
                    </div>
                </div>
            </section>

            <section className="banks">
                <div className="flex w-full justify-between">
                    <h2 className="header-2">My Banks</h2>
                    <Link href="/" className="flex gap-2 items-center">
                        <Image
                            src="/icons/plus.svg"
                            width={16}
                            height={16}
                            alt="plus"
                            style={{ width: 'auto', height: 'auto' }}
                        />
                        <h2 className="text-14 font-semibold text-gray-600">
                            Add Bank
                        </h2>
                    </Link>
                </div>

                {banks && banks.length > 0 ? (
                    <div className="relative flex flex-1 flex-col items-center justify-center gap-5">
                        <div className='relative z-10 w-full flex justify-center'>
                            <BankCard
                                key={banks[0].$id || 'bank-1'}
                                account={banks[0]}
                                userName={`${user?.firstName || 'Adrian'} ${user?.lastName || 'Hajdin'}`}
                                showBalance={false}
                                cardTheme="dark"
                            />
                        </div>
                        {banks[1] ? (
                            <div className="absolute right-0 top-8 z-0 w-[90%]">
                                <BankCard
                                    key={banks[1].$id || 'bank-2'}
                                    account={banks[1]}
                                    userName={`${user?.firstName || 'Adrian'} ${user?.lastName || 'Hajdin'}`}
                                    showBalance={false}
                                    cardTheme="blue"
                                />
                            </div>
                        ) : (
                            <div className="absolute right-0 top-8 z-0 w-[90%]">
                                <BankCard
                                    key="bank-fallback-2"
                                    account={{
                                        id: 'fb-2',
                                        name: 'Chase Bank',
                                        currentBalance: 2588.12,
                                        mask: '1234',
                                        appwriteItemId: 'fb-2',
                                        sharebleId: 'fb-2',
                                        sharableId: 'fb-2',
                                        availableBalance: 2588.12,
                                        officialName: 'Chase Bank',
                                        institutionId: 'ins_1',
                                        type: 'depository',
                                        subtype: 'checking'
                                    }}
                                    userName={`${user?.firstName || 'Adrian'} ${user?.lastName || 'Hajdin'}`}
                                    showBalance={false}
                                    cardTheme="blue"
                                />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="relative flex flex-1 flex-col items-center justify-center gap-5">
                        <div className='relative z-10 w-full flex justify-center'>
                            <BankCard
                                key="mock-1"
                                account={{
                                    id: 'mock-1',
                                    name: 'JS Mastery Pro.',
                                    currentBalance: 2698.12,
                                    mask: '1234',
                                    appwriteItemId: 'mock-1',
                                    sharebleId: 'mock-1',
                                    sharableId: 'mock-1',
                                    availableBalance: 2698.12,
                                    officialName: 'JS Mastery Pro.',
                                    institutionId: 'ins_mock',
                                    type: 'depository',
                                    subtype: 'savings'
                                }}
                                userName={`${user?.firstName || 'Adrian'} ${user?.lastName || 'Hajdin'}`}
                                showBalance={false}
                                cardTheme="dark"
                            />
                        </div>
                        <div className="absolute right-0 top-8 z-0 w-[90%]">
                            <BankCard
                                key="mock-2"
                                account={{
                                    id: 'mock-2',
                                    name: 'Chase Bank',
                                    currentBalance: 2588.12,
                                    mask: '1234',
                                    appwriteItemId: 'mock-2',
                                    sharebleId: 'mock-2',
                                    sharableId: 'mock-2',
                                    availableBalance: 2588.12,
                                    officialName: 'Chase Bank',
                                    institutionId: 'ins_mock2',
                                    type: 'depository',
                                    subtype: 'checking'
                                }}
                                userName={`${user?.firstName || 'Adrian'} ${user?.lastName || 'Hajdin'}`}
                                showBalance={false}
                                cardTheme="blue"
                            />
                        </div>
                    </div>
                )}

                <div className="mt-8 flex flex-1 flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-16 font-bold text-gray-900">My budgets</h2>
                        <button type="button" className="text-gray-400 hover:text-gray-600 p-1">
                            <MoreVertical className="size-4" />
                        </button>
                    </div>
                    <div className='flex flex-col gap-3'>
                        {displayCategories.slice(0, 3).map((category) => (
                            <Category key={category.name} category={category} />
                        ))}
                    </div>
                </div>
            </section>
        </aside>
    )
}

export default RightSidebar
