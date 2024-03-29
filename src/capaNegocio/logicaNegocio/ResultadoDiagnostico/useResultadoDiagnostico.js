//React
import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from "../../context/UserContext.js";
//Datos
import getAutorization from '../../../capaDatos/Get/getAutorization.js';
import getAutorizationPDF from '../../../capaDatos/Get/getAutorizationPDF.js';
import putBodyAutorization from '../../../capaDatos/Put/putBodyAutorization.js';
import deleteAutorization from '../../../capaDatos/Delete/deleteAutorization.js';
//Componentes
import MostrarMensaje from '../../../capaPresentacion/vista/ComponentesComunes/MostrarMensaje.js';
import ComponenteTabla from '../../../capaPresentacion/vista/ComponentesComunes/ComponenteTabla.js';
import NombreOpcion from '../../../capaPresentacion/vista/ComponentesComunes/NombreOpcion.js';
import ColumnaModificarEliminar from '../../../capaPresentacion/vista/ComponentesComunes/ColumnaModificarEliminar.js';
import ComponenteGenerarPDF from '../../../capaPresentacion/vista/ResultadoDiagnostico/ComponenteGenerarPDF.js';

const useResultadoDiagnostico = () => {

    //Contexto
    const { cambiarEstado, setCambiarEstado } = useContext(UserContext);
    const { setDatosGuardados } = useContext(UserContext);
    const { setDatosIntroducidos } = useContext(UserContext);
    const { setDatosOriginales } = useContext(UserContext);
    const { token } = useContext(UserContext);
    const { es_admin } = useContext(UserContext);
    const { filtro } = useContext(UserContext);

    //Componente
    const [componenteMostrarMensaje, setComponenteMostrarMensaje] = useState("");
    const [componenteListarResultados, setComponenteListarResultados] = useState([]); //Guardar resultados
    const [componenteNombreOpcion, setComponenteNombreOpcion] = useState(""); //Nombre opcion
    const [componenteCabeceraModificarEliminar, setComponenteCabeceraModificarEliminar] = useState(""); //Columna modificar/eliminar
    const [componenteGenerarPDF, setComponenteGenerarPDF] = useState(""); //Muestra el botón PDF

    //Estado
    const [codigo, setCodigo] = useState(null); //Codigo respuesta

    let respuestaServidor = "";
    let url = "";
    let datosExtraidos = "";

    function cargarElementosTabla(datosExtraidos, funcion, es_admin) {
        try {
            let tabla = "";
            if ((es_admin === true && funcion === "listar") || (es_admin === true && funcion === "filtrar")) { //Se muestra tabla con botones de modificar y eliminar*/
                tabla = datosExtraidos.map(elemento => (
                    <tr>
                        <th id="cedulaTablaFila-ResultadoDiagnostico" scope="row">{elemento.cedula}</th>
                        <td id="nombrePacienteTablaFila-ResultadoDiagnostico">{elemento.nombre}</td>
                        <td id="resultadoTablaFila-ResultadoDiagnostico">{elemento.resultado}</td>
                        <td id="observacionesTablaFila-ResultadoDiagnostico">{elemento.observaciones}</td>
                        <td id="fechaTablaFila-ResultadoDiagnostico">{elemento.fecha_creacion}</td>

                        <td id="modificarEliminarTablaFila-ResultadoDiagnostico">

                            <button id="botonModificar-ResultadoDiagnostico" type="button" class="btn btn-success" onClick={() => { setearDatos(elemento) }} title="Modificar resultado" data-bs-toggle="modal" data-bs-target="#modalModificar-ResultadoDiagnostico">
                                <i id="iconoModificar-ResultadoDiagnostico" class="fas fa-cog"></i>
                            </button>

                            <button id="botonEliminar-ResultadoDiagnostico" type="button" class="btn btn-success" onClick={() => { setearDatos(elemento) }} title="Eliminar resultado" data-bs-toggle="modal" data-bs-target="#modalEliminar-ResultadoDiagnostico">
                                <i id="iconoEliminar-ResultadoDiagnostico" class="fas fa-times-circle"></i>
                            </button>

                        </td>
                    </tr>
                ))
            } else if ((es_admin === false && funcion === "listar") || (es_admin === false && funcion === "filtrar")) { //Se muestra tabla sin botones de modificar y eliminar
                tabla = datosExtraidos.map(elemento => (
                    <tr>
                        <th id="cedulaTablaFila-ResultadoDiagnostico" scope="row">{elemento.cedula}</th>
                        <td id="nombrePacienteTablaFila-ResultadoDiagnostico">{elemento.nombre}</td>
                        <td id="resultadoTablaFila-ResultadoDiagnostico">{elemento.resultado}</td>
                        <td id="observacionesTablaFila-ResultadoDiagnostico">{elemento.observaciones}</td>
                        <td id="fechaTablaFila-ResultadoDiagnostico">{elemento.fecha_creacion}</td>

                        <td id="modificarEliminarTablaFila-ResultadoDiagnostico">
                            <button id="botonModificar-ResultadoDiagnostico" type="button" class="btn btn-success" onClick={() => { setearDatos(elemento) }} title="Modificar resultado" data-bs-toggle="modal" data-bs-target="#modalModificar-ResultadoDiagnostico">
                                <i id="iconoModificar-ResultadoDiagnostico" class="fas fa-cog"></i>
                            </button>
                        </td>
                    </tr>
                ))
            }

            return tabla;

        } catch (error) {
            setCodigo(504);

        }
    }

    function tomarDecision(respuesta, funcion) { //Se usa para identificar si retorna un codigo o array con items

        try {

            if (respuesta.code !== undefined) {
                setCodigo(respuestaServidor.code);

            } else {
                datosExtraidos = respuestaServidor.result.items;

                if (datosExtraidos.length > 0) { //Si hay algún resultado

                    setComponenteListarResultados(<ComponenteTabla tabla={cargarElementosTabla(datosExtraidos, funcion, es_admin)} />);

                    if (funcion === "listar") { //Se decide si se debe mostrar el botón de generar para listar o filtrar
                        setComponenteGenerarPDF(<ComponenteGenerarPDF mensaje={"¿Desea generar reporte general en PDF?"} funcion={(e) => generarPDF(e, funcion)} />);

                    } else if (funcion === "filtrar") {
                        setComponenteGenerarPDF(<ComponenteGenerarPDF mensaje={"¿Desea generar reporte del filtro en PDF?"} funcion={(e) => generarPDF(e, funcion, filtro)} />);

                    }

                } else {

                    if (funcion === "listar") {
                        setCodigo(206); //No hay nada en la BD sobre lo tratado de mostrar.

                    } else if (funcion === "filtrar") {
                        setCodigo(404); //No se encuentra nada en el filtro.

                    }

                }
            }
        } catch (error) {
            setCodigo(504);
        }
    }

    const listarResultados = async (event, funcion, datos) => {

        try {
            event.preventDefault();

            if (funcion === "listar") {

                setCodigo(""); //Se reinicia el mensaje de la tabla
                url = "https://secure-brushlands-86892.herokuapp.com/v1/diagnosis/get-all";
                respuestaServidor = await getAutorization(token, url);
                tomarDecision(respuestaServidor, funcion);


            } else if (funcion === "filtrar") {

                setCodigo("");

                if (datos.categoria === "Seleccione Categoria..." || datos.inputFiltro === "" || datos.categoria === undefined || datos.inputFiltro === undefined) {
                    setCodigo(408);

                } else {

                    switch (datos.categoria) {

                        case "cedula":
                            url = "https://secure-brushlands-86892.herokuapp.com/v1/diagnosis/get-all?cedula=" + datos.inputFiltro;
                            respuestaServidor = await getAutorization(token, url);
                            tomarDecision(respuestaServidor, funcion);

                            break;

                        case "nombre":
                            url = "https://secure-brushlands-86892.herokuapp.com/v1/diagnosis/get-all?nombre=" + datos.inputFiltro;
                            respuestaServidor = await getAutorization(token, url);
                            tomarDecision(respuestaServidor, funcion);

                            break;

                        default:
                            
                            break;
                    }
                }

            }

            respuestaServidor = "";
            url = "";
            datosExtraidos = "";

        } catch (error) {
            setCodigo(504);
        }
    }

    function setearDatos(elemento) { //Se usa para poder setear los valores en los modales

        setDatosGuardados(elemento); //Datos que se modificaran y mostraran en los modales.

        setDatosOriginales(elemento); //Datos originales para comparar.

        setDatosIntroducidos(""); //Datos que se van modificando en el handleChange.

    }

    const modificarResultados = async (event, datosModificados, datosOriginales) => {

        try {
            event.preventDefault();
            setDatosGuardados("");

            //Se valida que no existan campos vacios.
            if (datosModificados.cedula === "" || datosModificados.nombre === "" || datosModificados.observaciones === "") {
                setCodigo(408);
            } else {

                /*Se valida que campo se modifico, si no se modifico alguno,
                se setean los datos originales*/
                let varCedula = datosModificados.cedula;
                let varNombre = datosModificados.nombre;
                let varObservaciones = datosModificados.observaciones;

                if (varCedula === undefined) {
                    varCedula = datosOriginales.cedula;
                }

                if (varNombre === undefined) {
                    varNombre = datosOriginales.nombre;
                }

                if (varObservaciones === undefined) {
                    varObservaciones = datosOriginales.observaciones;
                }

                //Se crea el array con los datos
                let arrayDatos = {
                    cedula: varCedula,
                    nombre: varNombre,
                    observaciones: varObservaciones
                };

                let url = "https://secure-brushlands-86892.herokuapp.com/v1/diagnosis/" + datosOriginales.id + "/update-one";
                respuestaServidor = await putBodyAutorization(arrayDatos, token, url);

                if (respuestaServidor.status === 404) { //Correo a modificar no encontrado
                    setCodigo(406);

                } else if (respuestaServidor.status !== undefined) { //Si es diferente
                    setCodigo(respuestaServidor.status);

                } else if (respuestaServidor.code !== undefined) {
                    setCodigo(respuestaServidor.code);
                }
            }
        } catch (error) {
            setCodigo(504);
        }

    }

    const eliminarResultados = async (event, datosOriginales) => {

        try {
            event.preventDefault();

            let url = "https://secure-brushlands-86892.herokuapp.com/v1/diagnosis/" + datosOriginales.id + "/delete-one";
            respuestaServidor = await deleteAutorization(token, url);

            if (respuestaServidor.status === undefined) {
                setCodigo(respuestaServidor.code);
            } else {
                setCodigo(respuestaServidor.status);
            }

        } catch (error) {
            setCodigo(504);
        }

    }

    const construccionPDF = (datosConstruir, nombrePDF) => { //Se construye el PDF para ser mostrado y descargado
        
        const pdf = window.URL.createObjectURL(datosConstruir);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = pdf;
        a.download = "reporte"+nombrePDF;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(pdf);

    }

    //Se reciben los datos pertenecientes del PDF desde el back-end
    const generarPDF = async (event, funcion, datosFiltro) => { 

        event.preventDefault();

        try {
            if (funcion === "listar") {
                let url = "https://secure-brushlands-86892.herokuapp.com/v1/diagnosis/generate-pdf";
                respuestaServidor = await getAutorizationPDF(token, url);
                let datosObtenidos = await respuestaServidor.blob();
                construccionPDF(datosObtenidos, "_General");

            } else if (funcion === "filtrar") {

                if (datosFiltro.categoria === "cedula") {
                    let url = "https://secure-brushlands-86892.herokuapp.com/v1/diagnosis/generate-pdf?cedula="+datosFiltro.inputFiltro;
                    respuestaServidor = await getAutorizationPDF(token, url);
                    let datosObtenidos = await respuestaServidor.blob();
                    construccionPDF(datosObtenidos, "_Filtrado");

                } else if (datosFiltro.categoria === "nombre") {
                    let url = "https://secure-brushlands-86892.herokuapp.com/v1/diagnosis/generate-pdf?nombre="+datosFiltro.inputFiltro;
                    respuestaServidor = await getAutorizationPDF(token, url);
                    let datosObtenidos = await respuestaServidor.blob();
                    construccionPDF(datosObtenidos, "_Filtrado");

                }
            }

        } catch (error) {
            setCodigo(504);
        }

    }

    //Muestra mensajes informativos al usuario
    useEffect(() => {

        if (cambiarEstado === "Correcto") {
            setCodigo(201);
            setCambiarEstado("");

        }

        switch (codigo) {

            case 200: //Se modifica correctamente
                setComponenteMostrarMensaje(<MostrarMensaje mensaje={"Resultado modificado correctamente, recargue para ver cambios."} />);
                break;

            case 201: //Se crea correctamente
                setComponenteMostrarMensaje(<MostrarMensaje mensaje={"Resultado guardado correctamente, recargue para ver cambios."} />);
                break;

            case 204: //Se elimina correctamente
                setComponenteMostrarMensaje(<MostrarMensaje mensaje={"Resultado eliminado correctamente, recargue para ver cambios."} />);
                break;

            case 206: //Tabla vacia
                setComponenteMostrarMensaje(<MostrarMensaje mensaje={"No hay datos registrados."} />);
                break;

            case 400: //Error de almacenamiento
                setComponenteMostrarMensaje(<MostrarMensaje mensaje={"Un error ha sucedido, regrese e intente de nuevo."} />);
                break;

            case 401: //No tiene token
                setComponenteMostrarMensaje(<MostrarMensaje mensaje={"Ocurrió un error, debe iniciar sesión."} />);
                break;

            case 403: //No autenicado
                setComponenteMostrarMensaje(<MostrarMensaje mensaje={"Ocurrió un error, debe iniciar sesión."} />);
                break;

            case 404: //No encontrado en filtro
                setComponenteMostrarMensaje(<MostrarMensaje mensaje={"No se ha encontrado resultado, detalle más la búsqueda."} />);
                break;

            case 406: //No se a encontrado correo para actualizar/eliminar
                setComponenteMostrarMensaje(<MostrarMensaje mensaje={"No se ha encontrado el resultado a actualizar."} />);
                break;

            case 408: //Campos vacios
                setComponenteMostrarMensaje(<MostrarMensaje mensaje={"Por favor llene todos los campos."} />);
                break;

            case 500: //Error de almacenamiento
                setComponenteMostrarMensaje(<MostrarMensaje mensaje={"Un error ha sucedido, regrese e intente de nuevo."} />);
                break;

            case 504: //Error en el try catch
                setComponenteMostrarMensaje(<MostrarMensaje mensaje={"Un error ha sucedido, regrese e intente de nuevo."} />);
                break;

            default:
                setComponenteMostrarMensaje(<MostrarMensaje mensaje={""} />);
                break;
        }
    }, [codigo, cambiarEstado])


    //Se ejecuta una sola vez al ser renderizado. Verifica si es admin y si tiene token para mostrar botones.
    useEffect(() => {
        if (es_admin === true && token !== undefined) {

            setComponenteNombreOpcion(<NombreOpcion opcion={"Administrar Resultados"} />);
            setComponenteCabeceraModificarEliminar(<ColumnaModificarEliminar
                id={"modificarEliminarTablaCabecera-ResultadoDiagnostico"}
                title={"Modificar/Eliminar el resultado"} />);
            setComponenteGenerarPDF("");

        } else {

            setComponenteNombreOpcion(<NombreOpcion opcion={"Resultados"} />);
            setComponenteCabeceraModificarEliminar(<th
                id="modificarEliminarTablaCabecera-ResultadoDiagnostico"
                scope="col"
                title="Modificar el resultado">Modificar</th>);
            setComponenteGenerarPDF("");
            
        }
    }, [])


    return { listarResultados, setearDatos, componenteListarResultados, componenteNombreOpcion, componenteCabeceraModificarEliminar, componenteMostrarMensaje, componenteGenerarPDF, modificarResultados, eliminarResultados, generarPDF };
};

export default useResultadoDiagnostico;
