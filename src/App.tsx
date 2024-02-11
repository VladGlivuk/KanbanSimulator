// import {useQuery} from "@apollo/client";
// import {ALL_POSTS} from "./apollo/posts";

import { BoardContextProvider } from "@/contexts/BoardContext";
import RootLayout from "@/layouts/RootLayout";
import Header from "@/components/Header";
import Board from "@/components/Board";

const App = () => {
  // const { loading, error, data } = useQuery(ALL_POSTS);

  // if (loading) {
  //   return <div>Loading...</div>
  // }

  // if (error) {
  //   return <div>Error...</div>
  // }

  // console.log(data);

  return (
    <BoardContextProvider>
      <RootLayout>
        <Header />
        <Board />
      </RootLayout>
    </BoardContextProvider>
  )
}

export default App
