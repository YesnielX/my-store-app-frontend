/* eslint-disable jsx-a11y/no-onchange */
import cogoToast from 'cogo-toast';
import { useEffect, useState } from 'react';

import {
    getRoles,
    getUsers,
    IRole,
    IUser,
    updateUserRoles,
} from '../../services/api';

export default () => {
    const [users, setUsers] = useState<IUser[]>([]);
    const [roles, setRoles] = useState<IRole[]>([]);

    const [searchUser, setSearchUser] = useState('');

    const fetchData = () => {
        void getUsers().then(res => {
            if (res.status === 200) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                setUsers(res.data.data);
            }
        });

        void getRoles().then(res => {
            if (res.status === 200) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                setRoles(res.data.data);
            }
        });
    };

    const updateUsersRoles = () => {
        // search users with roles and update
        const usersWithRoles = users.filter(user => user.roles.length > 0);

        if (usersWithRoles.length > 0) {
            usersWithRoles.forEach(user => {
                const userRoles = user.roles.map(role => role);
                void updateUserRoles(user._id, userRoles);
            });
            void cogoToast.success('Roles de usuarios actualizados.');
        }
    };

    const renderUsers = (users: IUser[]) => {
        return users.map(user => {
            return (
                <div className="column is-3" id={user._id} key={user._id}>
                    <div className="card">
                        <div className="card-image mt-2">
                            <figure className="has-text-centered">
                                <i className="fas fa-user fa-10x"></i>
                            </figure>
                        </div>
                        <div className="card-content">
                            <div className="media">
                                <div className="media-content">
                                    <div className="field">
                                        <label className="label">ID</label>
                                        <input
                                            type="text"
                                            className="input"
                                            defaultValue={user._id}
                                            disabled
                                        />
                                    </div>
                                    <div className="field">
                                        <label className="label">Nombre</label>
                                        <input
                                            type="text"
                                            className="input"
                                            defaultValue={user.username}
                                            disabled
                                        />
                                    </div>
                                    <div className="field">
                                        <label className="label">Correo</label>
                                        <input
                                            type="text"
                                            className="input"
                                            defaultValue={user.email}
                                            disabled
                                        />
                                    </div>
                                    {user.roles.length > 0 && (
                                        <div className="field">
                                            <label className="label">
                                                Roles
                                            </label>
                                            {user.roles.map(role => {
                                                return (
                                                    <span
                                                        className="tag is-info ml-1"
                                                        key={role._id}
                                                    >
                                                        {role.name}
                                                        <button
                                                            className="delete is-small"
                                                            onClick={e => {
                                                                e.preventDefault();
                                                                const roles =
                                                                    user.roles.filter(
                                                                        r =>
                                                                            r._id !==
                                                                            role._id
                                                                    );

                                                                const newUsers =
                                                                    users.map(
                                                                        u => {
                                                                            if (
                                                                                u._id ===
                                                                                user._id
                                                                            ) {
                                                                                u.roles =
                                                                                    roles;
                                                                            }
                                                                            return u;
                                                                        }
                                                                    );

                                                                setUsers(
                                                                    newUsers
                                                                );
                                                                void cogoToast
                                                                    .loading(
                                                                        'Removiendo Rol del usuario...'
                                                                    )
                                                                    .then(
                                                                        () => {
                                                                            void updateUserRoles(
                                                                                user._id,
                                                                                roles
                                                                            ).then(
                                                                                res => {
                                                                                    if (
                                                                                        res.status ===
                                                                                        200
                                                                                    ) {
                                                                                        void cogoToast.success(
                                                                                            'Rol removido del usuario.'
                                                                                        );
                                                                                    }
                                                                                }
                                                                            );
                                                                        }
                                                                    );
                                                            }}
                                                        ></button>
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    )}
                                    <div className="field">
                                        <div className="select">
                                            <select
                                                onChange={e => {
                                                    if (
                                                        e.target.value === '0'
                                                    ) {
                                                        return;
                                                    }

                                                    if (
                                                        user.roles.find(
                                                            role =>
                                                                String(
                                                                    role._id
                                                                ) ===
                                                                e.target.value
                                                        )
                                                    ) {
                                                        return;
                                                    }

                                                    const newRoles = [
                                                        ...user.roles,
                                                    ];

                                                    newRoles.push(
                                                        roles.find(
                                                            role =>
                                                                String(
                                                                    role._id
                                                                ) ===
                                                                String(
                                                                    e.target
                                                                        .value
                                                                )
                                                        ) as IRole
                                                    );

                                                    const newUsers = [...users];

                                                    (
                                                        newUsers.find(
                                                            u =>
                                                                String(
                                                                    u._id
                                                                ) ===
                                                                String(user._id)
                                                        ) as IUser
                                                    ).roles = newRoles;

                                                    setUsers(newUsers);

                                                    void cogoToast
                                                        .loading(
                                                            'Agregando Rol...'
                                                        )
                                                        .then(() => {
                                                            void updateUserRoles(
                                                                user._id,
                                                                newRoles
                                                            ).then(res => {
                                                                if (
                                                                    res.status ===
                                                                    200
                                                                ) {
                                                                    void cogoToast.success(
                                                                        'Rol Agregado'
                                                                    );
                                                                }
                                                            });
                                                        });
                                                }}
                                            >
                                                <option value="0">Roles</option>
                                                {roles.map(role => {
                                                    return (
                                                        <option
                                                            key={role._id}
                                                            value={role._id}
                                                        >
                                                            {role.name}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        });
    };

    const renderSpecificUser = () => {
        return users.map(user => {
            if (
                user._id.includes(searchUser) ||
                user.email.includes(searchUser) ||
                user.username.includes(searchUser)
            ) {
                return renderUsers([user]);
            }
        });
    };

    useEffect(() => {
        void fetchData();
    }, []);

    return (
        <div>
            <div className="level">
                <div className="level-left">
                    <div className="level-item">
                        <p className="subtitle is-5">
                            <strong>{users.length}</strong> Usuarios |
                        </p>
                    </div>
                    <div className="level-item">
                        <div className="field has-addons">
                            <p className="control">
                                <input
                                    className="input"
                                    type="text"
                                    placeholder="Nombre de usuario"
                                    onChange={e =>
                                        setSearchUser(e.target.value)
                                    }
                                />
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <hr />
            <div className="columns is-multiline is-centered animate__animated animate__slideInUp">
                {searchUser !== '' ? renderSpecificUser() : renderUsers(users)}
            </div>
        </div>
    );
};
