import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  LayoutDashboard, 
  Key, 
  CreditCard, 
  FileCheck, 
  LogOut,
  Menu,
  X,
  BookOpen
} from 'lucide-react';
import { useState } from 'react';

const navigation = [
  { name: 'Overview', to: '/dashboard', icon: LayoutDashboard },
  { name: 'API Keys', to: '/dashboard/api-keys', icon: Key },
  { name: 'Billing', to: '/dashboard/billing', icon: CreditCard },
  { name: 'Verifications', to: '/dashboard/verifications', icon: FileCheck },
  { name: 'API Docs', to: '/dashboard/api-docs', icon: BookOpen },
];

export default function DashboardLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar - Desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-gray-200 px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="bg-primary-600 p-2 rounded-lg">
                <Key className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">TrustAMove</span>
            </div>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <NavLink
                        to={item.to}
                        end={item.to === '/dashboard'}
                        className={({ isActive }) =>
                          `group flex gap-x-3 rounded-lg p-2 text-sm font-semibold leading-6 transition-colors ${
                            isActive
                              ? 'bg-primary-50 text-primary-600'
                              : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                          }`
                        }
                      >
                        <item.icon className="h-5 w-5 shrink-0" />
                        {item.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="mt-auto">
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center gap-x-4 px-2 py-3 text-sm font-semibold leading-6 text-gray-900">
                    <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-600 font-medium">
                        {user?.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="sr-only">Your profile</span>
                    <span className="text-sm truncate">{user?.email}</span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="group -mx-2 flex w-full gap-x-3 rounded-lg p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="h-5 w-5 shrink-0" />
                    Sign out
                  </button>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm lg:hidden">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-700"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className="sr-only">Open sidebar</span>
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
        <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">
          TrustAMove Dashboard
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-40 bg-gray-900/80" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white">
            <div className="flex h-16 shrink-0 items-center border-b border-gray-200 px-6">
              <div className="flex items-center gap-3">
                <div className="bg-primary-600 p-2 rounded-lg">
                  <Key className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">TrustAMove</span>
              </div>
            </div>
            <nav className="px-6 py-4">
              <ul role="list" className="space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <NavLink
                      to={item.to}
                      end={item.to === '/dashboard'}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `group flex gap-x-3 rounded-lg p-2 text-sm font-semibold leading-6 transition-colors ${
                          isActive
                            ? 'bg-primary-50 text-primary-600'
                            : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {item.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="lg:pl-64">
        <div className="px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
