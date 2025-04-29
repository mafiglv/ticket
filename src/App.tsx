import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import EmissaoSenha from "./pages/EmissaoSenha";
import PainelAtendente from "./pages/PainelAtendente";
import { SenhaProvider } from "./context/SenhaContext";
import "./App.css";

function App() {
  return (
    <SenhaProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/emissao" element={<EmissaoSenha />} />
          <Route path="/painel" element={<PainelAtendente />} />
        </Routes>
      </Router>
    </SenhaProvider>
  );
}

export default App;
