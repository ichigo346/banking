"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, HelpCircle, Info, Loader2, ShieldCheck, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

import { createTransfer } from "@/lib/actions/dwolla.actions";
import { createTransaction } from "@/lib/actions/transaction.actions";
import { getBank, getBankByAccountId } from "@/lib/actions/user.actions";
import { decryptId, formatAmount } from "@/lib/utils";

import { BankDropdown } from "./BankDropdown";
import { Button } from "./ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

const formSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    name: z.string().max(100, "Transfer note must be under 100 characters").optional(),
    amount: z.string().refine(
        (val) => !isNaN(Number(val)) && Number(val) > 0,
        { message: "Amount must be a positive number (e.g. 25.00)" }
    ),
    senderBank: z.string().min(1, "Please select a valid source bank account"),
    sharableId: z.string().min(8, "Please enter a valid recipient account ID"),
});

type FormValues = z.infer<typeof formSchema>;

/** Inline tooltip */
const FieldHint = ({ text }: { text: string }) => (
    <span className="group relative inline-flex items-center ml-1.5 cursor-help">
        <HelpCircle className="size-3.5 text-gray-400 group-hover:text-bankGradient transition-colors duration-150" />
        <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-56 rounded-lg bg-gray-900 px-3 py-2 text-11 font-normal leading-4 text-white opacity-0 shadow-xl transition-opacity duration-150 group-hover:opacity-100 z-50">
            {text}
        </span>
    </span>
);

// ─── Motion variants ────────────────────────────────────────────────────────

/** Staggered field cascade — fields slide in from below, one after another */
const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.07,
            delayChildren: 0.05,
        },
    },
};

const fieldVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.32, ease: [0.16, 1, 0.3, 1] },
    },
};

/** Reduced-motion variant — only opacity, no spatial movement */
const fieldVariantsReduced = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.2 },
    },
};

/** Error banner shake — communicates rejection without a full re-render */
const errorShakeVariants = {
    hidden: { opacity: 0, x: 0 },
    visible: {
        opacity: 1,
        x: [0, -6, 6, -4, 4, -2, 2, 0],
        transition: { duration: 0.45, ease: "easeInOut" },
    },
    exit: { opacity: 0, transition: { duration: 0.15 } },
};

/** Step progress pip — gradient fill sweeps left-to-right */
const pipFillVariants = {
    unfilled: { scaleX: 0, originX: 0 },
    filled: {
        scaleX: 1,
        originX: 0,
        transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 },
    },
};

// ────────────────────────────────────────────────────────────────────────────

