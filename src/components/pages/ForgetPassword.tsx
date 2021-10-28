/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import cogoToast from 'cogo-toast';
import { BaseSyntheticEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { ForgetPassword } from '../../services/api';

export default () => {
    const [email, setEmail] = useState('');

    const sendForgetPassword = (e: BaseSyntheticEvent) => {
        console.log(email);
        void ForgetPassword(email).then(res => {
            console.log(res);
            if (res.status === 200) {
                void cogoToast.success('Revisa tu correo electronico');
                window.location.href = '/';
            }
        });
        e.preventDefault();
        e.stopPropagation();
    };

    useEffect(() => {
        document.title = 'Recuperar Contraseña';
    }, []);

    return (
        <section className="section mt-6">
            <div className="columns is-multiline">
                <div className="column is-8 is-offset-2 register">
                    <div className="columns">
                        <div className="column right has-text-centered">
                            <h1 className="title is-4">Recuperar Contraseña</h1>
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
                                <button
                                    className="button is-block is-primary is-fullwidth is-medium"
                                    onClick={sendForgetPassword}
                                >
                                    Recuperar Contraseña
                                </button>
                                <br />
                                <br />
                                <Link to="/Register">Registrarse</Link>{' '}
                                <Link to="/Login">Iniciar Sesion</Link>
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
