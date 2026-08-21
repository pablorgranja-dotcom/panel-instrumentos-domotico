"use client"

import { useFormStatus } from "react-dom"

interface Props {
    mensaje?: string
}

export default function ConfirmSubmitButton({ mensaje = "¿Estás seguro de eliminar esta publicación?" }: Props) {
    const { pending } = useFormStatus()

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!confirm(mensaje)) {
            e.preventDefault()
        }
    }

    return (
        <button
            type="submit"
            onClick={handleClick}
            disabled={pending}
            className="bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600/30 text-xs px-3 py-1.5 rounded transition-colors disabled:opacity-50"
        >
            {pending ? "Eliminando..." : "Eliminar"}
        </button>
    )
}