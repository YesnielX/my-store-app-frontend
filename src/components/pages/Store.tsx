/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import cogoToast from 'cogo-toast';
import { useEffect, useState } from 'react';
import { Redirect, useHistory, useLocation } from 'react-router-dom';

import {
    getReports,
    getStores,
    getStoresAsAdmin,
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
            adminPanel: boolean;
        };
    } = useLocation();

    const history = useHistory();

    if (location.state === undefined || location.state.store === undefined) {
        return <Redirect to="/" />;
    }

    const [store, setStore] = useState<IStore>(location.state.store);
    const [reports, setReports] = useState<IReport[]>();
    const [loading, setLoading] = useState(true);

    const [tabActived, setTabActived] = useState(1);

    async function fetchData() {
        if (location.state.adminPanel) {
            console.log('get store as admin');
            void getStoresAsAdmin().then(res => {
                if (res.status === 200) {
                    setStore(
                        res.data.data.myStores.find(
                            (store: IStore) =>
                                store._id === location.state.store._id
                        )
                    );
                    void getReports(location.state.store._id).then(res => {
                        if (res.status === 200) {
                            setReports(res.data.data);
                        }
                    });
                    setLoading(false);
                }
            });
            return;
        }

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

                    if (!store?.employees.find(e => e._id === user()._id)) {
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
        document.title = store.name;
    }, []);

    const renderTab = () => {
        if (tabActived === 1) {
            return (
                <Products
                    store={store}
                    adminPanel={location.state.adminPanel}
                />
            );
        } else if (tabActived === 2) {
            return (
                <Settings
                    store={store}
                    adminPanel={location.state.adminPanel}
                />
            );
        } else if (tabActived === 3) {
            return <Reports store={store} reports={reports as IReport[]} />;
        }
    };

    return (
        <div className="column animate__animated animate__slideInUp">
            <div className="container has-text-centered">
                <section className="hero">
                    <div className="hero-body">
                        <div className="container">
                            <a
                                className="level-left title is-3"
                                onClick={() => history.goBack()}
                            >
                                <i className="fas fa-chevron-left"></i>
                                &nbsp; Volver
                            </a>
                            <h1 className="title" id={store._id}>
                                {store?.name}
                            </h1>
                            <div className="tabs is-centered">
                                {!store?.employees.find(
                                    e => e._id === user()._id
                                ) ||
                                (location.state.adminPanel && user().isAdmin) ||
                                (location.state.adminPanel &&
                                    user().isPrincipalAdmin) ? (
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
                                        {!store?.employees.find(
                                            e => e._id === user()._id
                                        ) ||
                                        (location.state.adminPanel &&
                                            user().isAdmin) ||
                                        (location.state.adminPanel &&
                                            user().isPrincipalAdmin) ? (
                                            <li id="3">
                                                <a>Reportes</a>
                                            </li>
                                        ) : null}
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
