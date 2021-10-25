/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { getStoresAsAdmin, IStore, user } from '../../services/api';

export default () => {
    const [stores, setStores] = useState<IStore[]>([]);
    const [loading, setLoading] = useState(true);

    async function fetchData() {
        console.log(window.location);
        await getStoresAsAdmin().then(res => {
            if (res.status === 200) {
                setLoading(false);
                setStores(res.data.data.myStores);
            }
        });
    }
    useEffect(() => {
        if (user().isLogged) {
            console.log('user is logged');
            void fetchData();
            setInterval(() => {
                void fetchData();
            }, 15000);
        } else {
            window.location.href = '/Login';
        }
    }, []);

    const renderStores = () => {
        if (stores && stores.length !== 0) {
            return stores.map(store => {
                return (
                    <Link
                        className="column is-4"
                        id={store._id}
                        key={store.name}
                        to={{
                            pathname: '/Store',
                            state: {
                                store: store,
                                adminPanel:
                                    window.location.pathname === '/Admin'
                                        ? true
                                        : false,
                            },
                        }}
                    >
                        <div className="card">
                            <div className="card-image">
                                <figure className="image is-4by3">
                                    <img
                                        src={store.imagePath}
                                        alt="store image"
                                    />
                                </figure>
                            </div>
                            <div className="card-content">
                                <div className="media">
                                    <div className="media-content">
                                        <p className="title is-4">
                                            {store.name}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                );
            });
        } else if (!stores) {
            return (
                <div className="column is-7">
                    <img src="/images/empty.svg" alt="empty" />
                </div>
            );
        }
    };

    return (
        <div className="has-text-centered justify-content animate__animated animate__slideInUp">
            <div className="section">
                <div>
                    <div className="row columns is-multiline is-centered">
                        {renderStores()}
                        {loading && (
                            <progress
                                className="progress is-small is-primary"
                                max="100"
                            >
                                15%
                            </progress>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
