export type ElementType = "niveau" | "espace";

export type Element = {
    id: string;
    name: string;
    type: ElementType;
    parentId?: string;
    order: number;
};
