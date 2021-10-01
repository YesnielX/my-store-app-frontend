import cogoToast from 'cogo-toast';
import { Redirect, useLocation } from 'react-router-dom';

import { IProduct } from '../../services/api';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default () => {
    const location: {
        pathname: string;
        state: {
            product: IProduct;
        };
    } = useLocation();

    if (location.state === undefined || location.state.product === undefined) {
        return <Redirect to="/" />;
    }

    if (location.state === undefined) {
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
                <div className="columns is-centered is-7-desktop">
                    <div className="column is-full-desktop is-5-tablet is-mobile content-detail">
                        <div className="has-text-centered">
                            <img
                                src={product.imagePath}
                                alt="image"
                                style={{
                                    maxHeight: '500px',
                                }}
                            />
                        </div>
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
                            Precio &nbsp;
                            <label
                                className="tag is-success is-rounded"
                                htmlFor="price"
                            >
                                USD.
                                <span>{product.price}</span>
                            </label>
                            <br />
                        </div>

                        <div className="price">
                            Precio De Compra &nbsp;
                            <label
                                className="tag is-success is-rounded"
                                htmlFor="price"
                            >
                                USD.
                                <span>{product.price}</span>
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
    );

    return (
        <div className="section animate__animated animate__slideInUp">
            <div className="container">
                <div className="">{productRender}</div>
            </div>
        </div>
    );
};
