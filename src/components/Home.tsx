import { Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { getStores } from '../services/api';
import Header from './Header';
import Stores from './Stores';

function loadRoutes() {
    const context = import.meta.globEager('./pages/*.tsx');

    const routes: Array<Route> = [];
    const views = Object.keys(context);
    for (const key of views) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const view = context[key].default;
        const name = key.replace(/(\.\/pages\/|\.tsx)/g, '');
        routes.push(
            (
                <Route
                    exact
                    path={'/' + name}
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    component={view}
                    key={'router-' + name}
                ></Route>
            ) as unknown as Route
        );
    }
    return routes;
}

export default () => {
    void getStores();
    return (
        <Suspense fallback={<>Loading...</>}>
            <div className="my-3 animate__animated animate__fadeIn" id="main">
                <Router>
                    <Header />
                    <div className="container">
                        <Switch>{loadRoutes()}</Switch>
                    </div>
                    <Route exact path="/" component={Stores}></Route>
                </Router>
            </div>
        </Suspense>
    );
};
