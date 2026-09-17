// layout/AppShell.jsx — the chrome every page shares: sidebar + topbar +
// the routed page content (<Outlet/>). Individual pages only need to
// worry about their own content; sidebar/topbar/off-canvas behavior is
// handled once, here.
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar/Sidebar';
import Topbar from './Topbar/Topbar';
import MobileBar from './MobileBar/MobileBar';

export default function AppShell() {
  return (
    <div className="d-flex vh-app">
      <Sidebar />
      <MobileBar />
      <main className="flex-grow-1 d-flex flex-column overflow-hidden">
        <Topbar />
        <div className="flex-grow-1 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
