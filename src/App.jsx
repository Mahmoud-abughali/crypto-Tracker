import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./Pages/Home";
import { CoinDetales } from "./Pages/CoinDetales";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/coin/:id" element={<CoinDetales />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


