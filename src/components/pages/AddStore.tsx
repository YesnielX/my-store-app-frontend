/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import cogoToast from 'cogo-toast';
import { ChangeEvent, useEffect, useState } from 'react';

import {
    createStore,
    getStores,
    IServerResponse,
    uploadImage,
} from '../../services/api';

export default () => {
    const [image, setImage] = useState('');
    const [name, setName] = useState('');

    const loadImage = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) {
            return;
        }

        const file = e.target.files[0];
        console.log(file);
        const form = new FormData();
        form.append('image', file, file.name);
        console.log(form);
        void cogoToast.loading('Uploading Image...').then(() => {
            void uploadImage(form).then(req => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                void req.json().then((res: IServerResponse) => {
                    console.log('response', res);
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

    const sendCreateStore = () => {
        if (
            image === '' ||
            image === '/images/empty.svg' ||
            name === '' ||
            name.length < 3
        ) {
            void cogoToast.error('Faltan datos');
            return;
        }

        void cogoToast.loading('Creando Tienda...').then(() => {
            void createStore(name, image)
                .then(res => {
                    console.log(res);

                    void cogoToast.success('Tienda Creada!.');
                    void getStores();
                    window.location.href = '/';
                })
                .catch(err => {
                    console.log(err);
                    void cogoToast.error(err.response.data.error);
                });
        });
    };

    useEffect(() => {
        if (!image.length) {
            setImage('/images/empty.svg');
        }
    }, []);

    return (
        <div className="section my-auto">
            <div className="is-full">
                <div
                    className="container product-detail box"
                    style={{
                        margin: 3,
                    }}
                >
                    <br />
                    <div className="file my-3">
                        <label className="file-label">
                            <input
                                className="file-input"
                                type="file"
                                name="resume"
                                onChange={loadImage}
                            />
                            <span className="file-cta">
                                <span className="file-icon">
                                    <i className="fas fa-upload"></i>
                                </span>
                                <span className="file-label">
                                    Seleccione una imagen
                                </span>
                            </span>
                        </label>
                    </div>
                    <div className="columns">
                        <div className="column is-5-desktop is-5-tablet is-12-mobile">
                            <figure className="image">
                                <img
                                    src={image}
                                    alt="image"
                                    id="image"
                                    style={{
                                        maxHeight: '500px',
                                    }}
                                />
                            </figure>
                        </div>

                        <div className="column is-7-desktop is-5-tablet is-12-mobile content-detail">
                            <dt
                                style={{
                                    fontSize: '1.1em',
                                }}
                            >
                                <p className="control has-icons-left">
                                    <input
                                        className="input"
                                        type="text"
                                        placeholder="Nombre"
                                        onChange={e => setName(e.target.value)}
                                    />
                                    <span className="icon is-small is-left">
                                        <i className="fas fa-signature"></i>
                                    </span>
                                </p>
                            </dt>

                            <hr />
                            <button
                                className="button is-full is-danger mx-1 my-1"
                                onClick={() => (window.location.href = '/')}
                            >
                                Cancelar
                            </button>
                            <button
                                className="button is-full is-primary mx-1 my-1"
                                onClick={sendCreateStore}
                            >
                                Agregar
                            </button>
                            <div className="column is-hidden-desktop is-1-tablet is-hidden-mobile"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};