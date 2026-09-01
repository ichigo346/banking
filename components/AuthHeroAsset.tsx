"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export const AuthHeroAsset = () => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="p-8"
        >
            <motion.div
                animate={{
                    y: [0, -8, 0],
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="drop-shadow-2xl"
            >
                <Image
                    src="/icons/auth-image.svg"
                    alt="Auth illustration"
                    width={500}
                    height={500}
                    priority
                    style={{ width: "auto", height: "auto" }}
                />
            </motion.div>
        </motion.div>
    );
};

export default AuthHeroAsset;
