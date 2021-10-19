import cogoToast from 'cogo-toast';
import { useEffect, useState } from 'react';

import { getRoles, IRole, updateRole } from '../../services/api';

export default () => {
    const [roles, setRoles] = useState<IRole[]>([]);

    const sendUpdateRole = (id: string, role: IRole) => {
        const roleElement = document.getElementById(id);
        const roleName = (
            roleElement?.querySelector('#name') as HTMLInputElement
        ).value;
        const roleDescription = (
            roleElement?.querySelector('#description') as HTMLInputElement
        ).value;

        const maxStores = Number(
            (roleElement?.querySelector('#stores') as HTMLInputElement).value
        );
        const maxEmployees = Number(
            (roleElement?.querySelector('#employees') as HTMLInputElement).value
        );
        const maxManagers = Number(
            (roleElement?.querySelector('#managers') as HTMLInputElement).value
        );
        const maxProducts = Number(
            (roleElement?.querySelector('#products') as HTMLInputElement).value
        );

        // check if all fields are equal to roleObject
        if (
            roleName === role.name &&
            roleDescription === role.description &&
            maxStores === role.permissions.maxStores &&
            maxEmployees === role.permissions.maxEmployees &&
            maxManagers === role.permissions.maxManagers &&
            maxProducts === role.permissions.maxProducts
        ) {
            return;
        }

        if (roleElement) {
            if (
                !roleName ||
                !roleDescription ||
                !maxStores ||
                !maxEmployees ||
                !maxManagers ||
                !maxProducts
            ) {
                return;
            }

            roleElement.attributes.setNamedItem(
                document.createAttribute('disabled')
            );
            void updateRole(id, roleName, roleDescription, {
                maxStores: maxStores,
                maxEmployees: maxEmployees,
                maxManagers: maxManagers,
                maxProducts: maxProducts,
            }).then(res => {
                if (res.status === 200) {
                    void cogoToast.success('Rol actualizado.');
                    // disable role.attributes disabled
                    roleElement.attributes.removeNamedItem('disabled');
                    void fetchData();
                } else {
                    void cogoToast.error('Error al actualizar el rol.');
                }
            });
        }
    };

    const fetchData = () => {
        void getRoles().then(res => {
            if (res.status === 200) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                setRoles(res.data.data);
            }
        });
    };

    useEffect(() => {
        void fetchData();
    }, []);

    const renderRoles = () => {
        return roles.map(role => {
            return (
                <fieldset
                    className="column is-11"
                    id={String(role._id)}
                    key={role._id}
                >
                    <div className="card">
                        <div className="card-content">
                            <div className="media">
                                <div className="media-content">
                                    <h1 className="title">{role.name}</h1>
                                    <div className="field is-horizontal">
                                        <div className="field-body">
                                            <div className="field">
                                                <label className="label">
                                                    Nombre
                                                </label>
                                                <p className="control is-expanded has-icons-left">
                                                    <input
                                                        className="input"
                                                        type="text"
                                                        placeholder="Nombre"
                                                        id="name"
                                                        defaultValue={role.name}
                                                    />
                                                    <span className="icon is-small is-left">
                                                        <i className="fas fa-store"></i>
                                                    </span>
                                                </p>
                                            </div>
                                            <div className="field">
                                                <label className="label">
                                                    Descripcion
                                                </label>
                                                <p className="control is-expanded has-icons-left">
                                                    <input
                                                        className="input"
                                                        type="text"
                                                        placeholder="Descripcion"
                                                        id="description"
                                                        defaultValue={
                                                            role.description
                                                        }
                                                    />
                                                    <span className="icon is-small is-left">
                                                        <i className="fas fa-store"></i>
                                                    </span>
                                                </p>
                                            </div>
                                            <div className="field">
                                                <label className="label">
                                                    Tiendas
                                                </label>
                                                <p className="control is-expanded has-icons-left">
                                                    <input
                                                        className="input"
                                                        type="text"
                                                        placeholder="Limite de tiendas"
                                                        id="stores"
                                                        defaultValue={
                                                            role.permissions
                                                                .maxStores
                                                        }
                                                    />
                                                    <span className="icon is-small is-left">
                                                        <i className="fas fa-store"></i>
                                                    </span>
                                                </p>
                                            </div>
                                            <div className="field">
                                                <div className="control">
                                                    <label className="label">
                                                        Empleados
                                                    </label>
                                                    <input
                                                        className="input"
                                                        type="number"
                                                        id="employees"
                                                        defaultValue={
                                                            role.permissions
                                                                .maxEmployees
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div className="field">
                                                <div className="control">
                                                    <label className="label">
                                                        Managers
                                                    </label>
                                                    <input
                                                        className="input"
                                                        type="number"
                                                        id="managers"
                                                        defaultValue={
                                                            role.permissions
                                                                .maxManagers
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div className="field">
                                                <div className="control">
                                                    <label className="label">
                                                        Productos
                                                    </label>
                                                    <input
                                                        className="input"
                                                        type="number"
                                                        id="products"
                                                        defaultValue={
                                                            role.permissions
                                                                .maxProducts
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="field is-grouped is-grouped-centered">
                                        <p className="control">
                                            <a
                                                className="button is-primary"
                                                onClick={e => {
                                                    e.preventDefault();
                                                    sendUpdateRole(
                                                        String(role._id),
                                                        role
                                                    );
                                                }}
                                            >
                                                Guardar
                                            </a>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </fieldset>
            );
        });
    };
    return (
        <div className="columns is-multiline is-centered animate__animated animate__slideInUp">
            {renderRoles()}
        </div>
    );
};
