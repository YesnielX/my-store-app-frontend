/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import cogoToast from 'cogo-toast';
import { ChangeEvent, useEffect, useRef, useState } from 'react';

import {
    addEmployee,
    addManager,
    deleteEmployee,
    deleteManager,
    getStores,
    IStore,
    updateStore,
    uploadImage,
    user,
} from '../services/api';

export default (props: { store: IStore }) => {
    const [store, setStore] = useState<IStore>(props.store);

    const [image, setImage] = useState(store.imagePath);
    const [name, setName] = useState(props.store?.name);

    const [updateNewManagerEmail, setUpdateNewManagerEmail] = useState('');
    const [updateNewEmployeeEmail, setUpdateNewEmployeeEmail] = useState('');

    const settingsControl = useRef(null);

    const inputFile = useRef<HTMLInputElement>(null);

    const loadImage = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) {
            return;
        }

        const file = e.target.files[0];
        const form = new FormData();
        form.append('image', file, file.name);
        void cogoToast.loading('Subiendo Imagen...').then(() => {
            void uploadImage(form).then(req => {
                void req.json().then(res => {
                    if (req.status === 201) {
                        void cogoToast.success('Imagen Subida Con Exito!');
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

    async function fetchData() {
        await getStores().then(res => {
            if (res.status === 200) {
                if (store.author._id === user()._id) {
                    setStore(
                        res.data.data.myStores.find(
                            (store: IStore) => store._id === store._id
                        )
                    );
                    console.log('You Store');
                } else if (store.managers.includes(user())) {
                    setStore(
                        res.data.data.managerStores.find(
                            (store: IStore) => store._id === store._id
                        )
                    );
                    console.log('You Manager Store');
                }
                if (store.employees.find(e => e._id === user()._id)) {
                    setStore(
                        res.data.data.employeesStores.find(
                            (store: IStore) => store._id === store._id
                        )
                    );
                    console.log('You Employee Store');
                }
            }
        });
    }

    const sendStoreUpdate = () => {
        if (!name?.length) {
            void cogoToast.error('Se require un nombre para la tienda');
            return;
        }

        if (name === store?.name && image === store?.imagePath) {
            void cogoToast.info('Sin Cambios.');
            return;
        }

        void cogoToast.loading('Actualizando...').then(() => {
            void updateStore(
                props.store?._id,
                name || store?.name,
                image || store?.imagePath
            ).then(res => {
                if (res.status === 200) {
                    void fetchData();
                    localStorage.setItem('load', 'true');
                }
            });
        });
    };

    useEffect(() => {
        if (user().isLogged) {
            void fetchData();
        } else {
            window.location.href = '/';
        }

        window.onresize = () => {
            if (window.innerWidth > 850) {
                (
                    settingsControl.current as unknown as HTMLElement
                ).classList.add('is-flex');
            } else {
                (
                    settingsControl.current as unknown as HTMLElement
                ).classList.remove('is-flex');
                (
                    settingsControl.current as unknown as HTMLElement
                ).classList.add('is-flex-direction-row');
            }
        };
    }, []);

    return (
        <div className="column is-9 animate__animated animate__fadeIn">
            <div>
                <section>
                    <div className="file is-hidden">
                        <label className="file-label">
                            <input
                                className="file-input"
                                type="file"
                                name="resume"
                                ref={inputFile}
                                onChange={loadImage}
                            />
                        </label>
                    </div>
                    <figure className="image is-5by3 my-2 mx-auto">
                        <img
                            src={image}
                            alt="store image"
                            onClick={() => inputFile.current?.click()}
                        />
                    </figure>
                    <div ref={settingsControl}>
                        <div className="field mx-2">
                            <label className="label">Nombre</label>
                            <div className="control">
                                <input
                                    className="input"
                                    type="text"
                                    placeholder="Nombre de la tienda"
                                    defaultValue={store?.name}
                                    onChange={e => setName(e.target.value)}
                                />
                            </div>
                        </div>
                        {store?.author._id === user()._id && (
                            <div className="field mx-2">
                                <label className="label">Agregar Manager</label>
                                <div className="control">
                                    <input
                                        className="input"
                                        type="email"
                                        placeholder="Email"
                                        onChange={e => {
                                            setUpdateNewManagerEmail(
                                                e.target.value
                                            );
                                        }}
                                        onKeyDown={e => {
                                            if (e.key === 'Enter') {
                                                void cogoToast
                                                    .loading(
                                                        'Agregando Manager...'
                                                    )
                                                    .then(() => {
                                                        if (
                                                            !updateNewManagerEmail
                                                        ) {
                                                            void cogoToast.error(
                                                                'Complete los campos'
                                                            );
                                                            return;
                                                        }

                                                        addManager(
                                                            store?._id,
                                                            updateNewManagerEmail
                                                        )
                                                            .then(res => {
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
                                                            })
                                                            .catch(() => {
                                                                void cogoToast
                                                                    .error(
                                                                        'Error al agregar manager'
                                                                    )
                                                                    .then(
                                                                        () => {
                                                                            void fetchData();
                                                                        }
                                                                    );
                                                            });
                                                    });
                                            }
                                        }}
                                    />
                                    <div>
                                        {store?.managers.map(manager => (
                                            <p
                                                className="tag is-primary mt-2 ml-1"
                                                key={manager._id}
                                            >
                                                {manager.email}
                                                <button
                                                    className="delete"
                                                    onClick={e => {
                                                        e.preventDefault();
                                                        void cogoToast
                                                            .loading(
                                                                'Eliminando Manager...'
                                                            )
                                                            .then(() => {
                                                                void deleteManager(
                                                                    store?._id,
                                                                    manager._id
                                                                ).then(res => {
                                                                    if (
                                                                        res.status ===
                                                                        200
                                                                    ) {
                                                                        void cogoToast.success(
                                                                            'Manager Eliminado'
                                                                        );
                                                                        void fetchData();
                                                                    }
                                                                });
                                                            });
                                                    }}
                                                ></button>
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="field mx-2">
                            <label className="label">Agregar Empleado</label>
                            <div className="control">
                                <input
                                    className="input"
                                    type="email"
                                    placeholder="Email"
                                    onChange={e => {
                                        setUpdateNewEmployeeEmail(
                                            e.target.value
                                        );
                                    }}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') {
                                            void cogoToast
                                                .loading(
                                                    'Agregando Empleado...'
                                                )
                                                .then(() => {
                                                    if (
                                                        !updateNewEmployeeEmail
                                                    ) {
                                                        void cogoToast.error(
                                                            'Complete los campos'
                                                        );
                                                        return;
                                                    }

                                                    addEmployee(
                                                        store?._id,
                                                        updateNewEmployeeEmail
                                                    )
                                                        .then(res => {
                                                            if (
                                                                res.status ===
                                                                200
                                                            ) {
                                                                void cogoToast.success(
                                                                    'Empleado Agregado'
                                                                );
                                                                void fetchData();
                                                            }
                                                        })
                                                        .catch(() => {
                                                            void cogoToast
                                                                .error(
                                                                    'Error al agregar empleado'
                                                                )
                                                                .then(() => {
                                                                    void fetchData();
                                                                });
                                                        });
                                                });
                                        }
                                    }}
                                />
                                <div>
                                    {store?.employees.map(employee => (
                                        <p
                                            className="tag is-primary mt-2 ml-1"
                                            key={employee._id}
                                        >
                                            {employee.email}
                                            <button
                                                className="delete"
                                                onClick={e => {
                                                    e.preventDefault();
                                                    void cogoToast
                                                        .loading(
                                                            'Eliminando Empleado...'
                                                        )
                                                        .then(() => {
                                                            void deleteEmployee(
                                                                store?._id,
                                                                employee._id
                                                            ).then(res => {
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
                                                            });
                                                        });
                                                }}
                                            ></button>
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <br />
                <footer className="buttons is-centered">
                    <button
                        className="button is-success"
                        onClick={() => {
                            sendStoreUpdate();
                        }}
                    >
                        Guardar
                    </button>
                </footer>
            </div>
        </div>
    );
};
