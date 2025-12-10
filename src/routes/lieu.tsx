import { createFileRoute } from "@tanstack/react-router";
import { ElementsProvider } from "@/app/providers";
import { LieuEditor } from "@/widgets/lieu-editor";

export const Route = createFileRoute("/lieu")({
    component: LieuPage,
});

function LieuPage() {
    return (
        <ElementsProvider>
            <div className="bg-white">
                <LieuEditor />
            </div>
        </ElementsProvider>
    );
}
