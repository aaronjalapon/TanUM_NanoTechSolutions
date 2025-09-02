import { Outlet } from 'react-router-dom';
import { Bell, User, Menu } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useApp } from '../context/AppContext';
import TanUMLogo from '../assets/TanUM.webp';

export default function Layout() {
  const { state } = useApp();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-teal-800 text-white shadow-lg">
        <div className="navbar max-w-7xl mx-auto px-4">
          <div className="navbar-start">
            <div className="dropdown">
              <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden hover:bg-white/20 transition-colors">
                <Menu className="h-5 w-5" />
              </div>
              <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1000] p-3 shadow-lg bg-white rounded-lg w-64 border border-gray-200">
                <li className="menu-title">
                  <span className="text-gray-600 text-xs uppercase tracking-wider font-semibold mb-2">Navigation</span>
                </li>
                <li>
                  <a href="/dashboard" className="text-gray-900 hover:bg-teal-50 hover:text-teal-800 rounded-md py-3 px-4 transition-all duration-200 flex items-center gap-3">
                    <FontAwesomeIcon icon="tachometer-alt" className="text-lg" />
                    Dashboard
                  </a>
                </li>
                <li>
                  <a href="/recommendations" className="text-gray-900 hover:bg-teal-50 hover:text-teal-800 rounded-md py-3 px-4 transition-all duration-200 flex items-center gap-3">
                    <FontAwesomeIcon icon="flask" className="text-lg" />
                    Recommendations
                  </a>
                </li>
                <li>
                  <a href="/tracker" className="text-gray-900 hover:bg-teal-50 hover:text-teal-800 rounded-md py-3 px-4 transition-all duration-200 flex items-center gap-3">
                    <FontAwesomeIcon icon="chart-bar" className="text-lg" />
                    Tracker
                  </a>
                </li>
                {state.userType === 'researcher' && (
                  <li>
                    <a href="/research" className="text-gray-900 hover:bg-teal-50 hover:text-teal-800 rounded-md py-3 px-4 transition-all duration-200 flex items-center gap-3">
                      <FontAwesomeIcon icon="microscope" className="text-lg" />
                      Research
                    </a>
                  </li>
                )}
                <li className="mt-2 pt-2 border-t border-gray-200">
                  <div className="px-4 py-2">
                    <div className="text-xs text-gray-500">
                      Connected as: <span className="font-medium text-gray-700">{state.currentFarmer?.name || 'User'}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {state.currentFarmer?.crop_type} Farm • {state.currentFarmer?.location}
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div className="flex items-center gap-3">
              <img 
                src={TanUMLogo} 
                alt="TanUM Logo" 
                className="h-10 w-10 rounded-lg object-contain bg-white/10 p-1"
              />
              <span className="font-header font-bold text-xl">TanUM AgriSense</span>
            </div>
          </div>
          
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1 gap-2">
              <li><a href="/dashboard" className="hover:bg-teal-700">Dashboard</a></li>
              <li><a href="/recommendations" className="hover:bg-teal-700">Recommendations</a></li>
              <li><a href="/tracker" className="hover:bg-teal-700">Tracker</a></li>
              {state.userType === 'researcher' && (
                <li><a href="/research" className="hover:bg-teal-700">Research</a></li>
              )}
            </ul>
          </div>
          
          <div className="navbar-end gap-2">
            <button className="btn btn-ghost btn-circle hover:bg-white/20 transition-colors">
              <Bell className="h-5 w-5" />
            </button>
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar hover:bg-white/20 transition-colors">
                <User className="h-5 w-5" />
              </div>
              <ul tabIndex={0} className="mt-3 z-[1000] p-3 shadow-lg menu menu-sm dropdown-content bg-white rounded-lg w-64 border border-gray-200">
                <li className="mb-2">
                  <div className="text-gray-900 font-medium py-2 px-4 bg-gray-50 rounded-md">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-teal-800 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {(state.currentFarmer?.name || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold">{state.currentFarmer?.name || 'User'}</div>
                        <div className="text-xs text-gray-500">{state.currentFarmer?.crop_type} Farmer</div>
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <a className="text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md py-2 px-4 transition-all duration-200 flex items-center gap-3">
                    <FontAwesomeIcon icon="user" className="text-sm" />
                    Profile
                  </a>
                </li>
                <li>
                  <a className="text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md py-2 px-4 transition-all duration-200 flex items-center gap-3">
                    <FontAwesomeIcon icon="cog" className="text-sm" />
                    Settings
                  </a>
                </li>
                <li className="border-t border-gray-200 mt-2 pt-2">
                  <a className="text-red-600 hover:bg-red-50 hover:text-red-700 rounded-md py-2 px-4 transition-all duration-200 flex items-center gap-3">
                    <FontAwesomeIcon icon="sign-out-alt" className="text-sm" />
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
