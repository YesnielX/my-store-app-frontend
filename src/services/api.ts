/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import axios, { AxiosError } from 'axios';
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
            // void cogoToast.success('Exito!');
        }
        return response;
    },
    (error: AxiosError) => {
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
        return error;
    }
);

export type IServerResponse = {
    message: string;
    error: string;
    data: {
        myStores: IStore[];
        managerStores: IStore[];
        employeesStores: IStore[];
    };
};

export type IRole = {
    _id: number;
    name: string;
    description: string;
    permissions: {
        maxStores: number;
        maxProducts: number;
        maxManagers: number;
        maxEmployees: number;
    };
};

export type IUser = {
    _id: string;
    username: string;
    email: string;
    roles: IRole[];
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
    createdAt: Date;
    updatedAt: Date;
};

export type IReport = {
    _id: string;
    store: string;
    product: string;
    title: string;
    description: string;
    imagePath: string;
    author: IUser;
    createdAt: Date;
    updatedAt: Date;
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

export const getMe = async () => {
    const { data } = await axiosApiInstance.get(`${SERVER_HOST}/me`);
    const user = data.data;
    user.isLogged = true;
    localStorage.setItem('user', JSON.stringify(user));
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

// stores and products.

export const getStores = async () => {
    return await axiosApiInstance.get(`${SERVER_HOST}/stores`);
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

export const editProduct = async (
    productId: string,
    name: string,
    description: string,
    price: number,
    purchasePrice: number,
    stock: number,
    categories: string[],
    sizes: string[],
    imagePath: string
) => {
    return await axiosApiInstance.put(`${SERVER_HOST}/stores/products`, {
        productId,
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

export const soldProduct = async (storeId: string, productId: string) => {
    return await axiosApiInstance.post(`${SERVER_HOST}/store/product`, {
        storeId,
        productId,
    });
};

export const createReport = async (
    storeId: string,
    productId: string,
    title: string,
    description: string,
    imagePath: string
) => {
    return await axiosApiInstance.post(`${SERVER_HOST}/store/reports`, {
        storeId,
        productId,
        title,
        description,
        imagePath,
    });
};

export const getReports = async (storeId: string) => {
    return await axiosApiInstance.get(`${SERVER_HOST}/store/reports`, {
        params: {
            storeId,
        },
    });
};

export const deleteReport = async (reportId: string) => {
    return await axiosApiInstance.delete(`${SERVER_HOST}/store/reports/`, {
        data: {
            reportId,
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

// admin panel

export const getUsers = async () => {
    return await axiosApiInstance.get(`${SERVER_HOST}/users`);
};

export const getRoles = async () => {
    return await axiosApiInstance.get(`${SERVER_HOST}/admin/roles`);
};

export const createRole = async (
    roleName: string,
    description: string,
    permissions: {
        maxStores: number;
        maxProducts: number;
        maxManagers: number;
        maxEmployees: number;
    }
) => {
    return await axiosApiInstance.post(`${SERVER_HOST}/admin/roles`, {
        roleName,
        description,
        permissions,
    });
};

export const updateRole = async (
    roleId: string,
    roleName: string,
    description: string,
    permissions: {
        maxStores: number;
        maxProducts: number;
        maxManagers: number;
        maxEmployees: number;
    }
) => {
    return await axiosApiInstance.put(`${SERVER_HOST}/admin/roles`, {
        roleId,
        roleName,
        description,
        permissions,
    });
};

export const deleteRole = async (roleId: string) => {
    return await axiosApiInstance.delete(`${SERVER_HOST}/admin/roles`, {
        data: {
            roleId,
        },
    });
};

// user roles

export const updateUserRoles = async (userId: string, roles: IRole[]) => {
    return await axiosApiInstance.put(`${SERVER_HOST}/user/roles`, {
        userId,
        roles,
    });
};
