"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Home, CreditCard, ArrowRightLeft, History, LogOut, PlusCircle, Command, X } from "lucide-react";
import { logoutAccount } from "@/lib/actions/user.actions";

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
}

const CommandPalette = ({ isOpen, onClose }: CommandPaletteProps) => {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const commands = [
        {
            category: "Navigation",
            id: "nav-home",
            title: "Home Dashboard",
            description: "View account overview and balance",
            icon: Home,
            action: () => router.push("/"),
        },
        {
            category: "Navigation",
            id: "nav-banks",
            title: "My Banks",
            description: "Manage connected bank cards and accounts",
            icon: CreditCard,
            action: () => router.push("/my-banks"),
        },
        {
            category: "Navigation",
            id: "nav-transfer",
            title: "Payment Transfer",
            description: "Send funds via Dwolla ACH",
            icon: ArrowRightLeft,
            action: () => router.push("/payment-transfer"),
        },
        {
            category: "Navigation",
            id: "nav-history",
            title: "Transaction History",
            description: "View and filter past transactions",
            icon: History,
            action: () => router.push("/transaction-history"),
        },
        {
            category: "Quick Actions",
            id: "action-transfer",
            title: "New Transfer",
            description: "Initiate a money transfer immediately",
            icon: PlusCircle,
            action: () => router.push("/payment-transfer"),
        },
        {
            category: "Account",
            id: "action-logout",
            title: "Sign Out",
            description: "Log out of your Horizon session",
            icon: LogOut,
            action: async () => {
                await logoutAccount();
                router.push("/sign-in");
            },
        },
    ];

    const filteredCommands = commands.filter(
        (cmd) =>
            cmd.title.toLowerCase().includes(query.toLowerCase()) ||
            cmd.description.toLowerCase().includes(query.toLowerCase()) ||
            cmd.category.toLowerCase().includes(query.toLowerCase())
    );

    useEffect(() => {
        if (isOpen) {
            setQuery("");
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelectedIndex((prev) => (prev + 1) % (filteredCommands.length || 1));
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % (filteredCommands.length || 1));
            } else if (e.key === "Enter") {
                e.preventDefault();
                if (filteredCommands[selectedIndex]) {
                    filteredCommands[selectedIndex].action();
                    onClose();
                }
            } else if (e.key === "Escape") {
                e.preventDefault();
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, selectedIndex, filteredCommands, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-150">
            <div className="w-full max-w-xl rounded-xl border border-gray-200 bg-white shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
                {/* Search Bar Header */}
                <div className="flex items-center border-b border-gray-200 px-4 py-3 bg-gray-25">
                    <Search className="size-5 text-gray-400 mr-3 shrink-0" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search commands or navigate... (Press Esc to close)"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full bg-transparent text-16 text-gray-900 placeholder:text-gray-400 outline-none"
                    />
                    <button
                        onClick={onClose}
                        className="rounded-md p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-700 ml-2"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                {/* Command Items List */}
                <div className="overflow-y-auto p-2 divide-y divide-gray-100">
                    {filteredCommands.length === 0 ? (
                        <div className="p-8 text-center text-14 text-gray-500">
                            No matching commands found.
                        </div>
                    ) : (
                        filteredCommands.map((cmd, idx) => {
                            const IconComponent = cmd.icon;
                            const isSelected = idx === selectedIndex;

                            return (
                                <div
                                    key={cmd.id}
                                    onClick={() => {
                                        cmd.action();
                                        onClose();
                                    }}
                                    onMouseEnter={() => setSelectedIndex(idx)}
                                    className={`flex items-center justify-between rounded-lg px-4 py-3 cursor-pointer transition-colors ${
                                        isSelected ? "bg-bankGradient/10 text-bankGradient font-medium" : "hover:bg-gray-50 text-gray-700"
                                    }`}
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div
                                            className={`flex size-9 items-center justify-center rounded-lg ${
                                                isSelected ? "bg-bank-gradient text-white" : "bg-gray-100 text-gray-600"
                                            }`}
                                        >
                                            <IconComponent className="size-5 shrink-0" />
                                        </div>
                                        <div className="truncate">
                                            <p className="text-14 font-semibold text-gray-900 truncate">{cmd.title}</p>
                                            <p className="text-12 text-gray-500 truncate">{cmd.description}</p>
                                        </div>
                                    </div>
                                    <span className="text-12 text-gray-400 uppercase tracking-wider font-semibold ml-3 shrink-0">
                                        {cmd.category}
                                    </span>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Keyboard Helper Footer */}
                <div className="flex items-center justify-between border-t border-gray-200 px-4 py-2 bg-gray-50 text-12 text-gray-500">
                    <div className="flex items-center gap-2">
                        <span className="rounded border border-gray-300 bg-white px-1.5 py-0.5 text-10 font-mono shadow-xs">↑↓</span>
                        <span>Navigate</span>
                        <span className="rounded border border-gray-300 bg-white px-1.5 py-0.5 text-10 font-mono shadow-xs ml-2">↵</span>
                        <span>Select</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="rounded border border-gray-300 bg-white px-1.5 py-0.5 text-10 font-mono shadow-xs">Esc</span>
                        <span>Close</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommandPalette;
