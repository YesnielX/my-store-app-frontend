/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import cogoToast from 'cogo-toast';
import { Link, Redirect, useLocation } from 'react-router-dom';

import { deleteProduct, IStore } from '../../services/api';

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

    const sendDeleteProduct = (id: string) => {
        console.log(id);
        void deleteProduct(id).then(res => {
            if (res.status === 200) {
                void cogoToast.success('Producto Eliminado.');
            }
        });
    };

    const store: IStore =
        (JSON.parse(localStorage.getItem('myStores') || '[]').youStores.find(
            (store: IStore) => store._id === location.state.store._id
        ) as IStore) ||
        (JSON.parse(
            localStorage.getItem('myStores') || '[]'
        ).managerStores.find(
            (store: IStore) => store._id === location.state.store._id
        ) as IStore);

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
                    <div className="buttons">
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
                        <button
                            className="button is-danger"
                            onClick={() => sendDeleteProduct(product._id)}
                        >
                            Eliminar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    ));

    return (
        <div className="section animate__animated animate__slideInUp">
            <div className="container">
                <div className="row columns is-multiline is-centered">
                    {store.products.length > 0 ? products : null}
                    <div className="column is-half is-4">
                        <div className="card">
                            <div className="card-image">
                                <figure className="image is-1by1 mx-3 my-3">
                                    <img
                                        src="/images/empty.svg"
                                        alt="empty store"
                                    />
                                </figure>
                            </div>
                            <div className="card-content has-text-centered">
                                <div className="media">
                                    <div className="media-content">
                                        <p className="title is-4">
                                            ¿Quieres agregar algo nuevo?
                                        </p>
                                    </div>
                                </div>
                                <Link
                                    className="button is-info"
                                    to={{
                                        pathname: '/AddProduct',
                                        state: {
                                            storeId: store._id,
                                        },
                                    }}
                                >
                                    Crear Producto
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
