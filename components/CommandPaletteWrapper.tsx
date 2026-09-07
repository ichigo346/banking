"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
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
            className="flex items-center gap-2.5 w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-14 text-gray-400 hover:border-gray-300 hover:text-gray-600 transition-colors shadow-xs"
        >
            <Image
                src="/icons/search.svg"
                width={16}
                height={16}
                alt="search"
                className="size-4 shrink-0 opacity-60"
            />
            <span className="text-14 font-normal text-gray-500">Search</span>
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
