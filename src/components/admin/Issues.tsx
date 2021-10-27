/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { getAppReports, IAppReport, user } from '../../services/api';

export default () => {
    const [issues, setIssues] = useState<IAppReport[]>([]);
    const [loading, setLoading] = useState(true);

    async function fetchData() {
        await getAppReports().then(res => {
            if (res.status === 200) {
                setLoading(false);
                setIssues(res.data.data);
            }
        });
    }
    useEffect(() => {
        if ((user().isLogged && user().isAdmin) || user().isPrincipalAdmin) {
            console.log('user is logged');
            void fetchData();
            setInterval(() => {
                void fetchData();
            }, 15000);
        } else {
            window.location.href = '/Login';
        }
    }, []);

    const renderStores = () => {
        if (issues && issues.length !== 0) {
            return issues.map(issue => {
                return (
                    <Link
                        className="column is-5"
                        id={issue._id}
                        key={issue.title}
                        to={{
                            pathname: '/Issue',
                            state: {
                                report: issue,
                            },
                        }}
                    >
                        <div className="card">
                            <div className="card-image">
                                <figure className="image is-4by3">
                                    <img
                                        src={issue.imagePath}
                                        alt="store image"
                                    />
                                </figure>
                            </div>
                            <div className="card-content">
                                <div className="media">
                                    <div className="media-content">
                                        <p className="title is-4">
                                            {issue.title}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                );
            });
        } else {
            return (
                <div className="column is-7">
                    <img src="/images/empty.svg" alt="empty" />
                </div>
            );
        }
    };

    return (
        <div className="has-text-centered justify-content animate__animated animate__slideInUp">
            <div className="section">
                <div>
                    <div className="row columns is-multiline is-centered">
                        {renderStores()}
                        {loading && (
                            <progress
                                className="progress is-small is-primary"
                                max="100"
                            >
                                15%
                            </progress>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
