import { RecoilRoot } from "recoil";
import NavBar from "../components/Home/NavBar";
import "../style/common.css";

const App = ({ Component, pageProps }) => {
  return (
    <RecoilRoot>
      <NavBar />
      <Component {...pageProps} />
    </RecoilRoot>
  );
};

export default App;
