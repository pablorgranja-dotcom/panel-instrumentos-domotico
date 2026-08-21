import Link from "next/link"
import { createClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"

export default async function Navbar() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let userRole = null
    let fullName = null

    if (user) {
        const { data: profile } = await supabase
            .from("profiles")
            .select("role, full_name")
            .eq("id", user.id)
            .single()
        
        userRole = profile?.role
        fullName = profile?.full_name
    }

    // Server Action para cerrar sesión
    async function handleSignOut() {
        "use server"
        const supabase = await createClient()
        await supabase.auth.signOut()
        redirect("/login")
    }

    return (
        <header className="bg-slate-800/80 backdrop-blur border-b border-slate-700 sticky top-0 z-50">
            <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="text-xl font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                    PlataformaMentorías
                </Link>

                <div className="flex items-center gap-6">
                    <Link href="/" className="text-slate-300 hover:text-white text-sm transition-colors">
                        Inicio
                    </Link>

                    {user ? (
                        <>
                            <Link href="/dashboard" className="text-slate-300 hover:text-white text-sm transition-colors">
                                Dashboard
                            </Link>

                            {/* Mentores y Administradores pueden ver el botón de creación */}
                            {(userRole === "mentor" || userRole === "administrador") && (
                                <Link
                                    href="/dashboard/nueva-mentoria"
                                    className="text-xs bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/30 px-3 py-1.5 rounded-full transition-colors"
                                >
                                    + Crear Mentoría
                                </Link>
                            )}

                            <div className="flex items-center gap-3 pl-2 border-l border-slate-700">
                                {fullName && (
                                    <span className="text-xs text-slate-400 hidden sm:inline">
                                        {fullName}
                                    </span>
                                )}

                                <form action={handleSignOut}>
                                    <button
                                        type="submit"
                                        className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-medium px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                            <polyline points="16 17 21 12 16 7"></polyline>
                                            <line x1="21" y1="12" x2="9" y2="12"></line>
                                        </svg>
                                        Cerrar Sesión
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link
                                href="/login"
                                className="text-slate-300 hover:text-white text-sm transition-colors"
                            >
                                Iniciar Sesión
                            </Link>
                            <Link
                                href="/register"
                                className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                            >
                                Registrarse
                            </Link>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    )
}