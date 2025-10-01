// Importaciones necesarias de React y librerías externas
import { useRef, useState, Fragment, useEffect } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { SelectButton } from "primereact/selectbutton";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Checkbox } from "primereact/checkbox";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";

// Lista de opciones de colores disponibles
const colores = [
  { label: "Rojo", value: "red" },
  { label: "Azul", value: "blue" },
  { label: "Verde", value: "green" },
];

const Tarjeta = () => {
  // Obtiene el parámetro `id` de la URL (si existe)
  const { id } = useParams();
  // Convierte el id en número o lo deja como null si no existe → sirve para saber si estamos editando
  const edit_index = id ? parseInt(id) : null;
  // Hook para navegación programática
  const navigate = useNavigate();

  // Referencia al componente Toast (notificación emergente)
  const toast = useRef(null);

  // Estados del formulario
  const [nombre, setNombre] = useState("");      // Nombre de la persona
  const [color, setColor] = useState(null);      // Color seleccionado
  const [email, setEmail] = useState("");        // Email ingresado
  const [email_valido, setEmail_valido] = useState(false); // Validez del email
  const [terminos, setTerminos] = useState(false);         // Checkbox términos
  const [boton_disabled, setBoton_disabled] = useState(true); // Botón Guardar habilitado o no

  // Cargar datos de persona en modo edición
  useEffect(() => {
    if (edit_index !== null) {
      const data = localStorage.getItem("personas");   // Trae lista de personas
      const arr = data ? JSON.parse(data) : [];
      const persona = arr[edit_index];                 // Busca persona en la posición edit_index

      // Si existe, setea los estados del formulario con esos valores
      if (persona) {
        setNombre(persona.nombre || "");
        setEmail(persona.email || "");
        setColor(persona.color || "");
        setTerminos(!!persona.terminos); // convierte a booleano
      }
    }
  }, [edit_index]);

  // Validación de email (se actualiza cada vez que cambia el valor)
  useEffect(() => {
    if (
      email.trim().length > 0 &&
      email.includes("@") &&
      email.includes(".")
    ) {
      setEmail_valido(true);
    } else {
      setEmail_valido(false);
    }
  }, [email]);

  // Validación del botón Guardar
  // Solo se habilita si: términos aceptados + nombre no vacío + email válido + color seleccionado
  useEffect(() => {
    if (terminos && nombre.trim().length > 0 && email_valido && color) {
      setBoton_disabled(false);
    } else {
      setBoton_disabled(true);
    }
  }, [terminos, nombre, email_valido, color]);

  // Guardar persona en LocalStorage
  const guardar_local_storage = (persona) => {
    const existente = localStorage.getItem("personas");
    const lista = existente ? JSON.parse(existente) : [];

    // Si está editando, actualiza el objeto existente
    if (edit_index !== null && lista[edit_index]) {
      lista[edit_index] = {
        ...lista[edit_index],
        ...persona,
        updated_at: new Date(),
      };
    } else {
      // Si es nuevo, lo agrega con la fecha de creación
      lista.push({ ...persona, created_at: new Date() });
    }
    localStorage.setItem("personas", JSON.stringify(lista));
  };

  // Limpia el formulario (resetea estados)
  const limpiar_formulario = () => {
    setNombre("");
    setColor(null);
    setEmail("");
    setTerminos(false);
  };

  // Confirmar guardado usando SweetAlert2
  const confirmar_formulario = () => {
    Swal.fire({
      title: "¿Estas seguro?",
      text: "No podras revertir esto",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, guardar!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Guardar datos
        guardar_local_storage({
          nombre,
          email,
          color,
          terminos,
        });

        // Mostrar notificación (Toast de PrimeReact)
        toast.current.show({
          severity: "success",
          summary: "Guardado",
          detail: "La tarjeta ha sido guardada",
        });

        // Limpiar formulario y redirigir a lista de personas
        limpiar_formulario();
        navigate("/personas");
      }
    });
  };

  return (
    <Fragment>
      {/* Componente Toast para mostrar mensajes */}
      <Toast ref={toast} />

      {/* Card principal */}
      <Card title="Tarjeta de Presentación">
        <div className="p-fluid p-formgrid p-grid">

          {/* Input nombre */}
          <span className="p-float-label">
            <InputText
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            <label htmlFor="nombre">Nombre</label>
          </span>

          {/* Input email */}
          <span className="p-float-label">
            <InputText
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="email">Email</label>
          </span>

          {/* Select de colores */}
          <div>
            <small>Color</small>
            <SelectButton
              value={color}
              options={colores}
              onChange={(e) => setColor(e.value)}
            />
          </div>

          {/* Checkbox de términos */}
          <div className="card flex justify-content-center">
            <Checkbox
              inputId="terminos"
              onChange={(e) => setTerminos(e.checked)}
              checked={terminos}
            />
            <label htmlFor="terminos">Acepto los terminos</label>
          </div>

          {/* Vista previa de la tarjeta */}
          <div
            style={{
              backgroundColor: color || "transparent",
              borderRadius: 12,
              padding: 12,
            }}
          >
            <h2>Hola, soy {nombre || "________"}</h2>
            <h2>Mi email es: {email}</h2>
            <p>
              Mi color favorito es{" "}
              {color
                ? colores.find((item) => item.value === color)?.label
                : "Ninguno"}
            </p>
          </div>

          {/* Botón Guardar */}
          <div>
            <Button
              label="Guardar"
              disabled={boton_disabled}
              icon="pi pi-check"
              severity="success"
              onClick={confirmar_formulario}
            />
          </div>

          {/* Botón Limpiar */}
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
  );
};

export default Tarjeta;

