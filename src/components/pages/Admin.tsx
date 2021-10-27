/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';

import { user } from '../../services/api';
import Issues from '../admin/Issues';
import Roles from '../admin/Roles';
import Stores from '../admin/Stores';
import Users from '../admin/Users';

export default () => {
    if (!user().isAdmin && !user().isPrincipalAdmin) {
        console.log('Not admin');
        return <Redirect to="/" />;
    }

    const [tabActived, setTabActived] = useState('users');

    const renderTab = () => {
        switch (tabActived) {
            case 'users':
                return <Users />;

            case 'roles':
                return <Roles />;

            case 'stores':
                return <Stores />;
            case 'reports':
                return <Issues />;
            default:
                setTabActived('users');
                return <Users />;
        }
    };

    useEffect(() => {
        // change page title
        document.title = 'Admin';
    }, []);

    return (
        <>
            <div className="tabs is-centered">
                <ul
                    id="tab-list"
                    onClick={(e: any) => {
                        document
                            .getElementById('tab-list')
                            ?.childNodes.forEach(elm => {
                                (elm as HTMLElement).classList.remove(
                                    'is-active'
                                );
                            });
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                        e.target.parentElement.classList.add('is-active');
                        setTabActived(e.target.parentElement.id);
                    }}
                >
                    <li className="is-active" id="users">
                        <a>Usuarios</a>
                    </li>
                    <li id="roles">
                        <a>Roles</a>
                    </li>
                    <li id="stores">
                        <a>Tiendas</a>
                    </li>
                    <li id="reports">
                        <a>Reportes</a>
                    </li>
                </ul>
            </div>
            <div className="section mt-6">
                <div>{renderTab()}</div>
            </div>
        </>
    );
};
