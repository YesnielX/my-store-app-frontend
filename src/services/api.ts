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

type IUser = {
    _id: string;
    username: string;
    email: string;
    isAdmin: boolean;
    isPrincipalAdmin: boolean;
    isLogged: boolean;
    token: string;
};

export const user = (): IUser => {
    const user: IUser = JSON.parse(
        localStorage.getItem('user') || '{}'
    ) as IUser;
    return user;
};

export type IStore = {
    _id: string;
    name: string;
    imagePath: string;
    products: string[];
    managers: string[];
    employees: string[];
    author: IUser;
};

export const getStores = async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data = await axios.get(`${SERVER_HOST}/stores`, {
        headers: {
            token: user().token,
        },
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    localStorage.setItem('myStores', JSON.stringify(data.data.data));
};
