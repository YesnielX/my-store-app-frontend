/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Link } from 'react-router-dom';

import { getStores, IStore, user } from '../services/api';

export default () => {
    const renderStores = (type: number) => {
        let myStores: Array<IStore> = [];

        if (type === 1) {
            myStores = JSON.parse(
                localStorage.getItem('myStores') || '[]'
            ).youStores;
        } else if (type === 2) {
            myStores = JSON.parse(
                localStorage.getItem('myStores') || '[]'
            ).managerStores;
        }

        if (myStores.length) {
            return myStores.map(store => {
                return (
                    <div className="column is-3" key={store.name}>
                        <div
                            className="card"
                            style={{
                                minHeight: '300px',
                            }}
                        >
                            <div className="card-image mx-3">
                                <figure className="image is-1by1">
                                    <img
                                        src={store.imagePath}
                                        alt="store image"
                                    />
                                </figure>
                            </div>
                            <div className="card-content">
                                <div className="media">
                                    <div className="media-content">
                                        <p className="title is-4">
                                            {store.name}
                                        </p>
                                    </div>
                                </div>
                                <Link
                                    className="button is-info"
                                    to={{
                                        pathname: '/Store',
                                        state: {
                                            store: store,
                                        },
                                    }}
                                >
                                    Ver Tienda
                                </Link>
                            </div>
                        </div>
                    </div>
                );
            });
        } else if (type === 2) {
            return (
                <div className="column is-4">
                    <img src="/images/empty.svg" alt="empty" />
                </div>
            );
        }
    };

    return (
        <div className="section has-text-centered justify-content animate__animated animate__slideInUp">
            {user().isLogged ? (
                <div>
                    <div className="section">
                        <h1 className="title">My Stores</h1>
                        <hr />
                        <div className="row columns is-multiline is-centered">
                            {renderStores(1)}
                            <div className="column is-3">
                                <div
                                    className="card"
                                    style={{
                                        minHeight: '300px',
                                    }}
                                >
                                    <div className="card-image">
                                        <figure className="image is-1by1 mx-3 my-3">
                                            <img
                                                src="/images/createStore.svg"
                                                alt="store image"
                                            />
                                        </figure>
                                    </div>
                                    <div className="card-content">
                                        <Link
                                            className="button is-info"
                                            to={{
                                                pathname: '/AddStore',
                                            }}
                                        >
                                            Crear Tienda
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="section ">
                        <h1 className="title">My Manager Stores</h1>
                        <hr />
                        <div className="row columns is-multiline is-centered">
                            {renderStores(2)}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="section has-text-centered mx-auto my-auto">
                    <Link
                        className={`button is-primary mr-4 ${
                            [user()].length !== 0 && user().isLogged
                                ? 'is-hidden'
                                : ''
                        }`}
                        to="/Login"
                    >
                        Please Log In
                    </Link>
                    <div>
                        <img
                            src="/images/login.svg"
                            alt="login image"
                            draggable="false"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
