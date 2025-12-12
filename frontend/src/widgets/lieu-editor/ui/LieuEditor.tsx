import { DragDropProvider, DragOverlay } from "@dnd-kit/react";
import { ElementItem } from "@/entities/element";
import { useLieuEditor } from "../lib/useLieuEditor";
import { LieuEditorHeader } from "./LieuEditorHeader";
import { NiveauWithEspaces } from "./NiveauWithEspaces";

export function LieuEditor() {
    const {
        niveauOrder,
        espacesByNiveau,
        getElementById,
        handleRename,
        handleDelete,
        handleClose,
        handleDragStart,
        handleDragOver,
        handleDragEnd,
    } = useLieuEditor();

    return (
        <DragDropProvider
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className="flex flex-col h-full bg-white">
                <LieuEditorHeader
                    title="Editer niveaux et espaces"
                    onClose={handleClose}
                />

                <div className="flex-1 overflow-auto">
                    {niveauOrder.map((niveauId, index) => (
                        <NiveauWithEspaces
                            key={niveauId}
                            niveauId={niveauId}
                            index={index}
                            espaceIds={espacesByNiveau[niveauId] || []}
                            getElementById={getElementById}
                            onRename={handleRename}
                            onDelete={handleDelete}
                        />
                    ))}
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
