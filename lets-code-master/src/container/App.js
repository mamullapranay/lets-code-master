import {  useState } from "react";
import Home from "./Home/Home";
import "./style/Home.scss";
import { BrowserRouter as Router } from "react-router-dom";

import Error from "./Modals/Error";
import { ErrorContext } from "./context/ErrorContext";

function App() {
  const [ErrorMssg, setErrorMssg] = useState("");
  return (
    <Router>
      <>
        <Error error={ErrorMssg}/>
        <ErrorContext.Provider value={setErrorMssg}>
          <Home />
        </ErrorContext.Provider>
      </>
    </Router>
  );
}

export default App;
