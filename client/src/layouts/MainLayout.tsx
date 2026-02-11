import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import { logout } from '../store/authSlice';
import { useLogoutMutation } from '../api/apiEndpoints';
import { LogOut, PlusCircle, Ticket } from 'lucide-react';
import { Button } from '../components/Button';

export const MainLayout: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [logoutApi] = useLogoutMutation();

    const handleLogout = async () => {
        await logoutApi();
        dispatch(logout());
        navigate('/login');
    };

    const navItems = [
        { label: 'Issues', path: '/issues', icon: Ticket },
        { label: 'Create', path: '/issues/new', icon: PlusCircle },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            {/* Navbar */}
            <nav className="sticky top-0 z-40 w-full border-b border-white/5 bg-black/50 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

                    <div className="flex items-center gap-8">
                    <Link to="/issues" className="flex items-center gap-2">
                        <img 
                            src="/logo.png" 
                            alt="Logo"
                            className="w-28 h-28 object-contain"
                            />
                    </Link>

                    <div className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            location.pathname === item.path
                                ? 'bg-white/5 text-white'
                                : 'text-zinc-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <item.icon size={16} />
                            {item.label}
                        </Link>
                        ))}
                    </div>
                    </div>

                    <div className="flex items-center gap-4">
                    {user ? (
                        <>
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium">
                            {user.email.split('@')[0]}
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleLogout}
                            title="Logout"
                        >
                            <LogOut size={18} />
                        </Button>
                        </>
                    ) : (
                        <Button onClick={() => navigate('/login')}>Login</Button>
                    )}
                    </div>

                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 py-8">
                <Outlet />
            </main>
        </div>
    );
};
