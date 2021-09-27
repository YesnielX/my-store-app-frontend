import axios from 'axios';

const SERVER_HOST = import.meta.env.VITE_SERVER_HOST;

export const login = async (email: string, password: string) => {
    return await axios.get(`${SERVER_HOST}/user`, {
        params: {
            userOrEmail: email,
            password,
        },
    });
};

export const register = async (
    username: string,
    email: string,
    password: string
) => {
    return await axios.post(`${SERVER_HOST}/user`, {
        username,
        email,
        password,
    });
};

type Iuser = {
    _id: string;
    username: string;
    email: string;
    isAdmin: boolean;
    isPrincipalAdmin: boolean;
    isLogged: boolean;
    token: string;
};

export const user = (): Iuser => {
    const user: Iuser = JSON.parse(
        localStorage.getItem('user') || '{}'
    ) as Iuser;
    return user;
};
