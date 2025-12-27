import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import MarkStory from "./pages/MarkStory"

const queryClient = new QueryClient()

function App() {
    return (
        <>
            <QueryClientProvider client={queryClient}>
                <MarkStory />
            </QueryClientProvider>
        </>
    )
}

export default App
