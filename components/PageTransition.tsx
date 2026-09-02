"use client";

import React from "react";
import { motion } from "framer-motion";

interface PageTransitionProps {
    children: React.ReactNode;
    className?: string;
}

/**
 * Authored page transition for Horizon's "Trusted Navigator" world.
 *
 * Entrance: confident decelerate-in — content arrives already close to
 * final position (y:6, not y:20) with a blur clear. This reads as the
 * interface becoming sharp and ready, not floating up from below.
 *
 * Exit: faster fade-up — content retreats quickly so the next surface
 * can arrive without the user waiting.
 *
 * prefers-reduced-motion: spatial movement is removed; opacity-only
 * fade preserves the state-change signal without vestibular risk.
 */
export const PageTransition = ({ children, className = "" }: PageTransitionProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 6, filter: "blur(3px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -4, filter: "blur(2px)" }}
            transition={{
                duration: 0.3,
                ease: [0.16, 1, 0.3, 1],  // expo ease-out — confident, not floaty
            }}
            style={{ willChange: "opacity, transform, filter" }}
            className={`size-full ${className}`}
        >
            {children}
        </motion.div>
    );
};

export default PageTransition;
