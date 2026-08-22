"use client";

import React, { useState, useEffect } from "react";
import { formatAmount } from "@/lib/utils";
import { AlertTriangle, Check, Edit2, PieChart, TrendingUp } from "lucide-react";

interface CategoryBudgetWidgetProps {
    transactions?: Transaction[];
}

interface BudgetCategory {
    name: string;
    defaultLimit: number;
}

const DEFAULT_CATEGORIES: BudgetCategory[] = [
    { name: "Food and Drink", defaultLimit: 500 },
    { name: "Payment", defaultLimit: 800 },
    { name: "Travel", defaultLimit: 400 },
    { name: "Transfer", defaultLimit: 1200 },
    { name: "Shopping", defaultLimit: 300 },
];

const CategoryBudgetWidget = ({ transactions = [] }: CategoryBudgetWidgetProps) => {
    const [budgets, setBudgets] = useState<Record<string, number>>({});
    const [editingCategory, setEditingCategory] = useState<string | null>(null);
    const [tempLimit, setTempLimit] = useState<string>("");

    // Load initial budget limits from localStorage or defaults
    useEffect(() => {
        const saved = localStorage.getItem("horizon_category_budgets");
        if (saved) {
            try {
                setBudgets(JSON.parse(saved));
                return;
            } catch (e) {
                console.error("Failed to parse saved category budgets", e);
            }
        }
        const initial: Record<string, number> = {};
        DEFAULT_CATEGORIES.forEach((c) => {
            initial[c.name] = c.defaultLimit;
        });
        setBudgets(initial);
    }, []);

    // Save budget updates to localStorage
    const saveBudget = (categoryName: string, newLimit: number) => {
        const updated = { ...budgets, [categoryName]: newLimit };
        setBudgets(updated);
        localStorage.setItem("horizon_category_budgets", JSON.stringify(updated));
        setEditingCategory(null);
    };

    // Calculate spent amount per category from transactions
    const calculateSpent = (categoryName: string): number => {
        if (!transactions || transactions.length === 0) return 0;
        return transactions
            .filter((t) => t.category?.toLowerCase() === categoryName.toLowerCase() || (categoryName === "Payment" && t.type === "debit"))
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    };

    const handleStartEdit = (categoryName: string, currentLimit: number) => {
        setEditingCategory(categoryName);
        setTempLimit(currentLimit.toString());
    };

    const handleSaveEdit = (categoryName: string) => {
        const parsed = parseFloat(tempLimit);
        if (!isNaN(parsed) && parsed > 0) {
            saveBudget(categoryName, parsed);
        } else {
            setEditingCategory(null);
        }
    };

    return (
        <section className="flex w-full flex-col gap-5 rounded-xl border border-gray-200 bg-white p-6 shadow-chart">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-blue-25 text-bankGradient">
                        <PieChart className="size-5" />
                    </div>
                    <div>
                        <h2 className="text-18 font-semibold text-gray-900">Category Budgets & Analytics</h2>
                        <p className="text-14 text-gray-600">Track monthly spending limits and threshold alerts</p>
                    </div>
                </div>
            </div>

            <div className="space-y-5">
                {DEFAULT_CATEGORIES.map((cat) => {
                    const limit = budgets[cat.name] || cat.defaultLimit;
                    const spent = calculateSpent(cat.name);
                    const percentage = Math.min(Math.round((spent / limit) * 100), 100);
                    const rawPercentage = Math.round((spent / limit) * 100);
                    const isOver = spent > limit;
                    const isNear = !isOver && rawPercentage >= 80;
                    const isEditing = editingCategory === cat.name;

                    return (
                        <div key={cat.name} className="flex flex-col gap-2 rounded-lg border border-gray-100 bg-gray-25/50 p-4 transition-colors hover:bg-gray-25">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-14 font-semibold text-gray-900">{cat.name}</span>
                                    {isOver && (
                                        <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-10 font-medium text-red-700">
                                            <AlertTriangle className="size-3" /> Over Limit
                                        </span>
                                    )}
                                    {isNear && (
                                        <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-10 font-medium text-amber-700">
                                            <TrendingUp className="size-3" /> Near Limit
                                        </span>
                                    )}
                                </div>

                                {/* Budget Limit Display & Inline Editing */}
                                <div className="flex items-center gap-2">
                                    <span className="text-14 text-gray-600">
                                        {formatAmount(spent)} /
                                    </span>
                                    {isEditing ? (
                                        <div className="flex items-center gap-1">
                                            <span className="text-14 font-semibold text-gray-900">$</span>
                                            <input
                                                type="number"
                                                value={tempLimit}
                                                onChange={(e) => setTempLimit(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") handleSaveEdit(cat.name);
                                                    if (e.key === "Escape") setEditingCategory(null);
                                                }}
                                                className="w-20 rounded border border-bankGradient px-2 py-0.5 text-14 font-semibold text-gray-900 outline-none"
                                                autoFocus
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleSaveEdit(cat.name)}
                                                className="rounded p-1 text-success-600 hover:bg-success-50"
                                            >
                                                <Check className="size-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => handleStartEdit(cat.name, limit)}
                                            className="group flex items-center gap-1 rounded px-1.5 py-0.5 hover:bg-gray-200/50"
                                            title="Click to edit budget limit"
                                        >
                                            <span className="font-ibm-plex-serif text-14 font-bold text-gray-900">
                                                {formatAmount(limit)}
                                            </span>
                                            <Edit2 className="size-3.5 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Progress Bar & Percentage */}
                            <div className="flex items-center gap-3">
                                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                                    <div
                                        className={`h-full transition-all duration-300 rounded-full ${
                                            isOver ? "bg-red-500" : isNear ? "bg-amber-500" : "bg-bankGradient"
                                        }`}
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <span className={`text-12 font-medium shrink-0 ${isOver ? "text-red-600" : isNear ? "text-amber-600" : "text-gray-600"}`}>
                                    {rawPercentage}%
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default CategoryBudgetWidget;
