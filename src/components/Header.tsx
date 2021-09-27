import { useState } from 'react';
import { Link } from 'react-router-dom';

import { user } from '../services/api';

export default () => {
    const [isActive, setIsActive] = useState(false);

    return (
        <>
            <div>
                <nav
                    className="navbar"
                    role="navigation"
                    aria-label="main navigation"
                >
                    <div className="navbar-brand">
                        <a className="navbar-item" href="/">
                            <h1 className="title">My Store App</h1>
                        </a>

                        <a
                            className="navbar-burger"
                            aria-label="menu"
                            aria-expanded="false"
                            data-target="navbarBasicExample"
                            onClick={() => setIsActive(!isActive)}
                        >
                            <span aria-hidden="true"></span>
                            <span aria-hidden="true"></span>
                            <span aria-hidden="true"></span>
                        </a>
                    </div>

                    <div
                        className={`navbar-menu animate__animated ${
                            isActive ? 'is-active animate__flipInX' : ''
                        }`}
                        onClick={() => setIsActive(false)}
                    >
                        <div className="navbar-end has-text-centered">
                            <div className="navbar-item has-dropdown is-hoverable">
                                <Link
                                    className="navbar-item"
                                    to={'/Account'}
                                    key={'router-account'}
                                >
                                    Account
                                </Link>
                                <Link
                                    className="navbar-item"
                                    to={'/Contact'}
                                    key={'router-contact'}
                                >
                                    Contact
                                </Link>
                                <Link
                                    className="navbar-item"
                                    to={'/About'}
                                    key={'router-about'}
                                >
                                    About
                                </Link>
                            </div>
                            <div className="navbar-item">
                                <div className="">
                                    <Link
                                        className={`button is-light mr-4 ${
                                            [user()].length !== 0 &&
                                            user().isLogged
                                                ? 'is-hidden'
                                                : ''
                                        }`}
                                        to="/Login"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        className={`button is-primary ${
                                            [user()].length !== 0 &&
                                            user().isLogged
                                                ? 'is-hidden'
                                                : ''
                                        }`}
                                        to="/Register"
                                    >
                                        <strong>Sign up</strong>
                                    </Link>
                                    <Link
                                        className={`button is-danger ${
                                            [user()].length !== 0 &&
                                            user().isLogged
                                                ? ''
                                                : 'is-hidden'
                                        }`}
                                        to="/Logout"
                                    >
                                        <strong>Logout</strong>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
        </>
    );
};
