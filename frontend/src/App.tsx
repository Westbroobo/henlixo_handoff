import { Route, Routes } from 'react-router-dom';

import { Footer } from './components/layout/Footer';
import { Header } from './components/layout/Header';
import { CatalogPage } from './pages/CatalogPage';
import { CasesPage } from './pages/CasesPage';
import { HomePage } from './pages/HomePage';

export function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/cases" element={<CasesPage />} />
      </Routes>
      <Footer />
    </>
  );
}
