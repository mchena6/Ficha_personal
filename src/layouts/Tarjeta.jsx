import { useRef, useState, Fragment } from "react";
import {Card} from 'primereact/card'
import {InputText} from 'primereact/inputtext'
import {SelectButton} from 'primereact/selectbutton'
import {Button} from 'primereact/button'
import { Toast } from 'primereact/toast';
import Swal from 'sweetalert2'

const colores = [
    {label : 'Rojo', value : 'red'}, 
    {label : 'Azul', value : 'blue'}, 
    {label : 'Verde', value : 'green'}
]

const Tarjeta = () =>{
    // Toast 
    const toast = useRef(null)
    // Estados de nombre y color
    const [nombre, setNombre] = useState('')
    const [color, setColor] = useState(null)

    // Guardar en la local storage 
    const guardar_local_storage = (persona) =>{
        // Verificar que el nombre no esta vacio y que el color no es nulo
        if (nombre.trim().length >0 && color){
            // Verificar si la lista existe en el local storage
            const existe = localStorage.getItem('personas')
            // Si existe, obtener la lista parseada y agregar la nueva persona
            // Si no existe, devolver una lista vacia y agregar la nueva persona
            const lista = existe ? JSON.parse(existe) : []
            lista.push(persona)
            // Guardar la lista en el local storage en formato JSON
            localStorage.setItem('personas', JSON.stringify(lista))
        }
    }

    const confirmar_formulario = () =>{
        Swal.fire({
            title: '¿Estas seguro?',
            text: "No podras revertir esto",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, guardar!'
        }).then((result) => {
            if (result.isConfirmed) {
                guardar_local_storage({nombre, color})
                toast.current.show({
                    severity:'success', 
                    summary: 'Guardado', 
                    detail:'La tarjeta ha sido guardada',
                })                
                // Limpiar el formulario
                setNombre('')
                setColor(null)
            }
        })
    }


    return(
        <Fragment>
            <Toast ref={toast} />

            <Card title="Tarjeta de Presentación">
                <div className="p-fluid p-formgrid p-grid">
                    <span className="p-float-label">
                        <InputText
                        id="nombre"
                        value={nombre}
                        onChange={(e)=>setNombre(e.target.value)}
                        />
                        <label htmlFor="nombre">Nombre</label>
                    </span>

                    <div>
                        <small>Color</small>
                        <SelectButton
                        value={color}
                        options={colores}
                        onChange={(e)=>setColor(e.value)}
                        />
                    </div>


                    <div style={{
                        backgroundColor: color || 'transparent',
                        borderRadius:12,
                        padding:12
                    }}>
                        <h2>Hola, soy {nombre || '________'}</h2>
                        <p>Mi color favorito es {color ? colores.find((item)=>item.value === color)?.label : 'Ninguno'}</p>
                    </div>

                    <div>
                        <Button
                            label="Guardar"
                            icon="pi pi-check"
                            severity="success"
                            onClick={confirmar_formulario}
                        />
                    </div>
                </div>                
            </Card>
            
        </Fragment>    
        )
    
    }


export default Tarjeta