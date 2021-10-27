/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import cogoToast from 'cogo-toast';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Redirect, useHistory, useLocation } from 'react-router-dom';

import {
    deleteAppReport,
    getAppReports,
    IAppReport,
    markAppReportAsResolved,
    uploadImage,
    user,
} from '../../services/api';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default () => {
    const location: {
        pathname: string;
        state: {
            report: IAppReport;
        };
    } = useLocation();

    const history = useHistory();

    if (location.state === undefined || location.state.report === undefined) {
        return <Redirect to="/" />;
    }

    const [issue, setIssue] = useState<IAppReport>(location.state.report);
    const [loading, setLoading] = useState(true);

    const sendDeleteAppReport = (id: string) => {
        void deleteAppReport(id).then(res => {
            if (res.status === 200) {
                void cogoToast.success('Reporte Eliminado.');
                history.goBack();
            }
        });
    };

    function fetchData() {
        void getAppReports().then(res => {
            if (res.status === 200) {
                (res.data?.data as IAppReport[]).find((report: IAppReport) => {
                    if (report._id === location.state.report._id) {
                        setIssue(report);
                        void cogoToast.success('Reporte Actualizado');
                    }
                });
            }
        });
        return;
    }

    useEffect(() => {
        setLoading(false);
        void fetchData();
        document.title = `${issue.title} - Admin`;
    }, []);

    const productRender = (
        <div key={issue._id}>
            <div>
                <div className="product-header">
                    <div className="container">
                        <div className="columns">
                            <div className="column">
                                <a
                                    className="title is-3"
                                    onClick={() => history.goBack()}
                                >
                                    <i className="fas fa-chevron-left"></i>
                                    &nbsp; Volver
                                </a>
                                <span className="title is-3 has-text-muted">
                                    &nbsp;|&nbsp;
                                </span>
                                <span className="title is-4 has-text-muted">
                                    Admin
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="columns">
                        <div className="column is-6">
                            <div className="image is-2by2">
                                <img
                                    className="mt-6"
                                    src={issue.imagePath}
                                    alt={issue.title}
                                />
                            </div>
                        </div>
                        <div className="column is-5 is-offset-1">
                            <div className="title is-2">{issue.title}</div>

                            <br />
                            <p>{issue.description}</p>
                            <br />

                            <table className="table is-striped">
                                <tbody>
                                    <tr>
                                        <td>Creacion</td>
                                        <td>
                                            {new Date(
                                                issue.createdAt
                                            ).toLocaleString()}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Actualizacion</td>
                                        <td>
                                            {new Date(
                                                issue.updatedAt
                                            ).toLocaleString()}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Usuario</td>
                                        <td>{issue.author.email}</td>
                                    </tr>
                                    <tr>
                                        <td>Resuelto</td>
                                        <td>
                                            <span
                                                className={`tag ${
                                                    issue.solved
                                                        ? 'is-success'
                                                        : 'is-info'
                                                }`}
                                            >
                                                {issue.solved
                                                    ? 'Resuelto'
                                                    : 'No Resuelto'}
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <div className="buttons">
                                <button
                                    className="button is-danger"
                                    onClick={() =>
                                        sendDeleteAppReport(issue._id)
                                    }
                                >
                                    Eliminar
                                </button>

                                {!issue.solved && (
                                    <button
                                        className="button is-primary"
                                        onClick={() => {
                                            void markAppReportAsResolved(
                                                issue._id
                                            ).then(res => {
                                                if (res.status === 200) {
                                                    void cogoToast.success(
                                                        'Producto vendido.'
                                                    );
                                                    void fetchData();
                                                }
                                            });
                                        }}
                                    >
                                        Marcar como resuelto
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="section animate__animated animate__slideInUp">
            <div className="container">
                <div className="">
                    {loading ? (
                        <progress
                            className="progress is-small is-primary"
                            max="100"
                        >
                            15%
                        </progress>
                    ) : (
                        productRender
                    )}
                </div>
            </div>
        </div>
    );
};
