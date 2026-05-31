import { createBrowserRouter } from 'react-router';
import Root from './components/Root';
import LandingPage from './pages/LandingPage';
import SearchPage from './pages/SearchPage';
import DashboardPage from './pages/DashboardPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: LandingPage },
      { path: 'search', Component: SearchPage },
      { path: 'dashboard', Component: DashboardPage },
    ],
  },
]);
