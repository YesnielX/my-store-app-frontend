import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { Link } from 'react-router-dom';

import { getMe, user } from '../../services/api';

export default () => {
    const [showQRLogin, setShowQRLogin] = useState(false);

    if (!user().isLogged) {
        window.location.href = '/Login';
    }

    useEffect(() => {
        document.title = 'Cuenta';
        void getMe();
    });

    return (
        <section className="container mt-6 mx-4 has-text-centered animate__animated animate__slideInUp">
            <div>
                <span className="mt-6">
                    <i className="fas fa-user fa-10x"></i>
                </span>
            </div>
            <div className="mt-4">
                <fieldset
                    className="has-text-centered mx-auto"
                    style={{ maxWidth: 400 }}
                >
                    <div className="field mx-auto">
                        <div className="control">
                            <label className="label level-left">Name</label>
                            <input
                                className="input "
                                type="text"
                                disabled
                                placeholder={user().username}
                            />
                        </div>
                    </div>

                    <div className="field mx-auto mt-5">
                        <div className="control">
                            <label className="label level-left">Email</label>
                            <input
                                className="input"
                                type="email"
                                disabled
                                placeholder={user().email}
                            />
                        </div>
                    </div>

                    <div className="field mx-auto mt-5">
                        <div className="control">
                            <label className="label level-left">Roles</label>
                            {user().roles.map(r => (
                                <span className="tag is-success" key={r.name}>
                                    {r.name}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="field mx-auto mt-5">
                        <div className="control">
                            <label className="label level-left">QR Login</label>
                            {showQRLogin ? (
                                <div>
                                    <QRCode value={user().token} />
                                    <br />
                                    <br />
                                    <button
                                        className="button is-info"
                                        disabled={false}
                                        onClick={() => setShowQRLogin(false)}
                                    >
                                        Hide QR
                                    </button>
                                </div>
                            ) : (
                                <button
                                    className="button is-primary"
                                    disabled={false}
                                    onClick={() => setShowQRLogin(true)}
                                >
                                    Show QR
                                </button>
                            )}
                        </div>
                    </div>

                    <button
                        className="button is-primary is-medium is-fullwidth my-5"
                        disabled
                    >
                        Save
                    </button>
                </fieldset>
                <Link
                    className={`button is-danger is-medium is-fullwidth mx-auto ${
                        [user()].length !== 0 && user().isLogged
                            ? ''
                            : 'is-hidden'
                    }`}
                    to="/Logout"
                    style={{ maxWidth: 400 }}
                >
                    <strong>Logout</strong>
                </Link>
            </div>
        </section>
    );
};
