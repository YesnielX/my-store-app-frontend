/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Link, Redirect, useLocation } from 'react-router-dom';

import { IStore } from '../../services/api';

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

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const store: IStore = location.state.store;

    // render store products
    const products = store.products.map(product => (
        <div className="column is-half is-4" key={product._id}>
            <div className="card">
                <div className="card-image">
                    <figure className="image is-1by1 mx-3 my-3">
                        <img src={product.imagePath} alt={product.name} />
                    </figure>
                </div>
                <div className="card-content">
                    <div className="media">
                        <div className="media-content">
                            <p className="title is-4">{product.name}</p>
                        </div>
                    </div>
                    <Link
                        className="button is-info"
                        to={{
                            pathname: '/Product',
                            state: {
                                product: product,
                            },
                        }}
                    >
                        Ver Producto
                    </Link>
                </div>
            </div>
        </div>
    ));

    return (
        <div className="section animate__animated animate__slideInUp">
            <div className="container">
                <div className="row columns is-multiline is-centered">
                    {products}
                </div>
            </div>
        </div>
    );
};
