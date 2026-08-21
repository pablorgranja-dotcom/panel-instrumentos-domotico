"use server"

import { createClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"

export async function cambiarEstadoSolicitud(solicitudId: string, nuevoEstado: "aceptada" | "rechazada") {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return

    await supabase
        .from("solicitudes")
        .update({ estado: nuevoEstado })
        .eq("id", solicitudId)

    revalidatePath("/dashboard")
}