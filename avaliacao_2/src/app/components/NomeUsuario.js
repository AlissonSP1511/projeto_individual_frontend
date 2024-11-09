'use client'
import { useEffect, useState } from 'react'

const NomeUsuario = () => {
    const [nomeUsuario, setNomeUsuario] = useState('')

    useEffect(() => {
        // Verifica se está no ambiente do navegador antes de acessar localStorage
        if (typeof window !== 'undefined') {
            const nome = localStorage.getItem('userName')
            setNomeUsuario(nome || 'Usuário')
        }
    }, [])

    return (
        <span>{nomeUsuario}</span>
    )
}

export default NomeUsuario
