import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Home, ProjectDetail, Projects } from "./pages";

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;