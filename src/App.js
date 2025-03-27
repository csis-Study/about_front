import React from 'react';
import { useRoutes } from "react-router-dom";
import router from "./router/index";
function App() {  
  const routes = useRoutes(router);
  return (
    <div className="App">
      {routes}
    </div>
  );
}

export default App;
