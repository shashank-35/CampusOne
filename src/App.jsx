import { BrowserRouter } from "react-router";
import "./App.css";
import Router from "./router/Router";
import Layout from "./Layout/Layout";

function App() {
  return (
    <BrowserRouter>
     <Router />
    {/* <Layout/> */}
     </BrowserRouter>
  );
}

export default App;
