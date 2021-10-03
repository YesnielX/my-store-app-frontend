import { user } from '../../services/api';

export default () => {
    return (
        <div>
            <section className="hero is-fullheight">
                <div className="hero-body">
                    <div className="container has-text-centered">
                        <div className="columns is-variable">
                            <div className="column is-two-thirds has-text-left">
                                <h1 className="title has-text-centered">
                                    Contactanos
                                </h1>
                                <p className="is-size-4">
                                    Lorem ipsum dolor sit amet consectetur
                                    adipisicing elit. Nulla eligendi soluta
                                    voluptate facere molestiae consequatur.
                                </p>
                                <div className="social-media">
                                    <a
                                        href="https://facebook.com"
                                        target="_blank"
                                        className="button is-light is-large"
                                        rel="noreferrer"
                                    >
                                        <i
                                            className="fab fa-facebook-f"
                                            aria-hidden="true"
                                        ></i>
                                    </a>
                                    <a
                                        href="https://instagram.com"
                                        target="_blank"
                                        className="button is-light is-large"
                                        rel="noreferrer"
                                    >
                                        <i
                                            className="fab fa-instagram"
                                            aria-hidden="true"
                                        ></i>
                                    </a>
                                    <a
                                        href="https://twitter.com"
                                        target="_blank"
                                        className="button is-light is-large"
                                        rel="noreferrer"
                                    >
                                        <i
                                            className="fab fa-twitter"
                                            aria-hidden="true"
                                        ></i>
                                    </a>
                                </div>
                            </div>
                            <div className="column is-one-third has-text-left">
                                <div className="field">
                                    <label className="label">Nombre</label>
                                    <div className="control">
                                        <input
                                            className="input is-medium"
                                            type="text"
                                            defaultValue={
                                                user().isLogged
                                                    ? user().username
                                                    : ''
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="field">
                                    <label className="label">Email</label>
                                    <div className="control">
                                        <input
                                            className="input is-medium"
                                            type="text"
                                            defaultValue={
                                                user().isLogged
                                                    ? user().email
                                                    : ''
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="field">
                                    <label className="label">Mensaje</label>
                                    <div className="control">
                                        <textarea className="textarea is-medium"></textarea>
                                    </div>
                                </div>
                                <div className="control">
                                    <button
                                        type="submit"
                                        className="button is-success is-fullwidth has-text-weight-medium is-medium"
                                    >
                                        Enviar Mensaje
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
