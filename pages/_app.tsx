import { RecoilRoot } from "recoil";
import NavBar from "../components/Home/NavBar";
import "../style/common.css";
import "highlightjs/styles/vs2015.css";
import ErrorView from "../components/Error/ErrorView";

const App = ({ Component, pageProps }) => {
  return (
    <RecoilRoot>
      <NavBar />
      <ErrorView />
      <Component {...pageProps} />
    </RecoilRoot>
  );
};

export default App;
