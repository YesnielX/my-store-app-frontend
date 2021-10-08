import { Link } from 'react-router-dom';

import { IReport, IStore } from '../services/api';

export default (props: { store: IStore; reports: IReport[] }) => {
    const store = props.store;
    const reports = props.reports;
    return (
        <>
            {reports.length > 0 ? (
                reports.map(report => (
                    <div className="column is-half is-5 mx-4" key={report._id}>
                        <div className="card">
                            <div className="card-image">
                                <Link
                                    to={{
                                        pathname: '/Report',
                                        state: {
                                            store,
                                            report,
                                        },
                                    }}
                                >
                                    <figure className="image mx-3 my-3">
                                        <img
                                            src={report.imagePath}
                                            alt={report.product}
                                        />
                                    </figure>
                                </Link>
                            </div>
                            <div className="card-content">
                                <div className="media">
                                    <div className="media-content">
                                        <p className="title is-5">
                                            {report.title}
                                        </p>
                                        <p className="text">
                                            {report.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="column is-9 mx-2">
                    <img src="/images/empty.svg" alt="empty" />
                </div>
            )}
        </>
    );
};
