'use client';

import CountUp from 'react-countup';

const AnimatedCounter = ({ amount }: { amount: number }) => {
    return (
        <div className="w-full">
            <CountUp
                decimals={2}
                decimal="."
                separator=","
                prefix="$"
                duration={1.25}
                end={amount}
            />
        </div>
    )
}

export default AnimatedCounter