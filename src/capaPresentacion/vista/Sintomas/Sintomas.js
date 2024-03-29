//Css
import '../../css/Sintomas.css';
import '../../css/fontawesome-free-5.15.4-web/css/all.css'
//React
import React, { useContext } from 'react';
//Context
import { UserContext } from "../../../../src/capaNegocio/context/UserContext.js";
//Onchange
import useChange from './useChange';
//Logica negocio
import useSintomas from '../../../capaNegocio/logicaNegocio/Sintomas/useSintomas';

function Sintomas() {

    const { datosGuardados } = useContext(UserContext); //Muestra dato en el input del modificar
    const { datosOriginales } = useContext(UserContext); //Datos originales al ser seteados al hacer click en modificar

    const { datosTablaModificar } = useContext(UserContext); //Datos al seleccionar checkbox se muestra en textarea
    const { guardarID } = useContext(UserContext); //Se guarda id del elemento seleccionado con el checkbox
    const { filtro } = useContext(UserContext); //Se guarda información del filtro

    const { handleInputChangeModificar, handleFiltrarChange } = useChange(); //Onchange para capturar datos en los inputs
    const { listarElementos, componenteListarSintomas, componenteListarTiposDepresion, componenteMostrarMensaje, componenteNombreOpcion, componenteCabeceraModificarEliminar, componenteAgregarSintoma, modificarSintoma, eliminarSintoma, handleChange, reiniciarModal } = useSintomas(); //Logica de negocio


    return (

        <div id="fondo-AdministrarSintomas">

            <div id="cabeceraAdministrarPreguntas-AdministrarSintomas">

                <div id="cajaNombreOpcion-AdministrarSintomas">

                    {componenteNombreOpcion}

                </div>

                <div id="busqueda">

                    <form id="formato" onSubmit={(e) => listarElementos(e, "filtrar", filtro)}>

                        <select className="form-select" onChange={handleFiltrarChange} name="categoria" title="Seleccione categoria para buscar palabra" >

                            <option value >Seleccione Categoría...</option>
                            <option value="sintoma">Sintoma</option>

                        </select>

                        <input id="filtrar" type="text" className="form-control" onChange={handleFiltrarChange} name="inputFiltro" placeholder="¿Busca algo puntual?" title="Ingrese valor a buscar" />

                        <button id="enviarBuscar-Plataforma" type="submit" className="btn btn-success" title="Buscar" >
                            <i className="fas fa-search"></i>
                        </button>

                    </form>
                </div>


                <div id="cajaAgregarAdministrarSintomas-AdministrarSintomas">

                    {componenteAgregarSintoma}

                </div>

            </div>

            <form id="formato" onSubmit={(e) => listarElementos(e, "listar")}>

                <div id="cajaTabla-AdministrarSintomas">

                    <div id="cajaCabecera-AdministrarSintomas">

                        <div id="cajaMensajeRespuesta-AdministrarSintomas">
                            <h5 id="mensajeRespuesta-AdministrarSintomas">{componenteMostrarMensaje}</h5>
                        </div>
                        <div id="cajaBotonRecargar-AdministrarSintomas">
                            <button id="botonRecargar-AdministrarSintomas" type='submit' className="btn btn-success" title='Recargar tabla'><i className="fas fa-redo"></i></button>
                        </div>
                    </div>

                    <table id="tabla-AdministrarSintomas" className="table table-bordered">
                        <thead> {/*Cabeceras*/}
                            <tr>
                                <th id="sintomaTablaCabecera-AdministrarSintomas" scope="col" title="Sintomas ligados a tipo depresión">Síntoma</th>
                                <th id="tipoDepresionTablaCabecera-AdministrarSintomas" scope="col" title="Clasificación depresión">Tipo Depresión</th>

                                {/*Columna para agregar o elimina*/}
                                {componenteCabeceraModificarEliminar}
                            </tr>
                        </thead>
                        <tbody> {/*Filas*/}

                            {componenteListarSintomas}

                        </tbody>
                    </table>
                </div>
            </form>
            {/*Modal para el botón de Eliminar AdministrarSintomas*/}
            <form className="row" onSubmit={(e) => eliminarSintoma(e, datosOriginales)}>
                <div className="modal fade" id="modalEliminar-AdministrarSintomas" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">

                                <h5 className="modal-title" id="modalLabelEliminar-AdministrarSintomas">

                                    <i className="fas fa-exclamation-triangle"></i>
                                    <label >Advertencia</label>

                                </h5>
                            </div>
                            <div className="modal-body">

                                <label>¿Realmente desea eliminar el síntoma "{datosOriginales.sintoma}" ?</label>
                                <label id="labelRevertirCambios-AdministrarSintomas">Los cambios no se podrán revertir.</label>

                            </div>
                            <div className="modal-footer">

                                <button type="button" id="botonModalCancelar-AdministrarSintomas" className="btn btn-secondary" data-bs-dismiss="modal" onClick={reiniciarModal} title="Regresa a sintomas">Cancelar</button>
                                <button type="submit" id="botonModalEliminar-AdministrarSintomas" className="btn btn-primary" data-bs-dismiss="modal" title="Eliminar sintoma">Eliminar</button>

                            </div>
                        </div>
                    </div>
                </div>
            </form>

            {/*Modal para el botón de Modificar AdministrarSintomas*/}
            <form className="row" onSubmit={(e) => modificarSintoma(e, datosOriginales, datosGuardados, guardarID)}>
                <div className="modal fade" id="modalModificar-AdministrarSintomas" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">

                                <h5 className="modal-title" id="modalLabelModificar-AdministrarSintomas">

                                    <i className="fas fa-cog"></i>
                                    <label >Modificar Síntomas</label>

                                </h5>
                            </div>
                            <div className="modal-body">

                                <div id="labelSintomaModificar-AdministrarSintomas">

                                    <label>Síntoma</label>

                                </div>

                                <div className="input-group">
                                    <div className="input-group-text" id="btnGroupAddon"><i className="fas fa-address-card"></i></div>
                                    <textarea className="form-control" placeholder="Ingrese el sintoma" value={datosGuardados.sintoma} onChange={handleInputChangeModificar} name="sintoma" title="Sintoma a modificar"></textarea>
                                </div>

                                <br />

                                {/*Sección AdministrarSintomas*/}

                                <div id="labelTipoDepresionModificar-AdministrarSintomas">

                                    <label>Seleccione el/los tipos de depresión</label>

                                </div>

                                <div className="input-group">
                                    <div className="input-group-text" id="btnGroupAddon"><i className="fas fa-font"></i></div>
                                    <textarea className="form-control" placeholder="Seleccione el/los tipos de depresión" readonly="readonly" value={datosTablaModificar} onChange={handleChange} title="Tipos depresión seleccionados"></textarea>
                                </div>

                                <br />

                                {/*Sección Descripción*/}

                                <div id="cajaTablaModificar-AdministrarSintomas">

                                    <div id="cajaBotonRecargarModificar-AdministrarSintomas">

                                        <button id="botonRecargarModificar-AdministrarSintomas" type='button' onClick={(e) => listarElementos(e, "tipos depresion")} className="btn btn-success" title='Recargar tabla'><i className="fas fa-redo"></i></button>

                                    </div>
                                    <table id="tablaTiposDepresion-AdministrarSintomas" className="table table-bordered">

                                        <thead> {/*Cabeceras*/}
                                            <tr>
                                                <th id="tipoDepresionTablaCabeceraModificar-AdministrarSintomas" scope="col" title="Tipo Depresión">Tipo Depresión</th>
                                                <th id="seleccionTablaCabeceraModificar-AdministrarSintomas" scope="col" title="Selecciones">Elegir</th>

                                            </tr>
                                            {componenteListarTiposDepresion}

                                        </thead>
                                    </table>
                                </div>

                            </div>
                            <div className="modal-footer">

                                <button type="button" id="botonModalCancelar-AdministrarSintomas" className="btn btn-secondary" data-bs-dismiss="modal" onClick={reiniciarModal} title="Regresa a sintomas">Cancelar</button>
                                <button type="submit" id="botonModalModificar-AdministrarSintomas" className="btn btn-primary" data-bs-dismiss="modal" title="Modificar sintoma">Modificar</button>

                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>

    );
}

export default Sintomas;