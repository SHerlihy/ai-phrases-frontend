import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import BerryWeightViewer from "./features/berryWeightViewer"
import ExamplePage from "./features/examplePage"

const queryClient = new QueryClient()

function App() {
    return (
        <>
            <QueryClientProvider client={queryClient}>
                <BerryWeightViewer />
                <ExamplePage />
            </QueryClientProvider>
        </>
    )
}

export default App
