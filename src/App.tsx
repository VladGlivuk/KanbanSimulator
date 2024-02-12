import RootLayout from "@/layouts/RootLayout";
import Header from "@/components/Header";
import Board from "@/components/Board";
// context
import { SortContextProvider } from "./context";

const App = () => {
  return (
      <RootLayout>
        <SortContextProvider>
        <Header />
        <Board />
        </SortContextProvider>
      </RootLayout>
  )
}

export default App
