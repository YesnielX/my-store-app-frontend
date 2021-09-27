import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Header from './Header';
import Store from './Store';

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
    return (
        <div className="my-3">
            <Router>
                <Header />
                <div
                    className="container
"
                >
                    <Switch>{loadRoutes()}</Switch>
                </div>
            </Router>
        </div>
    );
};
