import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Fragment } from "react";

const Home = () =>{
    const navigate = useNavigate()

    return(
        <Fragment>

        <Button label="Ir al formulario" onClick={()=> navigate('/tarjeta')}/>
        <Button label="Ver personas" onClick={()=> navigate('/personas')}/>
        
        </Fragment>
    )
}

export default Home