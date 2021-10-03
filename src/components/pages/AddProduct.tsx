/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import cogoToast from 'cogo-toast';
import { ChangeEvent, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import {
    createProduct,
    getStores,
    IServerResponse,
    uploadImage,
} from '../../services/api';

export default () => {
    const [image, setImage] = useState('/images/empty.svg');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [categories, setCategories] = useState<string[]>([]);
    const [sizes, setSizes] = useState<string[]>([]);
    const [price, setPrice] = useState(0);
    const [purchasePrice, setPurchasePrice] = useState(0);
    const [stocks, setStocks] = useState(0);

    const [categoryToAdd, setCategoryToAdd] = useState<string>('');
    const [sizeToAdd, setSizeToAdd] = useState<string>('');

    const inputFile = useRef<HTMLInputElement>(null);

    const location: {
        pathname: string;
        state: {
            storeId: string;
        };
    } = useLocation();

    const history = useHistory();

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

    const addCategorie = (e: { key: string }) => {
        if (e.key === 'Enter') {
            if (!categoryToAdd.length) {
                return;
            }

            setCategoryToAdd('');

            if (categories.includes(categoryToAdd)) {
                void cogoToast.error('Categoria ya agregada.');
                return;
            }

            setCategories([...categories, categoryToAdd]);
        }
    };

    const addSize = (e: { key: string }) => {
        if (e.key === 'Enter') {
            if (!sizeToAdd.length) {
                return;
            }

            setSizeToAdd('');

            if (sizes.includes(sizeToAdd)) {
                void cogoToast.error('Tamaño ya agregado.');
                return;
            }

            setSizes([...sizes, sizeToAdd]);
        }
    };

    const sendCreateProduct = () => {
        if (
            !image.length ||
            image === '/images/empty.svg' ||
            !name.length ||
            !description.length ||
            !categories.length ||
            !sizes.length ||
            !price ||
            !purchasePrice ||
            !stocks
        ) {
            void cogoToast.error('Todos los campos son obligatorios.');
            return;
        }

        void cogoToast.loading('Creando Producto...').then(() => {
            void createProduct(
                location.state.storeId,
                name,
                description,
                price,
                purchasePrice,
                stocks,
                categories,
                sizes,
                image
            ).then(req => {
                if (req.status === 201) {
                    void cogoToast.success('Producto creado con exito.');
                }
            });
        });

        void getStores();

        history.goBack();
    };

    return (
        <div className="section">
            <div className="is-full">
                <div
                    className="container product-detail box"
                    style={{
                        margin: 3,
                    }}
                >
                    <br />
                    <div className="columns is-centered is-7-desktop">
                        <div className="column is-full-desktop is-5-tablet is-mobile content-detail">
                            <div className="has-text-centered">
                                <div className="file my-3 is-hidden">
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
                                <img
                                    src={image}
                                    alt="image"
                                    style={{
                                        maxHeight: '500px',
                                    }}
                                    onClick={() => inputFile.current?.click()}
                                />
                            </div>
                            <br />
                            <dt
                                style={{
                                    fontSize: '1.1em',
                                }}
                            >
                                <div className="control has-icons-left">
                                    <input
                                        className="input"
                                        type="text"
                                        placeholder="Nombre"
                                        onChange={e => setName(e.target.value)}
                                    />
                                    <span className="icon is-small is-left">
                                        <i className="fas fa-signature"></i>
                                    </span>
                                </div>
                            </dt>
                            <hr />
                            <dt
                                style={{
                                    fontSize: '1.2em',
                                    textTransform: 'uppercase',
                                }}
                            >
                                <div className="control has-icons-left mt-3">
                                    <input
                                        className="input"
                                        type="text"
                                        placeholder="Categorias"
                                        value={categoryToAdd}
                                        onChange={e =>
                                            setCategoryToAdd(e.target.value)
                                        }
                                        onKeyDown={addCategorie}
                                    />
                                    <span className="icon is-small is-left">
                                        <i className="fas fa-audio-description"></i>
                                    </span>
                                </div>
                                {categories.map((category, index) => (
                                    <span
                                        className="tag ml-1 is-primary"
                                        key={index}
                                    >
                                        {category}
                                        <button
                                            className="delete is-small"
                                            onClick={e => {
                                                e.preventDefault();
                                                setCategories(
                                                    categories.filter(
                                                        c => c !== category
                                                    )
                                                );
                                            }}
                                        ></button>
                                    </span>
                                ))}
                            </dt>
                            <br />
                            <dt
                                style={{
                                    fontSize: '1.2em',
                                    textTransform: 'uppercase',
                                }}
                            >
                                <div className="control has-icons-left mt-3">
                                    <input
                                        className="input"
                                        type="text"
                                        placeholder="Tamaños"
                                        value={sizeToAdd}
                                        onChange={e =>
                                            setSizeToAdd(e.target.value)
                                        }
                                        onKeyDown={addSize}
                                    />
                                    <span className="icon is-small is-left">
                                        <i className="fas fa-audio-description"></i>
                                    </span>
                                </div>
                                {sizes.map((size, index) => (
                                    <span
                                        className="tag ml-1 is-primary"
                                        key={index}
                                    >
                                        {size}
                                        <button
                                            className="delete is-small"
                                            onClick={e => {
                                                e.preventDefault();
                                                setSizes(
                                                    sizes.filter(
                                                        c => c !== size
                                                    )
                                                );
                                            }}
                                        ></button>
                                    </span>
                                ))}
                            </dt>
                            <hr />
                            <div
                                style={{
                                    fontSize: '1.2em',
                                    textTransform: 'uppercase',
                                }}
                            >
                                <div className="control has-icons-left">
                                    <textarea
                                        className="textarea is-primary"
                                        placeholder="Descripcion"
                                        onChange={e =>
                                            setDescription(e.target.value)
                                        }
                                    ></textarea>
                                </div>
                            </div>

                            <div className="price mt-3">
                                <div className="control has-icons-left is-small">
                                    <input
                                        className="input"
                                        type="number"
                                        placeholder="Precio"
                                        onChange={e =>
                                            setPrice(Number(e.target.value))
                                        }
                                    />
                                    <span className="icon is-small is-left">
                                        <i className="fas fa-dollar-sign"></i>
                                    </span>
                                </div>
                            </div>

                            <div className="price mt-3">
                                <div className="control has-icons-left is-small">
                                    <input
                                        className="input"
                                        type="number"
                                        placeholder="Precio de compra"
                                        onChange={e =>
                                            setPurchasePrice(
                                                Number(e.target.value)
                                            )
                                        }
                                    />
                                    <span className="icon is-small is-left">
                                        <i className="fas fa-dollar-sign"></i>
                                    </span>
                                </div>
                            </div>

                            <div className="mt-3">
                                <div className="control has-icons-left is-small">
                                    <input
                                        className="input"
                                        type="number"
                                        placeholder="Disponibles"
                                        onChange={e =>
                                            setStocks(Number(e.target.value))
                                        }
                                    />
                                    <span className="icon is-small is-left">
                                        <i className="fas fa-sort-amount-up-alt"></i>
                                    </span>
                                </div>
                            </div>

                            <hr />
                            <button
                                className="button is-full is-danger mx-1 my-1"
                                onClick={() => (window.location.href = '/')}
                            >
                                Cancelar
                            </button>
                            <button
                                className="button is-full is-primary mx-1 my-1"
                                onClick={sendCreateProduct}
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
