/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import axios from 'axios';
import cogoToast from 'cogo-toast';

const SERVER_HOST = import.meta.env.VITE_SERVER_HOST;

const axiosApiInstance = axios.create({
    baseURL: SERVER_HOST,
    timeout: 10000,
    headers: {
        token: JSON.parse(localStorage.getItem('user') || '[]').token || '',
    },
});

axiosApiInstance.interceptors.response.use(
    response => {
        if (
            (response.status === 200 &&
                !response.config.url?.endsWith('stores')) ||
            (response.status === 201 &&
                !response.config.url?.endsWith('stores'))
        ) {
            void cogoToast.success('Exito!');
        }
        return response;
    },
    error => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                case 403:
                case 404:
                case 500:
                    {
                        void cogoToast.error(
                            `Error: ${error.response.data.error as string}`,
                            {
                                hideAfter: 5,
                            }
                        );
                    }
                    break;
                default:
                    void cogoToast.error(
                        `Error: ${error.response.data.error as string}`,
                        {
                            hideAfter: 5,
                        }
                    );
                    break;
            }
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return error;
    }
);

export type IServerResponse = {
    message: string;
    error: string;
    data: any;
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

export type IProduct = {
    _id: string;
    name: string;
    description: string;
    price: number;
    purchasePrice: number;
    categories: string[];
    sizes: string[];
    stock: number;
    solds: number;
    imagePath: string;
    author: string;
    createdAt: Date;
    updatedAt: Date;
};

export type IStore = {
    _id: string;
    name: string;
    imagePath: string;
    products: IProduct[];
    managers: IUser[];
    employees: IUser[];
    author: IUser;
};

export const login = async (email: string, password: string) => {
    return await axiosApiInstance
        .get(`${SERVER_HOST}/user`, {
            params: {
                userOrEmail: email,
                password,
            },
        })
        .then(res => {
            res.data.data.isLogged = true;
            localStorage.setItem('user', JSON.stringify(res.data.data));
            return res;
        });
};

export const register = async (
    username: string,
    email: string,
    password: string
) => {
    return await axiosApiInstance.post(`${SERVER_HOST}/user`, {
        username,
        email,
        password,
    });
};

export const user = (): IUser => {
    const user: IUser = JSON.parse(
        localStorage.getItem('user') || '{}'
    ) as IUser;
    return user;
};

export const uploadImage = async (image: FormData) => {
    const request = await fetch(`${SERVER_HOST}/images`, {
        method: 'post',
        body: image,
    });

    return request;
};

export const getStores = async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return await axiosApiInstance.get(`${SERVER_HOST}/stores`).then(res => {
        localStorage.setItem('myStores', JSON.stringify(res.data.data || '[]'));
        return res;
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
};

export const createStore = async (name: string, imagePath: string) => {
    return await axiosApiInstance.post(`${SERVER_HOST}/stores`, {
        name,
        imagePath,
    });
};

export const updateStore = async (
    storeId: string,
    name: string,
    imagePath: string
) => {
    return await axiosApiInstance.put(`${SERVER_HOST}/stores`, {
        storeId,
        name,
        imagePath,
    });
};

export const createProduct = async (
    storeId: string,
    name: string,
    description: string,
    price: number,
    purchasePrice: number,
    stock: number,
    categories: string[],
    sizes: string[],
    imagePath: string
) => {
    return await axiosApiInstance.post(`${SERVER_HOST}/stores/products`, {
        storeId,
        name,
        description,
        price,
        purchasePrice,
        stock,
        categories,
        sizes,
        imagePath,
    });
};

export const deleteProduct = async (productId: string) => {
    return await axiosApiInstance.delete(`${SERVER_HOST}/stores/products/`, {
        data: {
            productId,
        },
    });
};

export const addManager = async (storeId: string, userEmail: string) => {
    return await axiosApiInstance.put(`${SERVER_HOST}/store/managers`, {
        storeId,
        userEmail,
    });
};

export const deleteManager = async (storeId: string, userId: string) => {
    return await axiosApiInstance.delete(`${SERVER_HOST}/store/managers`, {
        data: {
            storeId,
            userId,
        },
    });
};

export const addEmployee = async (storeId: string, userEmail: string) => {
    return await axiosApiInstance.put(`${SERVER_HOST}/store/employees`, {
        storeId,
        userEmail,
    });
};

export const deleteEmployee = async (storeId: string, userId: string) => {
    return await axiosApiInstance.delete(`${SERVER_HOST}/store/employees`, {
        data: {
            storeId,
            userId,
        },
    });
};
