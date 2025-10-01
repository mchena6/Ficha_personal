// Importación de hooks y componentes necesarios
import { Fragment, useEffect, useState } from "react"
import { Card } from "primereact/card"
import { Button } from "primereact/button"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// Clave utilizada en localStorage para guardar las personas
const PERSONAS_KEY = 'personas'

// Función auxiliar que traduce el valor del color guardado (ej. 'red')
// a un label amigable ('Rojo', 'Verde', etc.)
const color_label = (c)=> 
    c === 'red' ? 'Rojo' : 
    c==='blue' ? 'Azul' : 
    c==='green' ? 'Verde' : 'Gris'

// Componente principal Personas
const Personas = () =>{
    const navigate = useNavigate()             // Hook para redireccionar entre rutas
    const [personas, setPersonas] = useState([]) // Estado que guarda la lista de personas

    // Función que obtiene las personas guardadas en localStorage
    const cargar_personas = () =>{
        const data = localStorage.getItem(PERSONAS_KEY) // Obtiene la cadena de texto
        const arr = data ? JSON.parse(data) : []        // Si hay datos los parsea, si no devuelve []
        setPersonas(arr)                                // Actualiza el estado
    }

    // useEffect se ejecuta al montar el componente para cargar las personas existentes
    useEffect(()=>{
        cargar_personas()
    },[])

    // Función que devuelve la etiqueta del color en el datatable
    const color_template = (row) => color_label(row.color)

    // Función que devuelve una fecha formateada para mostrar en el datatable
    const fecha_template = (row) => {
        const date = new Date(row.created_at)   // Convierte la fecha guardada a objeto Date
        // Si no hay fecha válida, muestra la original
        return(
            <Fragment>
                {date ? `Dia ${date.getDate()} del ${date.getMonth()} del ${date.getFullYear()}`: row?.created_at}        
            </Fragment>
        )
    }

    // Función para eliminar una persona dado su índice en el array
    const borrar_persona = (id) =>{
        // Lanza una alerta de confirmación con SweetAlert2
        Swal.fire({
            title: '¿Estas seguro?',
            text: "No podras revertir esto",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si, borrar',
            cancelButtonText: 'No, cancelar'
        }).then((action)=>{
            if (action.isConfirmed){ // Si el usuario confirma el borrado
                const data = localStorage.getItem(PERSONAS_KEY)
                const arr = data ? JSON.parse(data) : []
                arr.splice(id, 1) // Elimina la persona en el índice indicado
                localStorage.setItem(PERSONAS_KEY, JSON.stringify(arr)) // Guarda el array actualizado
                cargar_personas() // Refresca la lista en pantalla
                Swal.fire('Borrado', 'La persona ha sido borrada', 'success') // Mensaje de éxito
            }
        })
    }

    // Función que renderiza las acciones (botones de eliminar y editar) en la tabla
    const acciones_template = (row, opts) =>{
        const id = opts.rowIndex // Obtiene el índice de la fila actual
        return(
            <div>
                <Button 
                    icon='pi pi-trash' 
                    label="Eliminar" 
                    onClick={()=> borrar_persona(id)} // Borra la persona
                />
                <Button 
                    icon='pi pi-pencil' 
                    label="Editar" 
                    onClick={() => navigate(`/tarjeta/${id}`)} // Navega a la ruta de edición
                />
            </div>
        )
    }

    // Renderizado del componente
    return(
        <Card title='Personas guardadas'>
            {/* Botones de navegación */}
            <div>
                <Button label="Refrescar" onClick={() => cargar_personas()}/>
                <Button label='Ir a la home' onClick={()=> navigate('/')}/>
                <Button label='Nueva persona' onClick={()=> navigate('/tarjeta')}/> 
            </div>

            {/* Tabla de personas */}
            <DataTable value={personas} emptyMessage='No hay personas registradas'>
                <Column field='nombre' header='Nombre'/>
                <Column field='email' header='Email'/>
                <Column header='Color' body={color_template}/>
                <Column header='Fecha de creacion' body={fecha_template}/>
                <Column header= 'Acciones' body={acciones_template}/>
            </DataTable>
        </Card>
    )
}

export default Personas
