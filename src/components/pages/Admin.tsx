/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';

import { getUsers, IUser, user } from '../../services/api';
import Roles from '../admin/Roles';
import Users from '../admin/Users';

export default () => {
    if (!user().isAdmin) {
        return <Redirect to="/" />;
    }

    const [tabActived, setTabActived] = useState('users');

    const renderTab = () => {
        switch (tabActived) {
            case 'users':
                return <Users />;

            case 'roles':
                return <Roles />;
            default:
                return <div>Unknown</div>;
        }
    };

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
                </ul>
            </div>
            <div className="section mt-6">
                <div>{renderTab()}</div>
            </div>
        </>
    );
};
