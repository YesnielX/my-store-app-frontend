/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { BaseSyntheticEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { getStores, register, user } from '../../services/api';

export default () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const setLogin = (e: BaseSyntheticEvent) => {
        console.log(username, email, password);

        const errorMessage = document.getElementById('error-message');

        if (username.length < 3 || email.length < 3 || password.length < 8) {
            errorMessage?.classList.remove('is-hidden');
            errorMessage?.classList.add('animate__flipInX');
            setTimeout(() => {
                errorMessage?.classList.add('is-hidden');
            }, 2000);
            return;
        } else {
            errorMessage?.classList.add('is-hidden');
            errorMessage?.classList.add('animate__flipOutX');
            void register(username, email, password).then(res => {
                console.log(res);
                if (res.status === 200) {
                    res.data.data.isLogged = true;
                    res.data.data.isLogged = true;
                    localStorage.setItem('user', JSON.stringify(res.data.data));
                    void getStores();
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 1200);
                } else {
                    console.log('Error: Log: ');
                    console.log(res.data.error);
                }
            });
        }
        e.preventDefault();
        e.stopPropagation();
    };

    useEffect(() => {
        if (user().isLogged) {
            window.location.href = '/';
        }
    }, []);

    return (
        <section className="container m-3 mgt-large mt-6">
            <div className="columns is-multiline">
                <div className="column is-8 is-offset-2 register">
                    <div className="columns">
                        <div className="column right has-text-centered">
                            <h1 className="title is-4">Sign up today</h1>
                            <p className="description">
                                Lorem ipsum dolor, sit amet consectetur
                                adipisicing elit
                            </p>
                            <article
                                className="message is-danger mt-5 animate__animated is-hidden"
                                id="error-message"
                            >
                                <div className="message-header">
                                    <p>Error</p>
                                    <button
                                        className="delete"
                                        aria-label="delete"
                                        onClick={() => {
                                            document
                                                .getElementById('error-message')
                                                ?.classList.add(
                                                    'animate__animated',
                                                    'animate__flipOutX'
                                                );
                                            setTimeout(() => {
                                                document
                                                    .getElementById(
                                                        'error-message'
                                                    )
                                                    ?.classList.add(
                                                        'is-hidden'
                                                    );
                                            }, 500);
                                        }}
                                    ></button>
                                </div>
                                <div
                                    className="message-body"
                                    id="error-message-content"
                                >
                                    Please fill in all fields with valid
                                </div>
                            </article>
                            <form className="mt-4">
                                <div className="field">
                                    <div className="control">
                                        <input
                                            className="input is-medium"
                                            type="text"
                                            placeholder="Name"
                                            required
                                            minLength={3}
                                            onChange={e =>
                                                setUsername(e.target.value)
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="field">
                                    <div className="control">
                                        <input
                                            className="input is-medium"
                                            type="email"
                                            placeholder="Email"
                                            required
                                            minLength={3}
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
                                            placeholder="Password"
                                            required
                                            minLength={8}
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
                                    Register
                                </button>
                                <br />
                                <Link to="/Login">Sign In</Link> &nbsp;·&nbsp;
                                <Link to="/Contact">Need Help?</Link>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
