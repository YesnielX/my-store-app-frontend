import cogoToast from 'cogo-toast';
import { BaseSyntheticEvent, useEffect, useState } from 'react';
import QrReader from 'react-qr-reader';
import { Link } from 'react-router-dom';
import isJWT from 'validator/lib/isJWT';

import { getMe, login } from '../../services/api';

export default () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [showQRScanner, setShowQRScanner] = useState(false);

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

    const showQRScannerHandler = () => {
        setShowQRScanner(!showQRScanner);

        if (
            !navigator.mediaDevices === undefined ||
            !navigator.mediaDevices.getUserMedia
        ) {
            void cogoToast.error(
                'Su navegador no es compatible con dispositivos multimedia'
            );
            void navigator.mediaDevices.getUserMedia({ video: true });

            return;
        }
    };

    const handleScanError = (err: any) => {
        console.error(err);
        void cogoToast.error('Error al escanear el codigo QR');
        setShowQRScanner(false);
    };

    const handleScanSuccess = (data: any) => {
        if (data) {
            if (!isJWT(data)) {
                void cogoToast.error(
                    'Codigo no escaneado correctamente, intente de nuevo'
                );
            } else {
                console.log(data);
                void cogoToast.success('Codigo QR escaneado con exito!');
                localStorage.setItem(
                    'user',
                    JSON.stringify({
                        token: data as string,
                    })
                );

                setTimeout(() => {
                    void getMe().then(() => {
                        window.location.href = '/';
                    });
                }, 2000);
            }
        } else {
            void cogoToast.error('Intente de nuevo.');
        }
        setShowQRScanner(false);
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
                            <div>
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
                                {showQRScanner && (
                                    <div className="modal is-active">
                                        <div className="modal-background"></div>
                                        <div className="modal-content">
                                            <QrReader
                                                key="video"
                                                delay={2000}
                                                onError={handleScanError}
                                                onScan={handleScanSuccess}
                                                style={{ width: '100%' }}
                                            />
                                        </div>
                                        <button
                                            className="modal-close is-large"
                                            aria-label="close"
                                            onClick={() =>
                                                setShowQRScanner(false)
                                            }
                                        ></button>
                                    </div>
                                )}
                                <br />
                                <button
                                    className="button is-block is-info is-fullwidth is-medium"
                                    onClick={() => {
                                        showQRScannerHandler();
                                    }}
                                >
                                    Login con codigo QR
                                </button>
                                <br />
                                <br />
                                <Link to="/Register">Registrarse</Link>{' '}
                                &nbsp;·&nbsp;
                                <Link to="/ForgetPassword">
                                    Olvide mi contraseña
                                </Link>{' '}
                                &nbsp;·&nbsp;
                                <Link to="/Contact">Ayuda</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
