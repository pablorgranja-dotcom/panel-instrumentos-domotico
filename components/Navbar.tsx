import Link from "next/link"
import { createClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"

export default async function Navbar() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let userRole = null
    if (user) {
        const { data: profile } = await supabase
            .from("profiles")
            .select("role, full_name")
            .eq("id", user.id)
            .single()
        userRole = profile?.role
    }

    async function signOut() {
        "use server"
        const supabase = await createClient()
        await supabase.auth.signOut()
        redirect("/login")
    }

    return (
        <header className="bg-slate-800/80 backdrop-blur border-b border-slate-700 sticky top-0 z-50">
            <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="text-xl font-bold text-indigo-400">
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

                            {userRole === "mentor" && (
                                <Link
                                    href="/dashboard/nueva-mentoria"
                                    className="text-xs bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 px-3 py-1.5 rounded-full"
                                >
                                    + Crear Mentoría
                                </Link>
                            )}

                            <form action={signOut}>
                                <button
                                    type="submit"
                                    className="bg-slate-700 hover:bg-slate-600 text-white text-sm px-4 py-2 rounded-lg transition-colors"
                                >
                                    Cerrar Sesión
                                </button>
                            </form>
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
                                className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-4 py-2 rounded-lg transition-colors"
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