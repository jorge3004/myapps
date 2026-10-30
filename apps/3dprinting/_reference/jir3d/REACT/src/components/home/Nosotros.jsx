import React from 'react';
import nosotrosPic from '/assets/images/home/et.jpg'
// import nosotrosPic from '../../assets/images/home/et.jpg'


export const Nosotros = () => {
    return (
        <div className="nos p-lg-5">
            <div className="container-fluid p-lg-5">
                <div className="row d-flex align-items-center justify-content-center my-3">
                    <div className="col-12">
                        <h1 className="display-3 text-center p-lg-3 mb-5" >Sobre nosotros</h1>
                    </div>
                    <div className="col-10 col-lg-6 my-4 ">
                        <div className="img-fluid"><img src={nosotrosPic} className="img-fluid" alt="team" /></div>
                    </div>
                    <div className="col-11 col-lg-6 text-center mb-5">
                        <h2 className="display-4" >NUESTRA VISIÓN</h2>
                        <p className="display-3 nos" > “Somos una empresa que trabaja en equipo y colaboración mediante
                            relaciones de confianza con otras compañías, clientes, gobierno y la
                            comunidad, proporcionando productos y servicios innovadores apoyado
                            de la tecnología de manufactura aditiva”</p>
                        <hr />
                        <h2 className="display-4" >NUESTRA MISIÓN</h2>
                        <p className="display-3 text-justify nos" > “Promover la tecnología de manufactura aditiva en el país por medio
                            de la innovación mediante alianzas estratégicas”</p>
                    </div>
                </div>
            </div>
        </div>
    )
};
