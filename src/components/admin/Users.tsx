import { useEffect, useState } from 'react';

import { getUsers, IUser } from '../../services/api';

export default () => {
    const [users, setUsers] = useState<IUser[]>([]);

    useEffect(() => {
        void getUsers().then(res => {
            if (res.status === 200) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                setUsers(res.data.data);
            }
        });
    }, []);

    const renderUsers = () => {
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
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        });
    };
    return (
        <div className="columns is-multiline is-centered animate__animated animate__slideInUp">
            {renderUsers()}
        </div>
    );
};
