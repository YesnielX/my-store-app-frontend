/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import cogoToast from 'cogo-toast';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Link, Redirect, useHistory, useLocation } from 'react-router-dom';
import Popup from 'reactjs-popup';

import {
    createReport,
    deleteProduct,
    getStores,
    IProduct,
    IStore,
    soldProduct,
    uploadImage,
    user,
} from '../../services/api';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default () => {
    const location: {
        pathname: string;
        state: {
            store: IStore;
            product: IProduct;
        };
    } = useLocation();

    const history = useHistory();

    if (
        location.state === undefined ||
        location.state.store === undefined ||
        location.state.product === undefined
    ) {
        return <Redirect to="/" />;
    }

    const [product, setProduct] = useState<IProduct>(location.state.product);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(product.imagePath);
    const [loading, setLoading] = useState(true);

    const inputFile = useRef<HTMLInputElement>(null);

    const loadImage = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) {
            return;
        }

        const file = e.target.files[0];
        const form = new FormData();
        form.append('image', file, file.name);
        void cogoToast.loading('Subiendo Imagen...').then(() => {
            void uploadImage(form).then((req: Response) => {
                void req.json().then(res => {
                    if (req.status === 201) {
                        void cogoToast.success('Imagen Subida Con Exito!');
                        setImage(res.data as string);
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

    const sendCreateReport = () => {
        if (!title || !description) {
            void cogoToast.error('Complete Todos Los Campos.');
            return;
        }

        void cogoToast
            .loading('Enviando Reporte....', {
                hideAfter: 2,
            })
            .then(() => {
                void createReport(
                    location.state.store._id,
                    product._id,
                    title,
                    description,
                    image
                ).then(res => {
                    if (res.status === 201) {
                        void cogoToast.success('Reporte enviado con exito!');
                    }
                });
            });
    };

    const sendDeleteProduct = (id: string) => {
        void deleteProduct(id).then(res => {
            if (res.status === 200) {
                void cogoToast.success('Producto Eliminado.');
                void fetchData();
            }
        });
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    async function fetchData() {
        await getStores().then(res => {
            if (res.status === 200) {
                if (location.state.store.author._id === user()._id) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                    (res.data?.data?.myStores as IStore[]).find(
                        (store: IStore) => {
                            if (store._id === location.state.store._id) {
                                setProduct(
                                    store.products.find(
                                        (product: IProduct) =>
                                            product._id ===
                                            location.state.product._id
                                    ) as IProduct
                                );
                                void cogoToast.success('Producto Actualizado');
                            }
                        }
                    );
                }
            }
        });
    }

    useEffect(() => {
        setLoading(false);
        void fetchData();
    }, []);

    const productRender = (
        <div key={product._id}>
            <div>
                <div className="product-header">
                    <div className="container">
                        <div className="columns">
                            <div className="column">
                                <a
                                    className="title is-3"
                                    onClick={() => history.goBack()}
                                >
                                    <i className="fas fa-chevron-left"></i>
                                    &nbsp; Volver
                                </a>
                                <span className="title is-3 has-text-muted">
                                    &nbsp;|&nbsp;
                                </span>
                                <span className="title is-4 has-text-muted">
                                    {location.state.store?.name}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="columns">
                        <div className="column is-6">
                            <div className="image is-2by2">
                                <img
                                    className="mt-6"
                                    src={product.imagePath}
                                    alt={product.name}
                                />
                            </div>
                        </div>
                        <div className="column is-5 is-offset-1">
                            <div className="title is-2">{product.name}</div>
                            <p className="title is-3 has-text-muted">
                                $ {product.price} | {product.purchasePrice}
                            </p>
                            <hr />

                            <br />
                            <p>{product.description}</p>
                            <br />
                            <table
                                className="table panel-tabs is-family-code"
                                id="details"
                            >
                                <tbody>
                                    <tr>
                                        <td className="has-text-right">
                                            <strong>ID</strong>
                                        </td>
                                        <td>{product._id}</td>
                                    </tr>
                                    <tr>
                                        <td className="has-text-right">
                                            <strong>Categorias</strong>
                                        </td>
                                        <td>
                                            {product.categories.map(
                                                (category, index) => (
                                                    <span
                                                        className="tag ml-1 is-primary"
                                                        key={index}
                                                    >
                                                        {category}
                                                    </span>
                                                )
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="has-text-right">
                                            <strong>Tamaños</strong>
                                        </td>
                                        <td>
                                            {product.sizes.map(
                                                (size, index) => (
                                                    <span
                                                        className="tag ml-1 is-primary"
                                                        key={index}
                                                    >
                                                        {size}
                                                    </span>
                                                )
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="has-text-right">
                                            <strong>Creacion</strong>
                                        </td>
                                        <td>
                                            {new Date(
                                                product.createdAt
                                            ).toLocaleString()}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="has-text-right">
                                            <strong>Actualizacion</strong>
                                        </td>
                                        <td>
                                            {new Date(
                                                product.updatedAt
                                            ).toLocaleString()}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="has-text-right">
                                            <strong>Disponibles</strong>
                                        </td>
                                        <td>{product.stock}</td>
                                    </tr>
                                    <tr>
                                        <td className="has-text-right">
                                            <strong>Vendidos</strong>
                                        </td>
                                        <td>{product.solds}</td>
                                    </tr>
                                </tbody>
                            </table>

                            <div className="buttons">
                                {!location.state.store?.employees.find(
                                    e => e._id === user()._id
                                ) && (
                                    <button
                                        className="button is-danger"
                                        onClick={() =>
                                            sendDeleteProduct(product._id)
                                        }
                                    >
                                        Eliminar
                                    </button>
                                )}

                                <Popup
                                    trigger={
                                        <button className="button is-danger">
                                            Reportar
                                        </button>
                                    }
                                >
                                    {(close: () => void) => (
                                        <div className="modal is-active animate__animated animate__fadeIn">
                                            <div className="modal-background"></div>
                                            <div className="modal-card p-2">
                                                <header className="modal-card-head">
                                                    <p className="modal-card-title">
                                                        Nuevo Reporte
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
                                                            src={image}
                                                            alt="store image"
                                                            className="image my-2 mx-auto"
                                                            onClick={() =>
                                                                inputFile.current?.click()
                                                            }
                                                        />
                                                    </figure>
                                                    <div className="field">
                                                        <label className="label">
                                                            Titulo
                                                        </label>
                                                        <div className="control">
                                                            <input
                                                                className="input"
                                                                type="text"
                                                                placeholder="Titulo"
                                                                onChange={e =>
                                                                    setTitle(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="field">
                                                        <label className="label">
                                                            Descripcion
                                                        </label>
                                                        <div className="control">
                                                            <textarea
                                                                className="textarea"
                                                                placeholder="Descripcion"
                                                                onChange={e =>
                                                                    setDescription(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </section>
                                                <footer className="modal-card-foot">
                                                    <button
                                                        className="button is-success"
                                                        onClick={() => {
                                                            sendCreateReport();
                                                            close();
                                                        }}
                                                    >
                                                        Enviar
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
                                <button
                                    className="button is-primary"
                                    onClick={() => {
                                        void soldProduct(
                                            location.state.store._id,
                                            product._id
                                        ).then(res => {
                                            if (res.status === 200) {
                                                void cogoToast.success(
                                                    'Producto marcado como vendido.'
                                                );
                                                void fetchData();
                                            }
                                        });
                                    }}
                                >
                                    Marcar como vendido
                                </button>

                                <Link
                                    className="button is-primary"
                                    to={{
                                        pathname: '/EditProduct',
                                        state: {
                                            store: location.state.store,
                                            product,
                                        },
                                    }}
                                >
                                    Editar
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="section animate__animated animate__slideInUp">
            <div className="container">
                <div className="">
                    {loading ? (
                        <progress
                            className="progress is-small is-primary"
                            max="100"
                        >
                            15%
                        </progress>
                    ) : (
                        productRender
                    )}
                </div>
            </div>
        </div>
    );
};
