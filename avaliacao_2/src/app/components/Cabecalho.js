// avaliacao_2/src/app/components/Cabecalho.js
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