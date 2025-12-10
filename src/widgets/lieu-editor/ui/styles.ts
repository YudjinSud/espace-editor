import { cva } from "class-variance-authority";

export const headerVariants = cva(
    "flex items-center justify-between px-4 py-4 border-b border-slate-200",
);

export const headerTitleVariants = cva("text-lg font-semibold text-slate-900");

export const headerButtonVariants = cva("text-slate-500");
