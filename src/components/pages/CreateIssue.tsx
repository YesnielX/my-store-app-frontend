/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import cogoToast from 'cogo-toast';
import { ChangeEvent, useEffect, useRef, useState } from 'react';

import { createAppReport, uploadImage } from '../../services/api';

export default () => {
    const [image, setImage] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const inputFile = useRef<HTMLInputElement>(null);

    const loadImage = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) {
            return;
        }

        const file = e.target.files[0];
        console.log(file);
        const form = new FormData();
        form.append('image', file, file.name);
        console.log(form);
        void cogoToast.loading('Subiendo Imagen...').then(() => {
            void uploadImage(form).then(req => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                void req.json().then(res => {
                    console.log('response', res);
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

    const sendCreateAppReport = () => {
        if (
            image === '' ||
            image === '/images/empty.svg' ||
            title === '' ||
            title.length < 3
        ) {
            void cogoToast.error('Complete todos los campos');
            return;
        }

        void cogoToast.loading('Creando Reporte...').then(() => {
            void createAppReport(title, description, image).then(res => {
                console.log(res);

                if (res.status === 201) {
                    void cogoToast.success('Reporte enviado!.');
                    window.location.href = '/';
                }
            });
        });
    };

    useEffect(() => {
        if (!image.length) {
            setImage('/images/empty.svg');
        }
        document.title = 'Crear Reporte';
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
                    <div className="columns">
                        <div className="column ">
                            <figure className="image is-4by3">
                                <img
                                    src={image}
                                    alt="Report Image"
                                    onClick={() => {
                                        inputFile.current?.click();
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
                                        placeholder="Titulo"
                                        onChange={e => setTitle(e.target.value)}
                                    />
                                    <span className="icon is-small is-left">
                                        <i className="fas fa-signature"></i>
                                    </span>
                                </p>
                            </dt>
                            <br />
                            <dt
                                style={{
                                    fontSize: '1.1em',
                                }}
                            >
                                <p className="control has-icons-left">
                                    <textarea
                                        cols={30}
                                        rows={10}
                                        className="textarea"
                                        placeholder="Descripcion"
                                        onChange={e =>
                                            setDescription(e.target.value)
                                        }
                                    ></textarea>
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
                                onClick={sendCreateAppReport}
                            >
                                Reportar
                            </button>
                            <div className="column is-hidden-desktop is-1-tablet is-hidden-mobile"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
