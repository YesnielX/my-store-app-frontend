import { Link } from 'react-router-dom';

import { IStore, user } from '../services/api';

export default (props: { store: IStore; adminPanel: boolean }) => {
    const store = props.store;

    return (
        <>
            {store.products && store.products.length > 0
                ? props.store?.products.map(product => (
                      <div
                          className="column is-half is-5 mx-4"
                          key={product._id}
                      >
                          <Link
                              to={{
                                  pathname: '/Product',
                                  state: {
                                      store: props.store,
                                      product,
                                      adminPanel: props.adminPanel,
                                  },
                              }}
                          >
                              <div className="card">
                                  <div className="card-image">
                                      <figure className="image">
                                          <img
                                              src={product.imagePath}
                                              alt={product.name}
                                          />
                                      </figure>
                                  </div>
                                  <div className="card-content">
                                      <div className="media">
                                          <div className="media-content">
                                              <p className="title is-5">
                                                  {product.name}
                                              </p>
                                              <p className="text">
                                                  {product.description}
                                              </p>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </Link>
                      </div>
                  ))
                : null}
            {!props.adminPanel &&
            store.products.length === 0 &&
            store.employees.find(employee => employee._id === user()._id) ? (
                <div className="column is-9 mx-2">
                    <img src="/images/empty.svg" alt="empty" />
                </div>
            ) : null}
            {!store?.employees.find(e => e._id === user()._id) ||
            (props.adminPanel && user().isAdmin) ||
            (props.adminPanel && user().isPrincipalAdmin) ? (
                <div className="column is-half is-4 mx-4">
                    <div className="card">
                        <div className="card-image">
                            <figure className="image is-1by1">
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
                                        storeId: store?._id,
                                    },
                                }}
                            >
                                Crear Producto
                            </Link>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
};
