import { createClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export default async function NuevaMentoriaPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // Cargar categorías existentes
    const { data: categorias } = await supabase.from('categorias').select('*')

    // Server Action para procesar la creación
    async function crearMentoria(formData: FormData) {
        "use server"
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return

        const titulo = formData.get("titulo") as string
        const descripcion = formData.get("descripcion") as string
        const idioma_o_tecnologia = formData.get("idioma_o_tecnologia") as string
        const duracion_minutos = parseInt(formData.get("duracion_minutos") as string)
        const categoria_id = formData.get("categoria_id") as string

        await supabase.from("mentorias").insert({
            mentor_id: user.id,
            categoria_id,
            titulo,
            descripcion,
            idioma_o_tecnologia,
            duracion_minutos,
            estado: "activa"
        })

        revalidatePath("/")
        revalidatePath("/dashboard")
        redirect("/dashboard")
    }

    return (
        <main className="max-w-2xl mx-auto px-6 py-10">
            <h1 className="text-2xl font-bold text-white mb-6">Crear Oferta de Mentoría</h1>

            <form action={crearMentoria} className="bg-slate-800 p-6 rounded-xl border border-slate-700 space-y-4">
                <div>
                    <label className="block text-sm text-slate-300 mb-1">Título de la Mentoría</label>
                    <input
                        name="titulo"
                        type="text"
                        required
                        placeholder="Ej. Dominando React y Next.js App Router"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-slate-300 mb-1">Tecnología / Idioma</label>
                        <input
                            name="idioma_o_tecnologia"
                            type="text"
                            required
                            placeholder="Ej. TypeScript / Inglés"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-300 mb-1">Duración (minutos)</label>
                        <input
                            name="duracion_minutos"
                            type="number"
                            defaultValue={60}
                            required
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm text-slate-300 mb-1">Categoría</label>
                    <select
                        name="categoria_id"
                        required
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                    >
                        {categorias?.map((cat: any) => (
                            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm text-slate-300 mb-1">Descripción detallada</label>
                    <textarea
                        name="descripcion"
                        rows={4}
                        required
                        placeholder="Explica qué temas cubrirán en la sesión..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                    ></textarea>
                </div>

                <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg transition-colors"
                >
                    Publicar Mentoría
                </button>
            </form>
        </main>
    )
}