import { useRef, useState, Fragment } from "react";
import {Card} from 'primereact/card'
import {InputText} from 'primereact/inputtext'
import {SelectButton} from 'primereact/selectbutton'
import {Button} from 'primereact/button'
import { Toast } from 'primereact/toast';
import { Checkbox } from 'primereact/checkbox';
import Swal from 'sweetalert2'

const colores = [
    {label : 'Rojo', value : 'red'}, 
    {label : 'Azul', value : 'blue'}, 
    {label : 'Verde', value : 'green'}
]

const Tarjeta = () =>{
    // Toast 
    const toast = useRef(null)
    // Estados de nombre, mail, color y terminos
    const [nombre, setNombre] = useState('')
    const [color, setColor] = useState(null)
    const [email, setEmail] = useState('')

    // Estado de validacion del email y terminos
    const [email_valido, setEmail_valido] = useState(false)
    const [terminos, setTerminos] = useState(false)

    // Estado de la propiedad disabled del boton guardar
    const [boton_disabled, setBoton_disabled] = useState(false)

    // Validar el email cada vez que cambia
    if (email.trim().length > 0 && email.includes('@') && email.includes('.')){
        setEmail_valido(true)
    } else {
        setEmail_valido(false)
    }
    
    // Habilitar el boton guardar si los terminos estan aceptados, el nombre no esta vacio y el color no es nulo
    if (terminos && nombre.trim().length > 0 && email_valido && color){
        setBoton_disabled(false)
    } else {
        setBoton_disabled(true)
    }
    

    // Guardar en la local storage 
    const guardar_local_storage = (persona) =>{
        // Verificar que el nombre no esta vacio y que el color no es nulo
        // Verificar si la lista existe en el local storage
        const existe = localStorage.getItem('personas')
        // Si existe, obtener la lista parseada y agregar la nueva persona
        // Si no existe, devolver una lista vacia y agregar la nueva persona
        const lista = existe ? JSON.parse(existe) : []
        lista.push(persona)
        // Guardar la lista en el local storage en formato JSON
        localStorage.setItem('personas', JSON.stringify(lista))
    }

    // Limpiar el formulario
    const limpiar_formulario = () =>{
        setNombre('')
        setColor(null)
        setEmail('')
        setTerminos(false)
    }

    // Confirmar antes de guardar
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
            // Guardar en el local storage
            if (result.isConfirmed) {
                guardar_local_storage({nombre, email, color, terminos, created_at: new Date().toISOString()})
                // Mostrar el toast
                toast.current.show({
                    severity:'success', 
                    summary: 'Guardado', 
                    detail:'La tarjeta ha sido guardada',
                })                
                // Limpiar el formulario
                limpiar_formulario()
            }
        })
    }


    return(
        <Fragment>
            <Toast ref={toast} />
            
            <Card title="Tarjeta de Presentación">

                {/* Formulario */}
                <div className="p-fluid p-formgrid p-grid">

                    {/* Input de nombre */}
                    <span className="p-float-label">
                        <InputText
                        id="nombre"
                        value={nombre}
                        // Actualizar el estado del nombre cada vez que cambia el input
                        onChange={(e)=>setNombre(e.target.value)}
                        />
                        <label htmlFor="nombre">Nombre</label>
                    </span>

                    {/* Input de email */}
                    <span className="p-float-label">
                        <InputText
                        id="email"
                        value={email}
                        // Actualizar el estado del email cada vez que cambia el input
                        onChange={(e)=>setEmail(e.target.value)}
                        />
                        <label htmlFor="email">Email</label>
                    </span>

                    {/* Select de colores */}
                    <div>
                        <small>Color</small>
                        <SelectButton
                        value={color}
                        options={colores}
                        // Actualizar el estado del color cada vez que cambia el select
                        onChange={(e)=>setColor(e.value)}
                        />
                    </div>

                    {/* Checkbox de terminos */}
                    <div className="card flex justify-content-center">
                        {/* Actualizar el estado de terminos cada vez que cambia el checkbox */}
                        <Checkbox onChange={e => setTerminos(e.checked)} checked={terminos}></Checkbox>
                        <label htmlFor="terminos">Acepto los terminos</label>
                    </div>

                    {/* Tarjeta de presentacion */}
                    <div style={{
                        backgroundColor: color || 'transparent',
                        borderRadius:12,
                        padding:12
                    }}>
                        {/* Mostrar '________' si el nombre esta vacio */}
                        <h2>Hola, soy {nombre || '________'}</h2>
                        <h2>Mi email es: {email}</h2>
                        {/* Mostrar 'Ninguno' si el color es nulo */}
                        <p>Mi color favorito es {color ? colores.find((item)=>item.value === color)?.label : 'Ninguno'}</p>
                    </div>

                    {/* Boton para guardar el formulario */}
                    <div>
                        <Button
                            label="Guardar"
                            disabled={boton_disabled}
                            icon="pi pi-check"
                            severity="success"
                            // Al hacer click, confirmar antes de guardar
                            onClick={confirmar_formulario}
                        />
                    </div>
                    {/* Boton para limpiar el formulario */}
                    <div>
                        <Button
                            label="Limpiar"
                            icon="pi pi-times"
                            severity="danger"
                            onClick={limpiar_formulario}
                        />
                    </div>
                </div>                
            </Card>
            
        </Fragment>    
        )
    
    }


export default Tarjeta