import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase-server"

// Interfaz TypeScript para los datos obtenidos de la API externa de GitHub
interface GitHubUser {
  login: string
  name: string
  avatar_url: string
  bio: string
  public_repos: number
  followers: number
  html_url: string
}

// Función helper para consumir la API REST pública de GitHub
async function getGitHubProfile(username: string): Promise<GitHubUser | null> {
  try {
    const res = await fetch(`https://api.github.com/users/${username}`, {
      next: { revalidate: 3600 }, // Caché dinámico de 1 hora
    })

    if (!res.ok) return null
    return await res.json()
  } catch (error) {
    console.error(`Error consultando API de GitHub para ${username}:`, error)
    return null
  }
}

export default async function HomePage() {
  const supabase = await createClient()

  // 1. Consultar publicaciones activas en Supabase
  const { data: mentorias } = await supabase
    .from("mentorias")
    .select(`
      id,
      titulo,
      descripcion,
      idioma_o_tecnologia,
      duracion_minutos,
      profiles:mentor_id (full_name, github_username)
    `)
    .eq("estado", "activa")
    .order("created_at", { ascending: false })
    .limit(6)

  // 2. Consumir API Externa para perfiles de mentores destacados (ejemplos predefinidos + dynamic fetch)
  const mentoresDestacados = ["torvalds", "gaearon", "suckarpunch"]
  const perfilesGitHub = await Promise.all(
    mentoresDestacados.map((user) => getGitHubProfile(user))
  )

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Aprende Código e Idiomas con <span className="text-indigo-400">Mentores Expertos</span>
        </h1>
        <p className="text-slate-400 text-lg">
          Conecta con instructores calificados, postula a sesiones personalizadas y potencia tus habilidades tecnicas.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/register"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-3 rounded-lg transition-colors"
          >
            Comenzar Ahora
          </Link>
          <a
            href="#mentorias"
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium px-6 py-3 rounded-lg transition-colors border border-slate-700"
          >
            Explorar Mentorías
          </a>
        </div>
      </section>

      {/* Sección 1: Mentorías Disponibles (Datos de Supabase) */}
      <section id="mentorias" className="space-y-6">
        <div className="flex justify-between items-end border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Mentorías Recientes</h2>
            <p className="text-slate-400 text-sm">Explora las últimas ofertas publicadas</p>
          </div>
        </div>

        {!mentorias || mentorias.length === 0 ? (
          <div className="bg-slate-800/50 rounded-xl p-8 text-center border border-slate-800">
            <p className="text-slate-400">Aún no hay mentorías activas en la plataforma.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentorias.map((m: any) => (
              <div
                key={m.id}
                className="bg-slate-800 rounded-xl p-6 border border-slate-700 flex flex-col justify-between hover:border-slate-600 transition-colors"
              >
                <div className="space-y-3">
                  <span className="text-xs font-semibold bg-indigo-500/10 text-indigo-400 px-2.5 py-1 rounded-full border border-indigo-500/20">
                    {m.idioma_o_tecnologia}
                  </span>
                  <h3 className="text-lg font-bold text-white">{m.titulo}</h3>
                  <p className="text-slate-400 text-sm line-clamp-2">{m.descripcion}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                  <span>Por: {m.profiles?.full_name ?? "Mentor"}</span>
                  <Link
                    href={`/mentorias/${m.id}`}
                    className="text-indigo-400 hover:underline font-medium"
                  >
                    Ver detalle &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Sección 2: Consumo de API Externa de GitHub */}
      <section className="space-y-6 bg-slate-800/40 p-8 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white">Comunidad de Mentores en GitHub</h2>
          <p className="text-slate-400 text-sm">
            Datos integrados en tiempo real mediante la GitHub REST API
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {perfilesGitHub.map((profile) =>
            profile ? (
              <div
                key={profile.login}
                className="bg-slate-800 rounded-xl p-5 border border-slate-700 space-y-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={profile.avatar_url}
                    alt={profile.name ?? profile.login}
                    className="w-12 h-12 rounded-full border border-slate-600"
                  />
                  <div>
                    <h4 className="font-bold text-white">{profile.name ?? profile.login}</h4>
                    <p className="text-xs text-indigo-400">@{profile.login}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2">
                  {profile.bio ?? "Desarrollador activo en la comunidad Open Source."}
                </p>

                <div className="flex justify-between text-xs text-slate-500 pt-2 border-t border-slate-700">
                  <span>Repositorios: {profile.public_repos}</span>
                  <span>Seguidores: {profile.followers}</span>
                </div>
              </div>
            ) : null
          )}
        </div>
      </section>
    </main>
  )
}