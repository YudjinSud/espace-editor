import { cva } from "class-variance-authority";

export const containerVariants = cva(
    "flex items-center justify-between pr-4 py-3 h-12",
    {
        variants: {
            type: {
                niveau: "bg-slate-100",
                espace: "",
            },
        },
    },
);

export const textVariants = cva("", {
    variants: {
        type: {
            niveau: "font-medium text-slate-900",
            espace: "text-slate-700",
        },
    },
});

export const editButtonVariants = cva("", {
    variants: {
        type: {
            niveau: "text-slate-500 hover:text-slate-700",
            espace: "text-slate-400 hover:text-slate-600",
        },
    },
});

export const dragHandleVariants = cva(
    "cursor-grab active:cursor-grabbing hover:bg-slate-200 touch-none",
    {
        variants: {
            type: {
                niveau: "text-slate-400 hover:text-slate-600",
                espace: "text-slate-300 hover:text-slate-500",
            },
        },
    },
);

export const inputVariants = cva(
    "flex-1 min-w-0 bg-transparent border-b border-slate-300 outline-none focus:border-slate-500 px-1",
    {
        variants: {
            type: {
                niveau: "font-medium text-slate-900",
                espace: "text-slate-700",
            },
        },
    },
);
