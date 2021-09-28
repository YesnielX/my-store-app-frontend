/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

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

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const product: IProduct = location.state.product;

    const makeReport = () => {
        void cogoToast.error('Reporte No Disponible');
    };

    const makeSold = () => {
        void cogoToast.success('Producto Vendido');
    };

    // render store products
    const productRender = (
        <div className="is-full" key={product._id}>
            <div
                className="container product-detail box"
                style={{
                    margin: 3,
                }}
            >
                <br />
                <div className="columns">
                    <div className="column is-5-desktop is-5-tablet is-12-mobile">
                        <img
                            src={product.imagePath}
                            alt="image"
                            style={{
                                maxHeight: '500px',
                            }}
                        />
                    </div>

                    <div className="column is-7-desktop is-5-tablet is-12-mobile content-detail">
                        <dt
                            style={{
                                fontSize: '1.7em',
                                textTransform: 'uppercase',
                            }}
                        >
                            {product.name}
                        </dt>
                        <dt
                            style={{
                                fontSize: '1.2em',
                                textTransform: 'uppercase',
                            }}
                        >
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
