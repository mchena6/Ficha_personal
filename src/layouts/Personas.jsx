
const Personas = () => {
    
    // Función para llenar la tabla con los datos de localStorage
    const llenar_tabla = () =>{
        // Obtener la lista de personas desde localStorage
        const lista = localStorage.getItem('personas') ? JSON.parse(localStorage.getItem('personas')) : []
        // Obtener los datos de cada persona y devolver una fila por cada una
        return lista.map((persona, index) =>(
            <tr key={index}>
                <td>{persona.nombre}</td>
                <td>{persona.email}</td>
                <td>{persona.color ? persona.color : 'Ninguno'}</td>
            </tr>
        ))
    }
    
    return (
        <div>
            <h1>Personas</h1>
            <table border ="1">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Color Favorito</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Llenar la tabla con los datos de localStorage */}
                    {llenar_tabla()}
                </tbody>
            </table>

        </div>
    )
}

export default Personas