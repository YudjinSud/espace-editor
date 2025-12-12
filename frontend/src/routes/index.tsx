import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    getLieuControllerFindAllQueryKey,
    useLieuControllerCreate,
    useLieuControllerFindAll,
    useLieuControllerRemove,
} from "@/shared/api/generated/lieus/lieus";
import type { Lieu } from "@/shared/api/types";

export const Route = createFileRoute("/")({
    component: Index,
});

function Index() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [newLieuName, setNewLieuName] = useState("");

    const { data: lieus, isLoading } = useLieuControllerFindAll<Lieu[]>();

    const createMutation = useLieuControllerCreate({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: getLieuControllerFindAllQueryKey() });
                setNewLieuName("");
            },
        },
    });

    const deleteMutation = useLieuControllerRemove({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: getLieuControllerFindAllQueryKey() });
            },
        },
    });

    const handleCreate = () => {
        if (!newLieuName.trim()) return;
        createMutation.mutate({ data: { name: newLieuName.trim() } });
    };

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        deleteMutation.mutate({ id });
    };

    const handleNavigate = (id: string) => {
        navigate({ to: "/lieu/$lieuId", params: { lieuId: id } });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-slate-500">Chargement...</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Mes Lieux</h1>

            <div className="flex gap-2 mb-6">
                <input
                    type="text"
                    value={newLieuName}
                    onChange={(e) => setNewLieuName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                    placeholder="Nom du nouveau lieu..."
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
                <Button
                    onClick={handleCreate}
                    disabled={!newLieuName.trim() || createMutation.isPending}
                >
                    <Plus className="w-4 h-4 mr-1" />
                    Créer
                </Button>
            </div>

            {lieus?.length === 0 ? (
                <p className="text-slate-500 text-center py-8">
                    Aucun lieu. Créez votre premier lieu ci-dessus.
                </p>
            ) : (
                <ul className="space-y-2">
                    {lieus?.map((lieu) => (
                        <li
                            key={lieu.id}
                            onClick={() => handleNavigate(lieu.id)}
                            className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                        >
                            <span className="font-medium">{lieu.name}</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => handleDelete(e, lieu.id)}
                                className="text-red-400 hover:text-red-600 hover:bg-red-50"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
