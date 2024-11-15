// projeto_individual_frontend/avaliacao_2/src/components/Cabecalho.js
export default function Cabecalho(props){
    return (
        <>
            <div>
                <h1>{props.titulo}</h1>
                <p>{props.subtitulo}</p>
            </div>
        </>
    )
}