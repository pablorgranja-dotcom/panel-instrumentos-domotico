import { createClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { cambiarEstadoSolicitud } from "./actions"

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect("/login")

    // Obtener perfil
    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

    const role = profile?.role || "aprendiz"

    // 1. Datos para Aprendiz: solicitudes e historia de tutorías
    let misSolicitudes: any[] = []
    let totalTutoriasTomadas = 0

    if (role === "aprendiz") {
        const { data: solicitudes } = await supabase
            .from("solicitudes")
            .select(`
                *,
                mentorias:mentoria_id (titulo, idioma_o_tecnologia, duracion_minutos)
            `)
            .eq("aprendiz_id", user.id)

        misSolicitudes = solicitudes || []
        totalTutoriasTomadas = misSolicitudes.length
    }

    // 2. Datos para Mentor / Administrador: solicitudes recibidas de aprendices
    let solicitudesRecibidas: any[] = []
    let misMentorias: any[] = []

    if (role === "mentor" || role === "administrador") {
        const { data: mentorias } = await supabase
            .from("mentorias")
            .select("id, titulo")
            .eq(role === "mentor" ? "mentor_id" : "mentor_id", role === "mentor" ? user.id : user.id)

        misMentorias = mentorias || []

        const { data: solicitudes } = await supabase
            .from("solicitudes")
            .select(`
                *,
                mentorias:mentoria_id (titulo),
                profiles:aprendiz_id (full_name, email)
            `)

        solicitudesRecibidas = solicitudes || []
    }

    // 3. Datos para Administrador: contadores globales
    let totalMentoriasGlobal = 0
    let totalSolicitudesGlobal = 0

    if (role === "administrador") {
        const { count: mentoriasCount } = await supabase.from("mentorias").select("*", { count: 'exact', head: true })
        const { count: solicitudesCount } = await supabase.from("solicitudes").select("*", { count: 'exact', head: true })
        totalMentoriasGlobal = mentoriasCount || 0
        totalSolicitudesGlobal = solicitudesCount || 0
    }

    return (
        <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">
            {/* Header de Perfil */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Hola, {profile?.full_name || "Usuario"}</h1>
                    <p className="text-slate-400 text-sm">
                        Rol asignado: <span className="text-indigo-400 font-semibold uppercase">{role}</span>
                    </p>
                </div>

                {(role === "mentor" || role === "administrador") && (
                    <Link
                        href="/dashboard/nueva-mentoria"
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2 rounded-xl text-sm transition-colors"
                    >
                        + Crear Nueva Mentoría
                    </Link>
                )}
            </div>

            {/* VISTA Y CONTADOR PARA EL APRENDIZ */}
            {role === "aprendiz" && (
                <section className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-slate-800 p-6 rounded-2xl border border-indigo-500/30 text-center">
                            <span className="text-slate-400 text-xs uppercase tracking-wider block font-semibold">
                                Total de Tutorías Inscriptas
                            </span>
                            <span className="text-4xl font-extrabold text-indigo-400 mt-2 block">
                                {totalTutoriasTomadas}
                            </span>
                        </div>
                    </div>

                    <h2 className="text-xl font-bold text-white">Mis Tutorías Postuladas</h2>

                    {misSolicitudes.length === 0 ? (
                        <p className="text-slate-400 text-sm">Aún no te has inscrito en ninguna mentoría.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {misSolicitudes.map((sol) => (
                                <div key={sol.id} className="bg-slate-800 p-5 rounded-xl border border-slate-700 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-lg font-bold text-white">{sol.mentorias?.titulo}</h3>
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full uppercase border ${
                                            sol.estado === 'aceptada' 
                                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                                                : sol.estado === 'rechazada' 
                                                ? 'bg-red-500/10 text-red-400 border-red-500/30' 
                                                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                        }`}>
                                            {sol.estado}
                                        </span>
                                    </div>
                                    <p className="text-slate-400 text-xs">Mensaje: "{sol.mensaje_motivacion}"</p>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            )}

            {/* GESTIÓN DE SOLICITUDES PARA MENTOR Y ADMINISTRADOR */}
            {(role === "mentor" || role === "administrador") && (
                <section className="space-y-6">
                    <h2 className="text-xl font-bold text-white">Solicitudes de Aprendices Recibidas</h2>

                    {solicitudesRecibidas.length === 0 ? (
                        <p className="text-slate-400 text-sm">No hay solicitudes pendientes de aprendices por el momento.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {solicitudesRecibidas.map((sol) => (
                                <div key={sol.id} className="bg-slate-800 p-5 rounded-xl border border-slate-700 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-bold text-white">{sol.mentorias?.titulo}</h3>
                                            <p className="text-xs text-indigo-300 font-medium mt-0.5">
                                                Aprendiz: {sol.profiles?.full_name || "Estudiante"}
                                            </p>
                                        </div>
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full uppercase border ${
                                            sol.estado === 'aceptada' 
                                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                                                : sol.estado === 'rechazada' 
                                                ? 'bg-red-500/10 text-red-400 border-red-500/30' 
                                                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                        }`}>
                                            {sol.estado}
                                        </span>
                                    </div>

                                    <p className="text-slate-300 text-xs bg-slate-900/60 p-3 rounded-lg border border-slate-700/50 italic">
                                        "{sol.mensaje_motivacion}"
                                    </p>

                                    {/* Botones para Aceptar o Rechazar la Mentoría */}
                                    {sol.estado === "pendiente" && (
                                        <div className="flex gap-2 pt-1">
                                            <form action={async () => {
                                                "use server"
                                                await cambiarEstadoSolicitud(sol.id, "aceptada")
                                            }} className="flex-1">
                                                <button
                                                    type="submit"
                                                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-1.5 px-3 rounded-lg text-xs transition-colors"
                                                >
                                                    Aceptar Mentoría
                                                </button>
                                            </form>

                                            <form action={async () => {
                                                "use server"
                                                await cambiarEstadoSolicitud(sol.id, "rechazada")
                                            }} className="flex-1">
                                                <button
                                                    type="submit"
                                                    className="w-full bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 font-medium py-1.5 px-3 rounded-lg text-xs transition-colors"
                                                >
                                                    Rechazar
                                                </button>
                                            </form>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            )}

            {/* MÉTRICAS GLOBALES DEL ADMINISTRADOR */}
            {role === "administrador" && (
                <section className="space-y-4 pt-6 border-t border-slate-700">
                    <h2 className="text-xl font-bold text-white">Resumen Global de Plataforma</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 text-center">
                            <span className="text-slate-400 text-xs uppercase font-semibold">Total Mentorías en Plataforma</span>
                            <span className="text-4xl font-bold text-indigo-400 mt-2 block">{totalMentoriasGlobal}</span>
                        </div>
                        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 text-center">
                            <span className="text-slate-400 text-xs uppercase font-semibold">Total Solicitudes Registradas</span>
                            <span className="text-4xl font-bold text-emerald-400 mt-2 block">{totalSolicitudesGlobal}</span>
                        </div>
                    </div>
                </section>
            )}
        </main>
    )
}