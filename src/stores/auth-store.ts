import {defineStore} from "pinia";

interface IStoreUser {
    id: number,
    email: string,
    username: string,
    roles: IStoreRole[],
    menus: IStoreMenu[]
}

interface IStoreRole {
    id: number,
    name: string,
    zhName: string,
}

export interface IStoreMenu {
    id: number,
    name: string,
    zhName: string,
    path: string,
    componentPath: string | null | undefined,
    parentId: number | null | undefined,
    level: number,
    remark: string | null | undefined,
    children: IStoreMenu[] | null | undefined
}

export const useAuthStore = defineStore('auth', {
    state: () => {
        return {
            user: null as IStoreUser | null | undefined
        }
    },
    persist: {
        storage: sessionStorage
    }
})