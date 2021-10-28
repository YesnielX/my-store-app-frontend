/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import cogoToast from 'cogo-toast';
import { BaseSyntheticEvent, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { ResetPassword } from '../../services/api';

export default () => {
    const [newPassword, setNewPassword] = useState('');

    const query = new URLSearchParams(useLocation().search);
    const token = query.get('token') as string;

    const sendResetPassword = (e: BaseSyntheticEvent) => {
        console.log(newPassword);
        void ResetPassword(newPassword, token).then(res => {
            console.log(res);
            if (res.status === 200) {
                void cogoToast.success('Contraseña restablecida con exito');
                window.location.href = '/';
            }
        });
        e.preventDefault();
        e.stopPropagation();
    };

    useEffect(() => {
        if (!token) {
            window.location.href = '/';
            void cogoToast.error('Token invalido');
        }
        document.title = 'Restablecer Contraseña';
    }, []);

    return (
        <section className="section mt-6">
            <div className="columns is-multiline">
                <div className="column is-8 is-offset-2 register">
                    <div className="columns">
                        <div className="column right has-text-centered">
                            <h1 className="title is-4">
                                Restablecer Contraseña
                            </h1>
                            <br />
                            <form>
                                <div className="field">
                                    <div className="control">
                                        <input
                                            className="input is-medium"
                                            type="password"
                                            placeholder="Nueva Contraseña"
                                            onChange={e =>
                                                setNewPassword(e.target.value)
                                            }
                                        />
                                    </div>
                                </div>
                                <button
                                    className="button is-block is-primary is-fullwidth is-medium"
                                    onClick={sendResetPassword}
                                >
                                    Restablecer Contraseña
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
