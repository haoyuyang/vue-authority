import fetch from '@/libs/fetch';
import Cookies from 'js-cookie';
/**
 * 用户列表
 * @export
 * @param {any} data
 * @returns
 */
export function userList(data) {
    return fetch({
        url: '/user/page',
        headers:{token:Cookies.get('token')},
        method: 'POST',
        data: data
    });
}

/**
 * 新增用户
 * @export
 * @param {any} data
 * @returns
 */
export function userAdd(data) {
    return fetch({
        url: '/user/add',
        headers:{token:Cookies.get('token')},
        method: 'POST',
        data: data
    });
}
/**
 * 编辑用户
 * @export
 * @param {any} data
 * @returns
 */
export function userEdit(data) {
    return fetch({
        url: 'user/edit',
        headers:{token:Cookies.get('token')},
        method: 'POST',
        data: data
    });
}
/**
 * 删除用户
 * @export
 * @param {any} data
 * @returns
 */
export function userDel(data) {
    return fetch({
        url: '/user/delete',
        headers:{token:Cookies.get('token')},
        method: 'POST',
        data: data
    });
}
/**
 * 用户详情
 * @export
 * @param {any} data
 * @returns
 */
export function userDetail(data) {
    return fetch({
        url: '/user/detail',
        headers:{token:Cookies.get('token')},
        method: 'POST',
        data: data
    });
}

/**
 * 用户状态
 * @export
 * @param {any} data
 * @returns
 */
export function manageUser(data) {
    return fetch({
        url: '/user/updateStatus',
        headers:{token:Cookies.get('token')},
        method: 'POST',
        data: data
    });
}

/**
 * 角色列表
 * @export
 * @param {any} data
 * @returns
 */
export function roleList(data) {
    return fetch({
        url: '/role/page',
        headers:{token:Cookies.get('token')},
        method: 'POST',
        data: data
    });
}
/**
 * 角色列表(不分页)
 * @export
 * @param {any} data
 * @returns
 */
export function roleListAll(data) {
    return fetch({
        url: '/role/list',
        headers:{token:Cookies.get('token')},
        method: 'POST',
        data: data
    });
}
/**
 * 新增角色
 * @export
 * @param {any} data
 * @returns
 */
export function roleAdd(data) {
    return fetch({
        url: 'role/add',
        headers:{token:Cookies.get('token')},
        method: 'POST',
        data: data
    });
}
/**
 * 编辑角色
 * @export
 * @param {any} data
 * @returns
 */
export function roleEdit(data) {
    return fetch({
        url: 'role/update',
        headers:{token:Cookies.get('token')},
        method: 'POST',
        data: data
    });
}
/**
 * 删除角色
 * @export
 * @param {any} data
 * @returns
 */
export function roleDel(data) {
    return fetch({
        url: '/role/delete',
        headers:{token:Cookies.get('token')},
        method: 'POST',
        data: data
    });
}
/**
 * 角色详情
 * @export
 * @param {any} data
 * @returns
 */
export function roleDetail(data) {
    return fetch({
        url: '/role/detail',
        headers:{token:Cookies.get('token')},
        method: 'POST',
        data: data
    });
}
/**
 * 权限列表
 * @export
 * @param {any} data
 * @returns
 */
export function authorityList(data) {
    return fetch({
        url: '/authority/list',
        headers:{token:Cookies.get('token')},
        method: 'POST',
        data: data
    });
}
/**
 * 用户状态
 * @export
 * @param {any} data
 * @returns
 */
export function manageRole(data) {
    return fetch({
        url: '/role/updateStatus',
        headers:{token:Cookies.get('token')},
        method: 'POST',
        data: data
    });
}
