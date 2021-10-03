import cogoToast from 'cogo-toast';
import { Redirect, useHistory, useLocation } from 'react-router-dom';

import { IProduct, IStore } from '../../services/api';

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

    if (location.state === undefined || location.state.product === undefined) {
        return <Redirect to="/" />;
    }

    const product: IProduct = location.state.product;

    const makeReport = () => {
        void cogoToast.error('Reporte No Disponible');
    };

    const makeSold = () => {
        void cogoToast.success('Producto Vendido');
    };

    const productRender = (
        <div key={product._id}>
            <div
                className=" product-detail box"
                style={{
                    margin: 3,
                }}
            >
                <br />
                <div className=" is-centered is-7-desktop">
                    <div className=" is-full-desktop is-5-tablet is-mobile content-detail">
                        <div className="has-text-centered">
                            <img
                                src={product.imagePath}
                                alt="image"
                                style={{
                                    maxHeight: '500px',
                                }}
                            />
                        </div>
                        <div>
                            <dt
                                style={{
                                    fontSize: '1.7em',
                                    textTransform: 'uppercase',
                                }}
                            >
                                {product.name}
                            </dt>
                            <hr />
                            <dt
                                style={{
                                    fontSize: '1.2em',
                                    textTransform: 'uppercase',
                                }}
                            >
                                <p>Categorias: </p>
                                {product.categories.map((category, index) => (
                                    <span
                                        className="tag ml-1 is-primary"
                                        key={index}
                                    >
                                        {category}
                                    </span>
                                ))}
                            </dt>
                            <hr />
                            <dt
                                style={{
                                    fontSize: '1.2em',
                                    textTransform: 'uppercase',
                                }}
                            >
                                <p>Tamaños: </p>
                                {product.sizes.map((category, index) => (
                                    <span
                                        className="tag ml-1 is-primary"
                                        key={index}
                                    >
                                        {category}
                                    </span>
                                ))}
                            </dt>
                            <hr />
                            <p
                                style={{
                                    fontSize: '1.2em',
                                    textTransform: 'uppercase',
                                }}
                            >
                                {product.description}
                            </p>
                            <hr />
                            <div className="price">
                                <label
                                    className="tag is-success is-rounded"
                                    htmlFor="price"
                                >
                                    USD <span>{product.price}</span>
                                </label>
                                <br />
                            </div>

                            <div className="price">
                                <label
                                    className="tag is-success is-rounded"
                                    htmlFor="price"
                                >
                                    USD <span>{product.price}</span>
                                </label>
                                <br />
                                <br />
                            </div>

                            <div>
                                Disponibles &nbsp;
                                <label className="tag is-primary is-rounded">
                                    <span>{product.stock}</span>
                                </label>
                                <br />
                            </div>

                            <div>
                                Vendidos &nbsp;
                                <label className="tag is-danger is-rounded">
                                    <span>{product.solds}</span>
                                </label>
                                <br />
                                <br />
                            </div>

                            <hr />
                            <button
                                className="button is-full is-danger mx-1 my-1"
                                onClick={makeReport}
                            >
                                Reportar producto
                            </button>
                            <button
                                className="button is-full is-primary mx-1 my-1"
                                onClick={makeSold}
                            >
                                Marcar Como Vendido
                            </button>
                            <div className="column is-hidden-desktop is-1-tablet is-hidden-mobile"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const productR = (
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
                            <table className="table panel-tabs">
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
                                            <strong>Creado</strong>
                                        </td>
                                        <td>
                                            {new Date(
                                                product.createdAt
                                            ).toLocaleString()}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="has-text-right">
                                            <strong>Actualizado</strong>
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

                            <p className="buttons">
                                <a className="button is-primary">
                                    Marcar como vendido
                                </a>
                                <a className="button is-danger">Reportar</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="section animate__animated animate__slideInUp">
            <div className="container">
                <div className="">{productR}</div>
            </div>
        </div>
    );
};
