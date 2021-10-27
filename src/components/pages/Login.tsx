/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { BaseSyntheticEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { login } from '../../services/api';

export default () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const setLogin = (e: BaseSyntheticEvent) => {
        console.log(email, password);
        void login(email, password).then(res => {
            console.log(res);
            if (res.status === 200) {
                window.location.href = '/';
            }
        });
        e.preventDefault();
        e.stopPropagation();
    };

    useEffect(() => {
        document.title = 'Iniciar Sesion';
    }, []);

    return (
        <section className="section mt-6">
            <div className="columns is-multiline">
                <div className="column is-8 is-offset-2 register">
                    <div className="columns">
                        <div className="column right has-text-centered">
                            <h1 className="title is-4">Inicio De Sesion</h1>
                            <p className="description">Bienvenido de nuevo!</p>
                            <br />
                            <form>
                                <div className="field">
                                    <div className="control">
                                        <input
                                            className="input is-medium"
                                            type="text"
                                            placeholder="Email"
                                            onChange={e =>
                                                setEmail(e.target.value)
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="field">
                                    <div className="control">
                                        <input
                                            className="input is-medium"
                                            type="password"
                                            placeholder="Contraseña"
                                            onChange={e =>
                                                setPassword(e.target.value)
                                            }
                                        />
                                    </div>
                                </div>
                                <button
                                    className="button is-block is-primary is-fullwidth is-medium"
                                    onClick={setLogin}
                                >
                                    Iniciar sesion
                                </button>
                                <br />
                                <br />
                                <Link to="/Register">Registrarse</Link>{' '}
                                &nbsp;·&nbsp;
                                <Link to="/forget-password">
                                    Olvide mi contraseña
                                </Link>{' '}
                                &nbsp;·&nbsp;
                                <Link to="/Contact">Ayuda</Link>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
