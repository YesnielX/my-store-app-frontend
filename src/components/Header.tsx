import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { user } from '../services/api';

export default () => {
    const [isActive, setIsActive] = useState(false);

    window.onresize = () => {
        console.log(window.innerWidth);
        if (window.innerWidth > 768) {
            setIsActive(false);
        }
    };

    return (
        <>
            <div>
                <nav
                    className="navbar"
                    role="navigation"
                    aria-label="main navigation"
                >
                    <div className="navbar-brand">
                        <Link
                            className="navbar-item"
                            to="/"
                            onClick={() => setIsActive(false)}
                            key="Home"
                        >
                            <h1 className="title">My Store App</h1>
                        </Link>

                        <a
                            className="navbar-burger"
                            aria-label="menu"
                            aria-expanded="false"
                            data-target="navbarBasicExample"
                            onClick={() => setIsActive(!isActive)}
                        >
                            <span aria-hidden="true"></span>
                            <span aria-hidden="true"></span>
                            <span aria-hidden="true"></span>
                        </a>
                    </div>

                    <div
                        className={`navbar-menu animate__animated ${
                            isActive ? 'is-active animate__slideInLeft' : ''
                        }`}
                        onClick={() => setIsActive(false)}
                    >
                        <div className="navbar-end has-text-centered">
                            <div className="navbar-item has-dropdown is-hoverable">
                                {user().isLogged && (
                                    <Link
                                        className="navbar-item"
                                        to={'/Account'}
                                        key={'router-account'}
                                    >
                                        Cuenta
                                    </Link>
                                )}
                                {user().isAdmin || user().isPrincipalAdmin ? (
                                    <Link
                                        className="navbar-item"
                                        to={'/Admin'}
                                        key={'router-admin'}
                                    >
                                        Admin
                                    </Link>
                                ) : null}
                                <Link
                                    className="navbar-item"
                                    to={'/Contact'}
                                    key={'router-contact'}
                                >
                                    Contactanos
                                </Link>
                                <Link
                                    className="navbar-item"
                                    to={'/About'}
                                    key={'router-about'}
                                >
                                    Sobre nosotros
                                </Link>
                                {user().isLogged && (
                                    <Link
                                        className="navbar-item"
                                        to={'/CreateIssue'}
                                        key={'router-report'}
                                    >
                                        Reportar un problema
                                    </Link>
                                )}
                            </div>
                            <div className="navbar-item">
                                <div className="">
                                    <Link
                                        className={`button is-light mr-4 ${
                                            [user()].length !== 0 &&
                                            user().isLogged
                                                ? 'is-hidden'
                                                : ''
                                        }`}
                                        to="/Login"
                                    >
                                        Iniciar Sesion
                                    </Link>
                                    <Link
                                        className={`button is-primary ${
                                            [user()].length !== 0 &&
                                            user().isLogged
                                                ? 'is-hidden'
                                                : ''
                                        }`}
                                        to="/Register"
                                    >
                                        <strong>Registrarse</strong>
                                    </Link>
                                    <Link
                                        className={`button is-danger ${
                                            [user()].length !== 0 &&
                                            user().isLogged
                                                ? ''
                                                : 'is-hidden'
                                        }`}
                                        to="/Logout"
                                    >
                                        <strong>Cerrar Sesion</strong>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
        </>
    );
};
