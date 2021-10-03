/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import cogoToast from 'cogo-toast';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Link, Redirect, useLocation } from 'react-router-dom';
import Popup from 'reactjs-popup';

import {
    addEmployee,
    addManager,
    deleteEmployee,
    deleteManager,
    deleteProduct,
    getStores,
    IServerResponse,
    IStore,
    updateStore,
    uploadImage,
    user,
} from '../../services/api';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default () => {
    const location: {
        pathname: string;
        state: {
            store: IStore;
        };
    } = useLocation();

    if (location.state === undefined || location.state.store === undefined) {
        return <Redirect to="/" />;
    }

    const [store, setStore] = useState<IStore>();
    const [loading, setLoading] = useState(true);
    const [settingsModalOpen, setSettingsModalOpen] = useState(false);

    const [image, setImage] = useState('');
    const [name, setName] = useState('');

    const [updateNewManagerEmail, setUpdateNewManagerEmail] = useState('');
    const [updateNewEmployeeEmail, setUpdateNewEmployeeEmail] = useState('');

    const inputFile = useRef<HTMLInputElement>(null);

    async function fetchData() {
        await getStores().then(res => {
            if (res.status === 200) {
                if (location.state.store.author._id === user()._id) {
                    setStore(
                        res.data.data.myStores.find(
                            (store: IStore) =>
                                store._id === location.state.store._id
                        )
                    );
                    console.log('You Store');
                } else {
                    setStore(
                        res.data.data.managerStores.find(
                            (store: IStore) =>
                                store._id === location.state.store._id
                        )
                    );
                    console.log('You Manager Store');
                }
                if (
                    location.state.store.employees.find(
                        e => e._id === user()._id
                    )
                ) {
                    setStore(
                        res.data.data.employeesStores.find(
                            (store: IStore) =>
                                store._id === location.state.store._id
                        )
                    );
                    console.log('You Employee Store');
                }
                setLoading(false);
            }
        });
    }

    const sendDeleteProduct = (id: string) => {
        void deleteProduct(id).then(res => {
            if (res.status === 200) {
                void cogoToast.success('Producto Eliminado.');
                void fetchData();
            }
        });
    };

    const loadImage = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) {
            return;
        }

        const file = e.target.files[0];
        const form = new FormData();
        form.append('image', file, file.name);
        void cogoToast.loading('Uploading Image...').then(() => {
            void uploadImage(form).then(req => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                void req.json().then((res: IServerResponse) => {
                    if (req.status === 201) {
                        void cogoToast.success(res.message);
                        setImage(res.data);
                    } else if (req.status) {
                        void cogoToast.error(
                            <div>
                                <b>Oops!</b>
                                <div>Error al subir la imagen: {res.error}</div>
                            </div>
                        );
                    }
                });
            });
        });
    };

    const sendStoreUpdate = () => {
        void cogoToast.loading('Actualizando...').then(() => {
            void updateStore(
                store?._id as string,
                name || (store?.name as string),
                image || (store?.imagePath as string)
            ).then(res => {
                if (res.status === 200) {
                    void cogoToast.success('Tienda Actualizado.');
                    void fetchData();
                }
            });
        });
    };

    useEffect(() => {
        if (user().isLogged) {
            void fetchData();
            setInterval(() => {
                void fetchData();
                void cogoToast.info('Tienda Actualizada.');
            }, 15000);
        }
    }, []);

    const products = () => {
        if (store?.products && store?.products.length > 0) {
            return store?.products.map(product => (
                <div className="column is-half is-5 mx-4" key={product._id}>
                    <div className="card">
                        <div className="card-image">
                            <Link
                                to={{
                                    pathname: '/Product',
                                    state: {
                                        store,
                                        product,
                                    },
                                }}
                            >
                                <figure className="image is-1by1 mx-3 my-3">
                                    <img
                                        className="mt-4"
                                        src={product.imagePath}
                                        alt={product.name}
                                    />
                                </figure>
                            </Link>
                        </div>
                        <div className="card-content">
                            <div className="media">
                                <div className="media-content">
                                    <p className="title is-5">{product.name}</p>
                                    <p className="text">
                                        {product.description}
                                    </p>
                                </div>
                            </div>
                            <div className="buttons">
                                <button
                                    className="button is-danger"
                                    onClick={() =>
                                        sendDeleteProduct(product._id)
                                    }
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ));
        }
    };

    return (
        <div className="section animate__animated animate__slideInUp">
            <div className="container has-text-centered">
                <section className="hero">
                    <div className="hero-body">
                        <div className="container">
                            <h1 className="title">{store?.name}</h1>

                            {store?.author._id === user()._id ||
                            store?.managers.find(e => e._id === user()._id) ? (
                                <Popup
                                    trigger={
                                        <button
                                            className="button is-primary"
                                            onClick={() =>
                                                setSettingsModalOpen(
                                                    !settingsModalOpen
                                                )
                                            }
                                        >
                                            Ajustes
                                        </button>
                                    }
                                >
                                    {(close: () => void) => (
                                        <div className="modal is-active animate__animated animate__fadeIn">
                                            <div className="modal-background"></div>
                                            <div className="modal-card">
                                                <header className="modal-card-head">
                                                    <p className="modal-card-title">
                                                        Ajustes de la tienda
                                                    </p>
                                                    <button
                                                        className="delete"
                                                        aria-label="close"
                                                        onClick={() => close()}
                                                    ></button>
                                                </header>
                                                <section className="modal-card-body">
                                                    <div className="file is-hidden">
                                                        <label className="file-label">
                                                            <input
                                                                className="file-input"
                                                                type="file"
                                                                name="resume"
                                                                ref={inputFile}
                                                                onChange={
                                                                    loadImage
                                                                }
                                                            />
                                                        </label>
                                                    </div>
                                                    <figure>
                                                        <img
                                                            src={
                                                                image &&
                                                                image.length > 0
                                                                    ? image
                                                                    : store?.imagePath
                                                            }
                                                            alt="store image"
                                                            className="image is-128x128 mx-auto"
                                                            onClick={() =>
                                                                inputFile.current?.click()
                                                            }
                                                        />
                                                    </figure>
                                                    <div className="field">
                                                        <label className="label">
                                                            Nombre
                                                        </label>
                                                        <div className="control">
                                                            <input
                                                                className="input"
                                                                type="text"
                                                                placeholder="Text input"
                                                                defaultValue={
                                                                    store?.name
                                                                }
                                                                onChange={e =>
                                                                    setName(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                    {store.author._id ===
                                                        user()._id && (
                                                        <div className="field">
                                                            <label className="label">
                                                                Agregar Manager
                                                            </label>
                                                            <div className="control">
                                                                <input
                                                                    className="input"
                                                                    type="email"
                                                                    placeholder="Email"
                                                                    onChange={e => {
                                                                        setUpdateNewManagerEmail(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        );
                                                                    }}
                                                                    onKeyDown={e => {
                                                                        if (
                                                                            e.key ===
                                                                            'Enter'
                                                                        ) {
                                                                            void cogoToast
                                                                                .loading(
                                                                                    'Agregando Manager...'
                                                                                )
                                                                                .then(
                                                                                    () => {
                                                                                        if (
                                                                                            !updateNewManagerEmail
                                                                                        ) {
                                                                                            void cogoToast.error(
                                                                                                'Complete los campos'
                                                                                            );
                                                                                            return;
                                                                                        }

                                                                                        addManager(
                                                                                            store._id,
                                                                                            updateNewManagerEmail
                                                                                        )
                                                                                            .then(
                                                                                                res => {
                                                                                                    if (
                                                                                                        res.status ===
                                                                                                        200
                                                                                                    ) {
                                                                                                        void cogoToast
                                                                                                            .success(
                                                                                                                'Manager Agregado'
                                                                                                            )
                                                                                                            .then(
                                                                                                                () => {
                                                                                                                    void fetchData();
                                                                                                                }
                                                                                                            );
                                                                                                    }
                                                                                                }
                                                                                            )
                                                                                            .catch(
                                                                                                () => {
                                                                                                    void cogoToast
                                                                                                        .error(
                                                                                                            'Error al agregar manager'
                                                                                                        )
                                                                                                        .then(
                                                                                                            () => {
                                                                                                                void fetchData();
                                                                                                            }
                                                                                                        );
                                                                                                }
                                                                                            );
                                                                                    }
                                                                                );
                                                                        }
                                                                    }}
                                                                />
                                                                <div>
                                                                    {store.managers.map(
                                                                        manager => (
                                                                            <p
                                                                                className="tag is-primary mt-2 ml-1"
                                                                                key={
                                                                                    manager._id
                                                                                }
                                                                            >
                                                                                {
                                                                                    manager.email
                                                                                }
                                                                                <button
                                                                                    className="delete"
                                                                                    onClick={e => {
                                                                                        e.preventDefault();
                                                                                        void cogoToast
                                                                                            .loading(
                                                                                                'Eliminando Manager...'
                                                                                            )
                                                                                            .then(
                                                                                                () => {
                                                                                                    void deleteManager(
                                                                                                        store._id,
                                                                                                        manager._id
                                                                                                    ).then(
                                                                                                        res => {
                                                                                                            if (
                                                                                                                res.status ===
                                                                                                                200
                                                                                                            ) {
                                                                                                                void cogoToast.success(
                                                                                                                    'Manager Eliminado'
                                                                                                                );
                                                                                                                void fetchData();
                                                                                                            }
                                                                                                        }
                                                                                                    );
                                                                                                }
                                                                                            );
                                                                                    }}
                                                                                ></button>
                                                                            </p>
                                                                        )
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div className="field">
                                                        <label className="label">
                                                            Agregar Empleado
                                                        </label>
                                                        <div className="control">
                                                            <input
                                                                className="input"
                                                                type="email"
                                                                placeholder="Email"
                                                                onChange={e => {
                                                                    setUpdateNewEmployeeEmail(
                                                                        e.target
                                                                            .value
                                                                    );
                                                                }}
                                                                onKeyDown={e => {
                                                                    if (
                                                                        e.key ===
                                                                        'Enter'
                                                                    ) {
                                                                        void cogoToast
                                                                            .loading(
                                                                                'Agregando Empleado...'
                                                                            )
                                                                            .then(
                                                                                () => {
                                                                                    if (
                                                                                        !updateNewEmployeeEmail
                                                                                    ) {
                                                                                        void cogoToast.error(
                                                                                            'Complete los campos'
                                                                                        );
                                                                                        return;
                                                                                    }

                                                                                    addEmployee(
                                                                                        store._id,
                                                                                        updateNewEmployeeEmail
                                                                                    )
                                                                                        .then(
                                                                                            res => {
                                                                                                if (
                                                                                                    res.status ===
                                                                                                    200
                                                                                                ) {
                                                                                                    void cogoToast.success(
                                                                                                        'Empleado Agregado'
                                                                                                    );
                                                                                                    void fetchData();
                                                                                                }
                                                                                            }
                                                                                        )
                                                                                        .catch(
                                                                                            () => {
                                                                                                void cogoToast
                                                                                                    .error(
                                                                                                        'Error al agregar empleado'
                                                                                                    )
                                                                                                    .then(
                                                                                                        () => {
                                                                                                            void fetchData();
                                                                                                        }
                                                                                                    );
                                                                                            }
                                                                                        );
                                                                                }
                                                                            );
                                                                    }
                                                                }}
                                                            />
                                                            <div>
                                                                {store.employees.map(
                                                                    employee => (
                                                                        <p
                                                                            className="tag is-primary mt-2 ml-1"
                                                                            key={
                                                                                employee._id
                                                                            }
                                                                        >
                                                                            {
                                                                                employee.email
                                                                            }
                                                                            <button
                                                                                className="delete"
                                                                                onClick={e => {
                                                                                    e.preventDefault();
                                                                                    void cogoToast
                                                                                        .loading(
                                                                                            'Eliminando Manager...'
                                                                                        )
                                                                                        .then(
                                                                                            () => {
                                                                                                void deleteEmployee(
                                                                                                    store._id,
                                                                                                    employee._id
                                                                                                ).then(
                                                                                                    res => {
                                                                                                        if (
                                                                                                            res.status ===
                                                                                                            200
                                                                                                        ) {
                                                                                                            void cogoToast
                                                                                                                .success(
                                                                                                                    'Emleado Eliminado'
                                                                                                                )
                                                                                                                .then(
                                                                                                                    () => {
                                                                                                                        void fetchData();
                                                                                                                    }
                                                                                                                );
                                                                                                        }
                                                                                                    }
                                                                                                );
                                                                                            }
                                                                                        );
                                                                                }}
                                                                            ></button>
                                                                        </p>
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </section>
                                                <footer className="modal-card-foot">
                                                    <button
                                                        className="button is-success"
                                                        onClick={() => {
                                                            sendStoreUpdate();
                                                            close();
                                                        }}
                                                    >
                                                        Guardar
                                                    </button>
                                                    <button
                                                        className="button"
                                                        onClick={() => close()}
                                                    >
                                                        Cerrar
                                                    </button>
                                                </footer>
                                            </div>
                                        </div>
                                    )}
                                </Popup>
                            ) : null}
                        </div>
                    </div>
                </section>
                <div className="row columns is-multiline is-centered">
                    {loading ? (
                        <progress
                            className="progress is-small is-primary"
                            max="100"
                        >
                            15%
                        </progress>
                    ) : (
                        products()
                    )}
                    {!store?.employees.includes(user()) && (
                        <div className="column is-half is-4">
                            <div className="card">
                                <div className="card-image">
                                    <figure className="image is-1by1 mx-3 my-3">
                                        <img
                                            src="/images/empty.svg"
                                            alt="empty store"
                                        />
                                    </figure>
                                </div>
                                <div className="card-content has-text-centered">
                                    <div className="media">
                                        <div className="media-content">
                                            <p className="title is-4">
                                                ¿Quieres agregar algo nuevo?
                                            </p>
                                        </div>
                                    </div>
                                    <Link
                                        className="button is-info"
                                        to={{
                                            pathname: '/AddProduct',
                                            state: {
                                                storeId: store?._id,
                                            },
                                        }}
                                    >
                                        Crear Producto
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