const PaymentTransferForm = ({ accounts }: PaymentTransferFormProps) => {
    const router = useRouter();
    const shouldReduceMotion = useReducedMotion();
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [pendingData, setPendingData] = useState<FormValues | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [errorKey, setErrorKey] = useState(0); // key-bump forces the shake to re-trigger

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            amount: "",
            senderBank: accounts?.[0]?.appwriteItemId || "",
            sharableId: "",
        },
    });

    const selectedSenderAccount = accounts?.find(
        (acc) => acc.appwriteItemId === form.watch("senderBank") || acc.id === form.watch("senderBank")
    );

    // Escape key listener to close modal safely
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && showConfirmation && !isLoading) {
                setShowConfirmation(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [showConfirmation, isLoading]);

    const handleInitiateTransfer = (data: FormValues) => {
        setErrorMessage(null);

        // Sanitize input
        const sanitizedData: FormValues = {
            ...data,
            email: data.email.trim(),
            sharableId: data.sharableId.trim(),
            name: data.name?.trim(),
            amount: data.amount.replace(/[$,]/g, "").trim(),
        };

        // Balance sufficiency check
        if (selectedSenderAccount && Number(sanitizedData.amount) > selectedSenderAccount.currentBalance) {
            setErrorMessage(
                `Transfer amount ($${Number(sanitizedData.amount).toFixed(2)}) exceeds available balance of ${formatAmount(selectedSenderAccount.currentBalance)}.`
            );
            setErrorKey((k) => k + 1);
            return;
        }

        setPendingData(sanitizedData);
        setShowConfirmation(true);
    };

    const handleConfirmTransfer = async () => {
        if (!pendingData || isLoading) return;
        setIsLoading(true);
        setErrorMessage(null);

        try {
            const receiverAccountId = decryptId(pendingData.sharableId);
            const receiverBank = await getBankByAccountId({ accountId: receiverAccountId });
            if (!receiverBank) throw new Error("Recipient account could not be found. Please check the Account ID.");

            const senderBank = await getBank({ documentId: pendingData.senderBank });
            if (!senderBank) throw new Error("Selected source bank account is invalid or unlinked.");

            const transferParams = {
                sourceFundingSourceUrl: senderBank.fundingSourceUrl,
                destinationFundingSourceUrl: receiverBank.fundingSourceUrl,
                amount: pendingData.amount,
            };

            const transfer = await createTransfer(transferParams);

            if (transfer) {
                const transaction = {
                    name: pendingData.name || "Payment Transfer",
                    amount: pendingData.amount,
                    senderId: senderBank.userId.$id,
                    senderBankId: senderBank.$id,
                    receiverId: receiverBank.userId.$id,
                    receiverBankId: receiverBank.$id,
                    email: pendingData.email,
                };
                const newTransaction = await createTransaction(transaction);
                if (newTransaction) {
                    form.reset();
                    setShowConfirmation(false);
                    router.push("/");
                }
            } else {
                throw new Error("Transfer processing failed. Please verify account balances and try again.");
            }
        } catch (error: any) {
            console.error("Submitting create transfer request failed: ", error);
            setErrorMessage(error?.message || "An unexpected error occurred while processing the transfer.");
            setErrorKey((k) => k + 1); // re-trigger shake on each new error
            setShowConfirmation(false);
        } finally {
            setIsLoading(false);
        }
    };

    const activeFieldVariants = shouldReduceMotion ? fieldVariantsReduced : fieldVariants;

    return (
        <>
            {/* ── Step progress indicator ─────────────────────────────── */}
            <motion.div
                className="mb-6 flex items-center gap-3 max-w-[850px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
            >
                <div className="flex items-center gap-2">
                    <motion.span
                        className="flex size-6 items-center justify-center rounded-full bg-bank-gradient text-11 font-semibold text-white"
                        animate={showConfirmation
                            ? { scale: [1, 0.85, 1], opacity: 0.7 }
                            : { scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        {showConfirmation ? <CheckCircle2 className="size-4" /> : "1"}
                    </motion.span>
                    <span className={`text-13 font-medium transition-colors duration-200 ${showConfirmation ? "text-gray-400" : "text-gray-700"}`}>
                        Fill Details
                    </span>
                </div>

                {/* Animated connector line */}
                <div className="relative h-px flex-1 bg-gray-200 overflow-hidden">
                    <motion.div
                        className="absolute inset-y-0 left-0 right-0 bg-bank-gradient"
                        variants={pipFillVariants}
                        animate={showConfirmation ? "filled" : "unfilled"}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <motion.span
                        className={`flex size-6 items-center justify-center rounded-full text-11 font-semibold transition-colors duration-300 ${showConfirmation ? "bg-bank-gradient text-white" : "border border-gray-300 text-gray-400"}`}
                        animate={showConfirmation ? { scale: [0.8, 1.1, 1] } : { scale: 1 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    >
                        2
                    </motion.span>
                    <span className={`text-13 font-medium transition-colors duration-200 ${showConfirmation ? "text-gray-700" : "text-gray-400"}`}>
                        Confirm &amp; Send
                    </span>
                </div>
            </motion.div>

            {/* ── Form ────────────────────────────────────────────────── */}
            <Form {...form}>
                <motion.form
                    onSubmit={form.handleSubmit(handleInitiateTransfer)}
                    className="flex flex-col"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* 1. Source Bank */}
                    <motion.div variants={activeFieldVariants}>
                        <FormField
                            control={form.control}
                            name="senderBank"
                            render={() => (
                                <FormItem className="border-t border-gray-200">
                                    <div className="payment-transfer_form-item py-5">
                                        <div className="payment-transfer_form-content">
                                            <FormLabel className="text-14 font-medium text-gray-700">
                                                Source Bank Account
                                            </FormLabel>
                                            <FormDescription className="text-13 font-normal text-gray-500">
                                                Select the account to transfer funds from
                                            </FormDescription>
                                        </div>
                                        <div className="flex w-full flex-col">
                                            <FormControl>
                                                <BankDropdown
                                                    accounts={accounts}
                                                    setValue={form.setValue}
                                                    otherStyles="!w-full"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-12 text-red-500" />
                                        </div>
                                    </div>
                                </FormItem>
                            )}
                        />
                    </motion.div>

                    {/* Recipient section header */}
                    <motion.div variants={activeFieldVariants} className="payment-transfer_form-details">
                        <h2 className="text-16 font-semibold text-gray-900 tracking-tight">Recipient details</h2>
                        <p className="text-13 font-normal text-gray-500">
                            Enter the verified details of the recipient account
                        </p>
                    </motion.div>

                    {/* 2. Recipient Email */}
                    <motion.div variants={activeFieldVariants}>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="border-t border-gray-200">
                                    <div className="payment-transfer_form-item py-5">
                                        <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">
                                            Recipient&apos;s Email Address
                                        </FormLabel>
                                        <div className="flex w-full flex-col">
                                            <FormControl>
                                                <Input
                                                    placeholder="ex: johndoe@gmail.com"
                                                    className="input-class focus-pulse"
                                                    disabled={isLoading}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-12 text-red-500" />
                                        </div>
                                    </div>
                                </FormItem>
                            )}
                        />
                    </motion.div>

                    {/* 3. Recipient Account ID */}
                    <motion.div variants={activeFieldVariants}>
                        <FormField
                            control={form.control}
                            name="sharableId"
                            render={({ field }) => (
                                <FormItem className="border-t border-gray-200">
                                    <div className="payment-transfer_form-item py-5">
                                        <div className="payment-transfer_form-content">
                                            <FormLabel className="text-14 font-medium text-gray-700 flex items-center">
                                                Recipient&apos;s Account ID
                                                <FieldHint text="Ask the recipient to share their Account ID from their Horizon profile page. It starts with a letter and is 8+ characters long." />
                                            </FormLabel>
                                            <FormDescription className="text-13 font-normal text-gray-500">
                                                The recipient can find this in their profile settings
                                            </FormDescription>
                                        </div>
                                        <div className="flex w-full flex-col">
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter the recipient's account ID"
                                                    className="input-class focus-pulse"
                                                    disabled={isLoading}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-12 text-red-500" />
                                        </div>
                                    </div>
                                </FormItem>
                            )}
                        />
                    </motion.div>

                    {/* 4. Amount */}
                    <motion.div variants={activeFieldVariants}>
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem className="border-t border-gray-200">
                                    <div className="payment-transfer_form-item py-5">
                                        <div className="payment-transfer_form-content">
                                            <FormLabel className="text-14 font-medium text-gray-700 flex items-center">
                                                Amount (USD)
                                                <FieldHint text="Enter the exact amount you want to send. Transfers settle in 1–3 business days via ACH." />
                                            </FormLabel>
                                            <AnimatePresence>
                                                {selectedSenderAccount && (
                                                    <motion.p
                                                        key="balance"
                                                        className="text-12 font-normal text-success-600"
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: "auto" }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        Available: {formatAmount(selectedSenderAccount.currentBalance)}
                                                    </motion.p>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                        <div className="flex w-full flex-col gap-2.5">
                                            <FormControl>
                                                <div className="relative">
                                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-16 font-semibold text-gray-400">
                                                        $
                                                    </span>
                                                    <Input
                                                        placeholder="0.00"
                                                        className="input-class focus-pulse pl-8 font-ibm-plex-serif text-18 font-medium"
                                                        disabled={isLoading}
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                            
                                            {/* Tactile Amount Presets */}
                                            <div className="flex flex-wrap items-center gap-1.5">
                                                {["25", "50", "100", "250"].map((preset) => (
                                                    <button
                                                        key={preset}
                                                        type="button"
                                                        onClick={() => form.setValue("amount", preset, { shouldValidate: true })}
                                                        className={`rounded-md px-2.5 py-1 text-12 font-medium transition-all ${
                                                            form.watch("amount") === preset
                                                                ? "bg-bankGradient text-white shadow-sm"
                                                                : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                                                        }`}
                                                    >
                                                        +${preset}
                                                    </button>
                                                ))}
                                                {selectedSenderAccount && selectedSenderAccount.currentBalance > 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => form.setValue("amount", selectedSenderAccount.currentBalance.toString(), { shouldValidate: true })}
                                                        className="rounded-md border border-bankGradient/30 bg-blue-25 px-2.5 py-1 text-12 font-semibold text-bankGradient hover:bg-blue-100/50 transition-colors"
                                                    >
                                                        Max (${Math.floor(selectedSenderAccount.currentBalance)})
                                                    </button>
                                                )}
                                            </div>
                                            <FormMessage className="text-12 text-red-500" />
                                        </div>
                                    </div>
                                </FormItem>
                            )}
                        />
                    </motion.div>

                    {/* 5. Transfer Note */}
                    <motion.div variants={activeFieldVariants}>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="border-t border-gray-200">
                                    <div className="payment-transfer_form-item py-5">
                                        <div className="payment-transfer_form-content">
                                            <FormLabel className="text-14 font-medium text-gray-700">
                                                Transfer Note <span className="font-normal text-gray-400">(Optional)</span>
                                            </FormLabel>
                                            <FormDescription className="text-13 font-normal text-gray-500">
                                                A short note for the recipient
                                            </FormDescription>
                                        </div>
                                        <div className="flex w-full flex-col">
                                            <FormControl>
                                                <Textarea
                                                    placeholder="e.g. Monthly rent — August"
                                                    className="input-class focus-pulse"
                                                    disabled={isLoading}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-12 text-red-500" />
                                        </div>
                                    </div>
                                </FormItem>
                            )}
                        />
                    </motion.div>

                    {/* Error banner — shakes on each new error */}
                    <AnimatePresence mode="wait">
                        {errorMessage && (
                            <motion.div
                                key={errorKey}
                                className="mt-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700"
                                variants={shouldReduceMotion ? undefined : errorShakeVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                <AlertCircle className="size-5 shrink-0 text-red-500 mt-0.5" />
                                <div className="text-14">
                                    <p className="font-semibold">Transfer Error</p>
                                    <p>{errorMessage}</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Processing notice */}
                    <motion.div
                        variants={activeFieldVariants}
                        className="mt-6 flex items-center gap-3 rounded-lg border border-blue-100 bg-blue-25/20 p-4 text-blue-900"
                    >
                        <Info className="size-5 text-bankGradient shrink-0" />
                        <p className="text-12 sm:text-14">
                            Transfers settle securely in <strong>1–3 business days</strong> via ACH. Once confirmed, they cannot be instantly reversed.
                        </p>
                    </motion.div>

                    {/* Submit button */}
                    <motion.div variants={activeFieldVariants} className="payment-transfer_btn-box">
                        <motion.div
                            whileHover={shouldReduceMotion ? {} : { scale: 1.015 }}
                            whileTap={shouldReduceMotion ? {} : { scale: 0.975 }}
                            transition={{ type: "spring", stiffness: 420, damping: 28 }}
                            className="w-full"
                        >
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="payment-transfer_btn relative overflow-hidden"
                            >
                                {/* Shimmer sweep on idle — the one authored brand moment */}
                                {!isLoading && (
                                    <span className="btn-shimmer pointer-events-none absolute inset-0" aria-hidden="true" />
                                )}
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 size={18} className="animate-spin" />
                                        Processing…
                                    </span>
                                ) : (
                                    "Review Transfer →"
                                )}
                            </Button>
                        </motion.div>
                    </motion.div>
                </motion.form>
            </Form>

            {/* ── Step 2 Confirmation Modal ────────────────────────────── */}
            <AnimatePresence>
                {showConfirmation && pendingData && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto"
                        aria-modal="true"
                        role="dialog"
                        aria-labelledby="confirm-transfer-title"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.94, y: 12 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.94, y: 12 }}
                            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                            className="w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-xl border border-gray-200 bg-white p-6 shadow-xl sm:p-8"
                        >
                            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                                <div className="flex items-center gap-2">
                                    <motion.div
                                        initial={{ rotate: -20, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        transition={{ delay: 0.15, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                    >
                                        <ShieldCheck className="size-6 text-bankGradient" />
                                    </motion.div>
                                    <h3 id="confirm-transfer-title" className="text-18 font-semibold text-gray-900">
                                        Confirm Payment Transfer
                                    </h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmation(false)}
                                    disabled={isLoading}
                                    aria-label="Close confirmation dialog"
                                    className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors duration-150"
                                >
                                    <X className="size-5" />
                                </button>
                            </div>

                            {/* Step 2 pip inside modal */}
                            <div className="mt-4 mb-5 flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="size-5 text-success-600" />
                                    <span className="text-12 font-medium text-success-600">Details filled</span>
                                </div>
                                <div className="h-px flex-1 bg-bank-gradient opacity-40" />
                                <div className="flex items-center gap-2">
                                    <span className="flex size-5 items-center justify-center rounded-full bg-bank-gradient text-10 font-semibold text-white">2</span>
                                    <span className="text-12 font-semibold text-gray-700">Confirm &amp; Send</span>
                                </div>
                            </div>

                            {/* Summary rows — stagger in */}
                            <motion.div
                                className="mb-6 space-y-4"
                                initial="hidden"
                                animate="visible"
                                variants={{ visible: { transition: { staggerChildren: 0.055, delayChildren: 0.1 } } }}
                            >
                                <div className="rounded-lg bg-gray-25 p-4 space-y-3">
                                    {[
                                        { label: "Source Account", value: selectedSenderAccount?.name || "Selected Bank", valueClass: "font-medium text-gray-900" },
                                        ...(selectedSenderAccount ? [{ label: "Available Balance", value: formatAmount(selectedSenderAccount.currentBalance), valueClass: "font-medium text-success-600" }] : []),
                                        { label: "Recipient Email", value: pendingData.email, valueClass: "font-medium text-gray-900" },
                                        ...(pendingData.name ? [{ label: "Transfer Note", value: pendingData.name, valueClass: "font-medium text-gray-900" }] : []),
                                    ].map(({ label, value, valueClass }) => (
                                        <motion.div
                                            key={label}
                                            className="flex justify-between text-14"
                                            variants={shouldReduceMotion ? fieldVariantsReduced : fieldVariants}
                                        >
                                            <span className="text-gray-500">{label}:</span>
                                            <span className={valueClass}>{value}</span>
                                        </motion.div>
                                    ))}

                                    <motion.div
                                        className="flex justify-between border-t border-gray-200 pt-3 text-16 font-semibold"
                                        variants={shouldReduceMotion ? fieldVariantsReduced : fieldVariants}
                                    >
                                        <span className="text-gray-700">Total Amount:</span>
                                        <span className="text-bankGradient font-ibm-plex-serif">
                                            ${Number(pendingData.amount).toFixed(2)} USD
                                        </span>
                                    </motion.div>
                                </div>

                                <motion.p
                                    className="text-12 text-gray-500"
                                    variants={shouldReduceMotion ? fieldVariantsReduced : fieldVariants}
                                >
                                    By confirming, you authorize Horizon to debit your source account for the amount specified. ACH transfers cannot be instantly canceled once submitted.
                                </motion.p>
                            </motion.div>

                            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowConfirmation(false)}
                                    disabled={isLoading}
                                    className="w-full sm:w-auto"
                                >
                                    ← Edit Details
                                </Button>
                                <motion.div
                                    whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                                    whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
                                    transition={{ type: "spring", stiffness: 420, damping: 28 }}
                                >
                                    <Button
                                        type="button"
                                        onClick={handleConfirmTransfer}
                                        disabled={isLoading}
                                        className="w-full bg-bank-gradient font-semibold text-white sm:w-auto relative overflow-hidden"
                                    >
                                        {!isLoading && <span className="btn-shimmer pointer-events-none absolute inset-0" aria-hidden="true" />}
                                        {isLoading ? (
                                            <span className="flex items-center gap-2">
                                                <Loader2 size={18} className="animate-spin" />
                                                Sending Transfer…
                                            </span>
                                        ) : (
                                            "Confirm & Send"
                                        )}
                                    </Button>
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default PaymentTransferForm;