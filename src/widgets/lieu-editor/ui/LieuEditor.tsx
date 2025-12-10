import { move } from "@dnd-kit/helpers";
import { DragDropProvider, DragOverlay } from "@dnd-kit/react";
import { useRef } from "react";
import { Separator } from "@/components/ui/separator";
import { ElementItem } from "@/entities/element";
import { useLieuEditor } from "../lib/useLieuEditor";
import { LieuEditorHeader } from "./LieuEditorHeader";
import { SortableEspace } from "./SortableEspace";
import { SortableNiveau } from "./SortableNiveau";

export function LieuEditor() {
    const {
        espacesByNiveau,
        setEspacesByNiveau,
        niveauOrder,
        setNiveauOrder,
        syncOrder,
        getElementById,
        handleEdit,
        handleDelete,
        handleClose,
    } = useLieuEditor();

    const previousEspaces = useRef(espacesByNiveau);

    return (
        <DragDropProvider
            onDragStart={() => {
                previousEspaces.current = espacesByNiveau;
            }}
            // biome-ignore lint/suspicious/noExplicitAny: dnd-kit types
            onDragOver={(event: any) => {
                const { source } = event.operation;
                if (source?.type === "niveau") return;

                setEspacesByNiveau((items) => move(items, event));
            }}
            // biome-ignore lint/suspicious/noExplicitAny: dnd-kit types
            onDragEnd={(event: any) => {
                const { source } = event.operation;

                if (event.canceled) {
                    if (source?.type === "espace") {
                        setEspacesByNiveau(previousEspaces.current);
                    }
                    return;
                }

                if (source?.type === "niveau") {
                    const newOrder = move(niveauOrder, event);
                    setNiveauOrder(newOrder);
                    syncOrder(espacesByNiveau, newOrder);
                } else {
                    syncOrder(espacesByNiveau, niveauOrder);
                }
            }}
        >
            <div className="flex flex-col h-full bg-white">
                <LieuEditorHeader
                    title="Editer niveaux et espaces"
                    onClose={handleClose}
                />

                <div className="flex-1 overflow-auto">
                    {niveauOrder.map((niveauId, niveauIndex) => {
                        const niveau = getElementById(niveauId);
                        if (!niveau) return null;

                        const espaces = espacesByNiveau[niveauId] || [];

                        return (
                            <SortableNiveau
                                key={niveauId}
                                element={niveau}
                                index={niveauIndex}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            >
                                {espaces.length === 0 ? (
                                    <div className="h-12 flex items-center justify-center text-slate-400 text-sm -ml-6">
                                        Aucun espace
                                    </div>
                                ) : (
                                    espaces.map((espaceId, espaceIndex) => {
                                        const espace = getElementById(espaceId);
                                        if (!espace) return null;

                                        return (
                                            <div key={espaceId}>
                                                <SortableEspace
                                                    element={espace}
                                                    index={espaceIndex}
                                                    niveauId={niveauId}
                                                    onEdit={handleEdit}
                                                    onDelete={handleDelete}
                                                />
                                                {espaceIndex <
                                                    espaces.length - 1 && (
                                                    <Separator />
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                            </SortableNiveau>
                        );
                    })}
                </div>
            </div>

            <DragOverlay>
                {(source) => {
                    if (!source) return null;
                    const element = getElementById(source.id as string);
                    if (!element) return null;

                    return (
                        <div className="bg-white shadow-lg rounded opacity-90">
                            <ElementItem element={element} />
                        </div>
                    );
                }}
            </DragOverlay>
        </DragDropProvider>
    );
}
