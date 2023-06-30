import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './pages/Layout';
import Genotypes from './pages/Genotypes';
import GenotypesBySnp from './pages/GenotypesBySnp';
import GenotypesEffects from './pages/GenotypesEffects';
import Interpretations from './pages/Interpretations';
import Snps from './pages/Snps';
import Report from './pages/Report';
import Login from './pages/Login';
import RouteGuard from './components/RouteGuard';
import { SnackbarProbider } from './components/Snackbar/context';
import Users from './pages/Users';


const App = () => {
  return (
		<SnackbarProbider>
			<BrowserRouter>
				<Routes>
					<Route path='/login' element={<Login />} />
					<Route path='/' element={<RouteGuard outlet={<Layout />} />}>
						<Route path='/create-report' element={<Report />} />
						<Route path='/users' element={<Users />} />
						<Route path='/genotypes' element={<Genotypes />} />
						{/*<Route path='/genotypes-by-snp' element={<GenotypesBySnp />} />*/}
						<Route path='/genotypes-effects' element={<GenotypesEffects />} />
						<Route path='/interpretations' element={<Interpretations />} />
						<Route path='/snps' element={<Snps />} />
					</Route>
					<Route path='/user-report' element={<RouteGuard outlet={<Layout />} />} />
				</Routes>
			</BrowserRouter>
		</SnackbarProbider>
  );
}

export default App;
