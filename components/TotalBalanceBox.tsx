import AnimatedCounter from './AnimatedCounter';
import DoughnutChart from './DoughnutChart';
import Link from 'next/link';

const TotalBalanceBox = ({
    accounts = [], totalBanks = 2, totalCurrentBalance = 2698.12 }: TotlaBalanceBoxProps) => {
    return (
        <section className="total-balance">
            <div className="total-balance-chart">
                <DoughnutChart accounts={accounts} />
            </div>

            <div className="flex flex-1 flex-col gap-6">
                <div className="flex w-full items-center justify-between">
                    <h2 className="header-2">
                        {totalBanks} {totalBanks === 1 ? 'Bank Account' : 'Bank Accounts'}
                    </h2>
                    <Link href="/my-banks" className="flex items-center gap-1 text-14 font-semibold text-[#0179FE] hover:opacity-80 transition-opacity">
                        <span className="text-16 font-bold leading-none">+</span>
                        <span>Add bank</span>
                    </Link>
                </div>

                <div className="flex flex-col gap-2">
                    <p className="total-balance-label">
                        Total Current Balance
                    </p>

                    <div className="total-balance-amount flex items-center gap-2">
                        <AnimatedCounter amount={totalCurrentBalance} />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default TotalBalanceBox