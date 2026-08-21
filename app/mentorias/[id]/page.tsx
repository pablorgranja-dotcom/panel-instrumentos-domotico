import { createClient } from "@/lib/supabase-server"
import { notFound, redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import Link from "next/link"

interface Props {
    params: {
        id: string
    }
}

export default async function MentoriaDetailPage({ params }: Props) {
    const supabase = await createClient()

    // 1. Obtener datos de la sesión actual
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

    // 2. Consultar el detalle de la mentoría especificada por ID
    const { data: mentoria } = await supabase
        .from("mentorias")
        .select(`
            *,
            profiles:mentor_id (full_name, email, github_username),
            categorias:categoria_id (nombre)
        `)
        .eq("id", params.id)
        .single()

    if (!mentoria) {
        notFound()
    }

    // Server Action para procesar la postulación
    async function postularMentoria(formData: FormData) {
        "use server"
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) redirect("/login")

        const mensaje_motivacion = formData.get("mensaje_motivacion") as string

        await supabase.from("solicitudes").insert({
            mentoria_id: params.id,
            aprendiz_id: user.id,
            mensaje_motivacion,
            estado: "pendiente"
        })

        revalidatePath("/dashboard")
        redirect("/dashboard")
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
                            {mentoria.categorias?.nombre ?? "Categoría"}
                        </span>
                        <h1 className="text-3xl font-bold text-white mt-3">{mentoria.titulo}</h1>
                        <p className="text-slate-400 text-sm mt-1">
                            Impartido por: <span className="text-slate-200 font-medium">{mentoria.profiles?.full_name}</span>
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
                    <p className="text-slate-400 text-sm">
                        Envía un mensaje al mentor explicando tus objetivos de aprendizaje para coordinar la sesión.
                    </p>

                    <form action={postularMentoria} className="space-y-4">
                        <textarea
                            name="mensaje_motivacion"
                            required
                            rows={3}
                            placeholder="Ej. Hola, estoy estudiando desarrollo web y me gustaría reforzar mis conocimientos en..."
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 text-sm"
                        ></textarea>

                        <button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-2.5 rounded-lg text-sm transition-colors"
                        >
                            Enviar Solicitud
                        </button>
                    </form>
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