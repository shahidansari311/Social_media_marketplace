import { Outlet, Link } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import AdminNavbar from "../../components/AdminNavbar";
import { useState, useEffect, useCallback } from "react";
import { ArrowRightIcon, Loader2Icon, ShieldAlert } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import api from "../../config/axios";

const Layout = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { getToken, isLoaded: isAuthLoaded } = useAuth();

    const fetchIsAdmin = useCallback(async () => {
        try {
            const token = await getToken();
            const { data } = await api.get('/api/admin/check-status', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsAdmin(data.success);
        } catch (error) {
            console.error("Admin verification failed:", error);
            setIsAdmin(false);
        } finally {
            setIsLoading(false);
        }
    }, [getToken]);

    useEffect(() => {
        if (isAuthLoaded) {
            fetchIsAdmin();
        }
    }, [isAuthLoaded, fetchIsAdmin]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2Icon className="size-8 text-brand-500 animate-spin" />
                    <p className="text-sm font-medium text-gray-500">Verifying admin access...</p>
                </div>
            </div>
        );
    }

    return isAdmin ? (
        <>
            <AdminNavbar />
            <div className="flex">
                <AdminSidebar />
                <div className="flex-1 px-6 py-8 md:px-10 h-[calc(100vh-64px)] bg-[#f8f9fc] overflow-y-auto">
                    <Outlet />
                </div>
            </div>
        </>
    ) : (
        <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-50 px-6">
            <div className="glass-card rounded-3xl p-12 max-w-md w-full space-y-6">
                <div className="size-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto">
                    <ShieldAlert className="size-8 text-red-500" />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-gray-900 mb-2">Access Denied</h2>
                    <p className="text-gray-500 font-medium text-sm">You don't have admin privileges to access this area.</p>
                </div>
                <Link to="/" className="inline-flex items-center px-6 py-3 premium-gradient text-white rounded-2xl font-bold shadow-xl shadow-brand-500/20 hover:scale-[1.05] active:scale-95 transition-all">
                    Go to Home <ArrowRightIcon className="ml-2 size-4" />
                </Link>
            </div>
        </div>
    );
};

export default Layout;
