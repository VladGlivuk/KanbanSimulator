import {useQuery} from "@apollo/client";
import {ALL_POSTS} from "./apollo/posts";

const App = () => {
  const {loading, error, data} = useQuery(ALL_POSTS);

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error...</div>
  }

  console.log(data);

  return (
    <div className="text-red-800">App</div>
  )
}

export default App
