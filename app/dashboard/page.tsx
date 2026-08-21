import { createClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function DashboardPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // Obtener perfil con rol
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    // Lógica según rol
    let misMentorias = []
    let misSolicitudes = []

    if (profile?.role === 'mentor') {
        const { data } = await supabase
            .from('mentorias')
            .select('*')
            .eq('mentor_id', user.id)
            .order('created_at', { ascending: false })
        misMentorias = data || []
    } else if (profile?.role === 'aprendiz') {
        const { data } = await supabase
            .from('solicitudes')
            .select('*, mentorias(*)')
            .eq('aprendiz_id', user.id)
            .order('created_at', { ascending: false })
        misSolicitudes = data || []
    }

    return (
        <main className="max-w-6xl mx-auto px-6 py-10 space-y-8">
            {/* Header del Dashboard */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">Hola, {profile?.full_name}</h1>
                    <p className="text-slate-400 text-sm">
                        Rol actual: <span className="text-indigo-400 capitalize font-medium">{profile?.role}</span>
                    </p>
                </div>
                {profile?.role === 'mentor' && (
                    <Link
                        href="/dashboard/nueva-mentoria"
                        className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                    >
                        + Crear Nueva Mentoría
                    </Link>
                )}
            </div>

            {/* Panel según Rol */}
            {profile?.role === 'mentor' && (
                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-white">Mis Mentorías Publicadas</h2>
                    {misMentorias.length === 0 ? (
                        <p className="text-slate-400 text-sm">Aún no has creado ninguna oferta de mentoría.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {misMentorias.map((m: any) => (
                                <div key={m.id} className="bg-slate-800 p-5 rounded-xl border border-slate-700 flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-white">{m.titulo}</h3>
                                        <p className="text-xs text-indigo-400 mt-1">{m.idioma_o_tecnologia} • {m.duracion_minutos} min</p>
                                        <span className={`inline-block text-xs mt-2 px-2 py-0.5 rounded ${m.estado === 'activa' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'}`}>
                                            {m.estado}
                                        </span>
                                    </div>
                                    <div className="flex gap-2 text-xs">
                                        <Link href={`/dashboard/mis-mentorias/${m.id}/editar`} className="text-slate-300 hover:text-white bg-slate-700 px-3 py-1.5 rounded">
                                            Editar
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            )}

            {profile?.role === 'aprendiz' && (
                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-white">Mis Solicitudes Enviadas</h2>
                    {misSolicitudes.length === 0 ? (
                        <p className="text-slate-400 text-sm">No has postulado a ninguna mentoría todavía.</p>
                    ) : (
                        <div className="space-y-3">
                            {misSolicitudes.map((s: any) => (
                                <div key={s.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold text-white">{s.mentorias?.titulo}</h3>
                                        <p className="text-xs text-slate-400 mt-1">Mensaje: "{s.mensaje_motivacion}"</p>
                                    </div>
                                    <span className={`text-xs px-2.5 py-1 rounded font-medium ${s.estado === 'aceptada' ? 'bg-green-500/10 text-green-400' : s.estado === 'rechazada' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                                        {s.estado}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            )}
        </main>
    )
}