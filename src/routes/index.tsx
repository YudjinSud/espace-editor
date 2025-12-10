import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
    component: Index,
});

function Index() {
    return (
        <div className="flex items-center justify-center h-full">
            <h1 className="text-4xl font-bold">Auditoo Home Task</h1>
        </div>
    );
}
