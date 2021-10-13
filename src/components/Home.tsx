import { ComponentType, Suspense, useEffect } from 'react';
import {
    BrowserRouter as Router,
    Redirect,
    Route,
    Switch,
} from 'react-router-dom';

import Header from './Header';
import Stores from './Stores';

function loadRoutes() {
    const context = import.meta.globEager('./pages/*.tsx');

    const routes: Array<Route> = [];
    const views = Object.keys(context);
    for (const key of views) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const view: ComponentType = context[key].default;
        const name = key.replace(/(\.\/pages\/|\.tsx)/g, '');
        routes.push(
            (
                <Route
                    path={'/' + name}
                    component={view}
                    key={'router-' + name}
                ></Route>
            ) as unknown as Route
        );
    }
    return routes;
}

export default () => {
    useEffect(() => {
        const details = document.getElementById('details');
        if (window.innerWidth < 850) {
            details?.classList.add('is-fullwidth');
            details?.classList.remove('panel-tabs');
        } else {
            details?.classList.remove('is-fullwidth');
            details?.classList.add('panel-tabs');
        }

        window.onresize = () => {
            const details = document.getElementById('details');
            if (window.innerWidth < 850) {
                details?.classList.add('is-fullwidth');
                details?.classList.remove('panel-tabs');
            } else {
                details?.classList.remove('is-fullwidth');
                details?.classList.add('panel-tabs');
            }
        };
    }, []);
    return (
        <Suspense
            fallback={
                <div
                    className="section"
                    style={{
                        marginTop: '10px',
                    }}
                >
                    <progress
                        className="progress is-small is-primary"
                        max="100"
                    >
                        15%
                    </progress>
                </div>
            }
        >
            <div className="my-3 animate__animated animate__fadeIn" id="main">
                <Router>
                    <Header />
                    <div className="container">
                        <Switch>
                            {loadRoutes()}
                            <Route exact path="*">
                                <Redirect to="/"></Redirect>
                            </Route>
                        </Switch>
                    </div>
                    <Route exact path="/" component={Stores}></Route>
                </Router>
            </div>
        </Suspense>
    );
};
