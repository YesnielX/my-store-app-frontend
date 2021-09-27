/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { BaseSyntheticEvent, useState } from 'react';
import { Link } from 'react-router-dom';

import { login } from '../../services/api';

export default () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const setLogin = (e: BaseSyntheticEvent) => {
        console.log(email, password);
        void login(email, password).then(res => {
            console.log(res);
            if (res.status === 200) {
                res.data.data.isLogged = true;
                localStorage.setItem('user', JSON.stringify(res.data.data));
                window.location.href = '/';
            }
        });
        e.preventDefault();
        e.stopPropagation();
    };

    return (
        <section className="container mt-6">
            <div className="columns is-multiline">
                <div className="column is-8 is-offset-2 register">
                    <div className="columns">
                        <div className="column right has-text-centered">
                            <h1 className="title is-4">Login</h1>
                            <p className="description">Welcome back!</p>
                            <br />
                            <form>
                                <div className="field">
                                    <div className="control">
                                        <input
                                            className="input is-medium"
                                            type="text"
                                            placeholder="Email"
                                            onChange={e =>
                                                setEmail(e.target.value)
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="field">
                                    <div className="control">
                                        <input
                                            className="input is-medium"
                                            type="password"
                                            placeholder="password"
                                            onChange={e =>
                                                setPassword(e.target.value)
                                            }
                                        />
                                    </div>
                                </div>
                                <button
                                    className="button is-block is-primary is-fullwidth is-medium"
                                    onClick={setLogin}
                                >
                                    Login
                                </button>
                                <br />
                                <small>
                                    <em>
                                        Lorem ipsum dolor sit amet consectetur.
                                    </em>
                                </small>
                                <br />
                                <Link to="/Register">Sign Up</Link>{' '}
                                &nbsp;·&nbsp;
                                <Link to="/forget-password">
                                    Forgot Password
                                </Link>{' '}
                                &nbsp;·&nbsp;
                                <Link to="/Contact">Need Help?</Link>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
