import { defineConfig } from "orval";

export default defineConfig({
    api: {
        input: "http://localhost:3002/api/docs-json",
        output: {
            mode: "tags-split",
            target: "./src/shared/api/generated",
            schemas: "./src/shared/api/generated/model",
            client: "react-query",
            override: {
                mutator: {
                    path: "./src/shared/api/axios-instance.ts",
                    name: "axiosInstance",
                },
                query: {
                    useQuery: true,
                    useMutation: true,
                },
            },
        },
    },
});
