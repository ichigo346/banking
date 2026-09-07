import Image from "next/image";

import { topCategoryStyles } from "@/constants";
import { cn } from "@/lib/utils";

import { Progress } from "./ui/progress";

const Category = ({ category }: CategoryProps) => {
    const style = topCategoryStyles[category.name as keyof typeof topCategoryStyles] ||
        topCategoryStyles.default;

    const {
        bg,
        circleBg,
        text: { main, count },
        progress: { bg: progressBg, indicator },
        icon,
    } = style;

    // Check if category has a custom formatted label or numeric count
    let displayAmount = "";
    let progressVal = 70;

    if (category.name === "Subscriptions") {
        displayAmount = "$25 left";
        progressVal = 75;
    } else if (category.name === "Food and booze") {
        displayAmount = "$120 left";
        progressVal = 90;
    } else if (category.name === "Savings") {
        displayAmount = "$50 left";
        progressVal = 85;
    } else {
        displayAmount = `${category.count} transactions`;
        progressVal = category.totalCount > 0 ? (category.count / category.totalCount) * 100 : 50;
    }

    return (
        <div className={cn("flex flex-col gap-3 rounded-2xl p-4 transition-all shadow-xs", bg)}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <figure className={cn("flex size-9 shrink-0 items-center justify-center rounded-full", circleBg)}>
                        <Image src={icon} width={18} height={18} alt={category.name} />
                    </figure>
                    <h2 className={cn("text-14 font-semibold text-gray-900", main)}>
                        {category.name}
                    </h2>
                </div>
                <h3 className={cn("text-14 font-semibold", count)}>
                    {displayAmount}
                </h3>
            </div>

            <div className={cn("h-1.5 w-full rounded-full overflow-hidden", progressBg)}>
                <div
                    className={cn("h-full rounded-full transition-all duration-500", indicator)}
                    style={{ width: `${progressVal}%` }}
                />
            </div>
        </div>
    );
};

export default Category;