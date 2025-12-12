import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { ElementsProvider } from "@/app/providers";
import { LieuEditor } from "@/widgets/lieu-editor";

export const Route = createFileRoute("/lieu/$lieuId")({
    component: LieuPage,
});

function LieuPage() {
    const { lieuId } = Route.useParams();

    return (
        <ElementsProvider lieuId={lieuId}>
            <div className="bg-white relative">
                <LieuEditor />
                <Toaster
                    position="bottom-center"
                    toastOptions={{
                        style: {
                            color: "rgba(7, 148, 85, 1)",
                        },
                    }}
                />
            </div>
        </ElementsProvider>
    );
}
