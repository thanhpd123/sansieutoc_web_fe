import { Outlet } from 'react-router';
import { Navbar } from './Navbar';

export default function Root() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] overflow-x-hidden">
      <Navbar />
      <Outlet />
    </div>
  );
}
