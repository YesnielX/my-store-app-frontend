/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import cogoToast from 'cogo-toast';
import { useEffect, useState } from 'react';
import { Redirect, useHistory, useLocation } from 'react-router-dom';

import {
    createReport,
    deleteReport,
    getReports,
    IReport,
    IStore,
} from '../../services/api';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default () => {
    const location: {
        pathname: string;
        state: {
            store: IStore;
            report: IReport;
        };
    } = useLocation();

    const history = useHistory();

    if (location.state === undefined || location.state.report === undefined) {
        return <Redirect to="/" />;
    }

    const [report, setReport] = useState<IReport>(location.state.report);

    const [loading, setLoading] = useState(true);

    const sendDeleteReport = (id: string) => {
        void deleteReport(id).then(res => {
            if (res.status === 200) {
                void cogoToast.success('Reporte Eliminado.');
                void fetchData();
            }
        });
        history.goBack();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    async function fetchData() {
        await getReports(location.state.store._id).then(res => {
            if (res.status === 200) {
                setReport(
                    (res.data.data as IReport[]).find(
                        (report: IReport) =>
                            report._id === location.state.report._id
                    ) as IReport
                );
                setLoading(false);
            }
        });
    }

    useEffect(() => {
        setLoading(true);
        void fetchData();
    }, []);

    const reportRender = (
        <div key={report._id}>
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
                                    {location.state.store.name}
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
                                    src={report.imagePath}
                                    alt={report.title}
                                />
                            </div>
                        </div>
                        <div className="column is-5 is-offset-1">
                            <div className="title is-2">{report.title}</div>

                            <hr />

                            <br />
                            <p>{report.description}</p>
                            <br />
                            <table className="table panel-tabs is-family-code">
                                <tbody>
                                    <tr>
                                        <td className="has-text-right">
                                            <strong>ID</strong>
                                        </td>
                                        <td>{report._id}</td>
                                    </tr>

                                    <tr>
                                        <td className="has-text-right">
                                            <strong>Creacion</strong>
                                        </td>
                                        <td>
                                            {new Date(
                                                report.createdAt
                                            ).toLocaleString()}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="has-text-right">
                                            <strong>Usuario</strong>
                                        </td>
                                        <td>
                                            {report.author.username} (
                                            {report.author.email})
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <div className="buttons">
                                <button
                                    className="button is-danger"
                                    onClick={() => sendDeleteReport(report._id)}
                                >
                                    Eliminar
                                </button>
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
                        reportRender
                    )}
                </div>
            </div>
        </div>
    );
};
