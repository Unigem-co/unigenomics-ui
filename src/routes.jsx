import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './pages/Layout';
import Login from './pages/Login';
import Users from './pages/Users';
import SNPs from './pages/Snps';
import Genotypes from './pages/Genotypes';
import Interpretations from './pages/Interpretations';
import GenotypesEffects from './pages/GenotypesEffects';
import Report from './pages/Report';
import ReportGenerator from './pages/ReportGenerator';
import RouteGuard from './components/RouteGuard';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/user-report" element={<ReportGenerator />} />
      <Route path="/" element={<RouteGuard outlet={<Layout />} />}>
        <Route path="/create-report" element={<Report />} />
        <Route path="/users" element={<Users />} />
        <Route path="/snps" element={<SNPs />} />
        <Route path="/genotypes" element={<Genotypes />} />
        <Route path="/interpretations" element={<Interpretations />} />
        <Route path="/genotypes-effects" element={<GenotypesEffects />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;