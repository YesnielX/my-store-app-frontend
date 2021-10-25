/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import cogoToast from 'cogo-toast';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { editProduct, IProduct, IStore, uploadImage } from '../../services/api';

export default () => {
    const location: {
        pathname: string;
        state: {
            store: IStore;
            product: IProduct;
        };
    } = useLocation();

    const history = useHistory();

    const product = location.state.product;
    const [image, setImage] = useState(product.imagePath);
    const [name, setName] = useState(product.name);
    const [description, setDescription] = useState(product.description);
    const [categories, setCategories] = useState<string[]>(product.categories);
    const [sizes, setSizes] = useState<string[]>(product.sizes);
    const [price, setPrice] = useState(product.price);
    const [purchasePrice, setPurchasePrice] = useState(product.purchasePrice);
    const [stocks, setStocks] = useState(product.stock);

    const [categoryToAdd, setCategoryToAdd] = useState<string>('');
    const [sizeToAdd, setSizeToAdd] = useState<string>('');

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

    const sendEditProduct = () => {
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

        void cogoToast.loading('Editando Producto...').then(() => {
            void editProduct(
                location.state.product._id,
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
                    void cogoToast.success('Producto editado con exito.');
                    history.goBack();
                }
            });
        });
    };

    useEffect(() => {
        document.title = `Editar Producto - ${product.name}`;
    }, []);

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
                                        defaultValue={name}
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
                                        defaultValue={description}
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
                                        defaultValue={price}
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
                                        defaultValue={purchasePrice}
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
                                        defaultValue={stocks}
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
                                onClick={sendEditProduct}
                            >
                                Editar
                            </button>
                            <div className="column is-hidden-desktop is-1-tablet is-hidden-mobile"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
