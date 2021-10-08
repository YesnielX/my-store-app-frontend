/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import cogoToast from 'cogo-toast';
import { useEffect, useState } from 'react';
import { Redirect, useLocation } from 'react-router-dom';

import {
    getReports,
    getStores,
    IReport,
    IStore,
    user,
} from '../../services/api';
import Products from '../Products';
import Reports from '../Reports';
import Settings from '../Settings';

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

    const [store, setStore] = useState<IStore>();
    const [reports, setReports] = useState<IReport[]>();
    const [loading, setLoading] = useState(true);

    const [tabActived, setTabActived] = useState(1);

    async function fetchData() {
        await getStores()
            .then(async res => {
                if (res.status === 200) {
                    if (location.state.store.author._id === user()._id) {
                        setStore(
                            res.data.data.myStores.find(
                                (store: IStore) =>
                                    store._id === location.state.store._id
                            )
                        );
                        console.log('You Store');
                    } else if (location.state.store.managers.includes(user())) {
                        setStore(
                            res.data.data.managerStores.find(
                                (store: IStore) =>
                                    store._id === location.state.store._id
                            )
                        );
                        console.log('You Manager Store');
                    }
                    if (
                        location.state.store.employees.find(
                            e => e._id === user()._id
                        )
                    ) {
                        setStore(
                            res.data.data.employeesStores.find(
                                (store: IStore) =>
                                    store._id === location.state.store._id
                            )
                        );
                        console.log('You Employee Store');
                    }

                    if (store?.employees.find(e => e._id !== user()._id)) {
                        console.log('Get Reports');
                        await getReports(location.state.store._id).then(res => {
                            if (res.status === 200) {
                                setReports(res.data.data);
                            }
                        });
                    }
                }
            })
            .then(() => {
                setLoading(false);

                void cogoToast.info('Tienda Actualizada.');
            });
    }

    useEffect(() => {
        if (user().isLogged) {
            void fetchData();
        }
        setInterval(() => {
            if (localStorage.getItem('load') === 'true') {
                void fetchData();
                localStorage.setItem('load', 'false');
            }
        }, 500);
    }, []);

    const renderTab = () => {
        if (tabActived === 1) {
            return <Products store={store as IStore} />;
        } else if (tabActived === 2) {
            return <Settings store={store as IStore} />;
        } else if (
            tabActived === 3 &&
            !store?.employees.find(e => e._id === user()._id)
        ) {
            return (
                <Reports
                    store={store as IStore}
                    reports={reports as IReport[]}
                />
            );
        }
    };

    return (
        <div className="column animate__animated animate__slideInUp">
            <div className="container has-text-centered">
                <section className="hero">
                    <div className="hero-body">
                        <div className="container">
                            <h1 className="title">{store?.name}</h1>
                            <div className="tabs is-centered">
                                {store?.author._id === user()._id ||
                                store?.managers.find(
                                    e => e._id === user()._id
                                ) ? (
                                    <ul
                                        id="tab-list"
                                        onClick={(e: any) => {
                                            document
                                                .getElementById('tab-list')
                                                ?.childNodes.forEach(elm => {
                                                    (
                                                        elm as HTMLElement
                                                    ).classList.remove(
                                                        'is-active'
                                                    );
                                                });
                                            e.target.parentElement.classList.add(
                                                'is-active'
                                            );
                                            setTabActived(
                                                Number(
                                                    e.target.parentElement.id
                                                )
                                            );
                                        }}
                                    >
                                        <li className="is-active" id="1">
                                            <a>Productos</a>
                                        </li>
                                        <li id="2">
                                            <a>Ajustes</a>
                                        </li>
                                        <li id="3">
                                            <a>Reportes</a>
                                        </li>
                                    </ul>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </section>
                <div className="row columns is-multiline is-centered">
                    {loading ? (
                        <div className="mx-4">
                            <progress
                                className="progress is-small is-primary"
                                max="100"
                            >
                                15%
                            </progress>
                        </div>
                    ) : (
                        renderTab()
                    )}
                </div>
            </div>
        </div>
    );
};
