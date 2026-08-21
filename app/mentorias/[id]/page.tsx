import { createClient } from "@/lib/supabase-server"
import { notFound, redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import Link from "next/link"

interface Props {
    params: Promise<{
        id: string
    }>
}

export default async function MentoriaDetailPage({ params }: Props) {
    // Resolver la promesa de parámetros en Next.js
    const { id } = await params
    const supabase = await createClient()

    // 1. Obtener usuario actual y perfil
    const { data: { user } } = await supabase.auth.getUser()

    let userRole = null
    if (user) {
        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single()
        userRole = profile?.role
    }

    // 2. Consulta simple y directa de la mentoría
    const { data: mentoria, error } = await supabase
        .from("mentorias")
        .select("*")
        .eq("id", id)
        .maybeSingle()

    if (error || !mentoria) {
        notFound()
    }

    // 3. Consultar datos adicionales del mentor y la categoría de forma independiente para evitar fallos de JOIN
    let mentorName = "Mentor de la plataforma"
    if (mentoria.mentor_id) {
        const { data: mentorProfile } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", mentoria.mentor_id)
            .maybeSingle()
        if (mentorProfile?.full_name) {
            mentorName = mentorProfile.full_name
        }
    }

    let categoriaNombre = "General"
    if (mentoria.categoria_id) {
        const { data: catData } = await supabase
            .from("categorias")
            .select("nombre")
            .eq("id", mentoria.categoria_id)
            .maybeSingle()
        if (catData?.nombre) {
            categoriaNombre = catData.nombre
        }
    }

    // 4. Verificar si el aprendiz ya solicitó esta mentoría
    let yaInscrito = false
    let estadoSolicitud = null

    if (user && userRole === "aprendiz") {
        const { data: solicitudExistente } = await supabase
            .from("solicitudes")
            .select("id, estado")
            .eq("mentoria_id", id)
            .eq("aprendiz_id", user.id)
            .maybeSingle()

        if (solicitudExistente) {
            yaInscrito = true
            estadoSolicitud = solicitudExistente.estado
        }
    }

    // Server Action para procesar la postulación
    async function postularMentoria(formData: FormData) {
        "use server"
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) redirect("/login")

        const mensaje_motivacion = formData.get("mensaje_motivacion") as string

        const { error: insertError } = await supabase.from("solicitudes").insert({
            mentoria_id: id,
            aprendiz_id: user.id,
            mensaje_motivacion,
            estado: "pendiente"
        })

        if (!insertError) {
            revalidatePath("/dashboard")
            revalidatePath(`/mentorias/${id}`)
            redirect("/dashboard")
        }
    }

    return (
        <main className="max-w-4xl mx-auto px-6 py-12 space-y-8">
            <Link href="/" className="text-sm text-indigo-400 hover:underline">
                &larr; Volver al inicio
            </Link>

            <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 space-y-6">
                <div className="flex flex-wrap justify-between items-start gap-4">
                    <div>
                        <span className="text-xs font-semibold bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full border border-indigo-500/20">
                            {categoriaNombre}
                        </span>
                        <h1 className="text-3xl font-bold text-white mt-3">{mentoria.titulo}</h1>
                        <p className="text-slate-400 text-sm mt-1">
                            Impartido por: <span className="text-slate-200 font-medium">{mentorName}</span>
                        </p>
                    </div>

                    <div className="bg-slate-900 px-4 py-3 rounded-xl border border-slate-700 text-right">
                        <span className="block text-xs text-slate-400">Duración</span>
                        <span className="text-lg font-bold text-indigo-400">{mentoria.duracion_minutos} min</span>
                    </div>
                </div>

                <hr className="border-slate-700" />

                <div>
                    <h2 className="text-lg font-bold text-white mb-2">Sobre esta mentoría</h2>
                    <p className="text-slate-300 leading-relaxed whitespace-pre-line">{mentoria.descripcion}</p>
                </div>

                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/60 flex items-center justify-between text-sm">
                    <span className="text-slate-400">Tecnología / Idioma principal:</span>
                    <span className="font-semibold text-white">{mentoria.idioma_o_tecnologia}</span>
                </div>
            </div>

            {/* Formulario de Postulación exclusivo para Aprendices */}
            {userRole === "aprendiz" && (
                <section className="bg-slate-800 rounded-2xl p-8 border border-slate-700 space-y-4">
                    <h2 className="text-xl font-bold text-white">Postular a esta Mentoría</h2>

                    {yaInscrito ? (
                        <div className="bg-indigo-950/40 border border-indigo-500/30 p-6 rounded-xl text-center space-y-2">
                            <p className="text-emerald-400 font-bold text-base">
                                &#10003; Ya te has postulado a esta mentoría
                            </p>
                            <p className="text-slate-300 text-xs">
                                Estado actual de la solicitud: <span className="uppercase font-extrabold text-amber-400">{estadoSolicitud}</span>
                            </p>
                            <button
                                disabled
                                className="mt-3 bg-slate-700 text-slate-400 font-medium px-6 py-2.5 rounded-lg text-sm cursor-not-allowed opacity-60"
                            >
                                Solicitud Enviada (No puedes volver a solicitarla)
                            </button>
                        </div>
                    ) : (
                        <form action={postularMentoria} className="space-y-4">
                            <p className="text-slate-400 text-sm">
                                Escribe un mensaje breve al mentor explicando lo que deseas aprender durante la tutoría.
                            </p>
                            <textarea
                                name="mensaje_motivacion"
                                required
                                rows={3}
                                placeholder="Ej. Hola, estoy aprendiendo sobre este tema y me gustaría ayuda práctica..."
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 text-sm"
                            ></textarea>

                            <button
                                type="submit"
                                className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-2.5 rounded-lg text-sm transition-colors"
                            >
                                Enviar Solicitud de Mentoría
                            </button>
                        </form>
                    )}
                </section>
            )}

            {!user && (
                <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700 text-center space-y-3">
                    <p className="text-slate-300 text-sm">Para postular a esta mentoría debes iniciar sesión con una cuenta de aprendiz.</p>
                    <Link href="/login" className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors">
                        Iniciar Sesión
                    </Link>
                </div>
            )}
        </main>
    )
}