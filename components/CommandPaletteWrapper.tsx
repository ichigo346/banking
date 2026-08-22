"use client";

import React, { useState, useEffect } from "react";
import CommandPalette from "./CommandPalette";
import { Command } from "lucide-react";

interface CommandPaletteWrapperProps {
    children: React.ReactNode;
}

export const CommandPaletteTrigger = ({ onClick }: { onClick: () => void }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex items-center justify-between w-full rounded-lg border border-gray-200 bg-gray-25 px-3 py-2 text-14 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors shadow-xs"
        >
            <div className="flex items-center gap-2">
                <Command className="size-4 text-bankGradient" />
                <span className="max-xl:hidden">Search actions...</span>
            </div>
            <kbd className="hidden max-xl:hidden xl:inline-flex items-center gap-0.5 rounded border border-gray-300 bg-white px-1.5 py-0.5 text-10 font-mono text-gray-400">
                ⌘K
            </kbd>
        </button>
    );
};

const CommandPaletteWrapper = ({ children }: CommandPaletteWrapperProps) => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                setIsOpen((prev) => !prev);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <>
            {children}
            <CommandPalette isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
};

export default CommandPaletteWrapper;
