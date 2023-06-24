import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './pages/Layout';
import Genotypes from './pages/Genotypes';
import GenotypesBySnp from './pages/GenotypesBySnp';
import GenotypesEffects from './pages/GenotypesEffects';
import Interpretations from './pages/Interpretations';
import Snps from './pages/Snps';
import Report from './pages/Report';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/create-report" element={<Report />} />
          <Route path="/genotypes" element={<Genotypes />} />
          <Route path="/genotypes-by-snp" element={<GenotypesBySnp />} />
          <Route path="/genotypes-effects" element={<GenotypesEffects />} />
          <Route path="/interpretations" element={<Interpretations />} />
          <Route path="/snps" element={<Snps />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
