
import fetch from '@/libs/fetch';
import Cookies from 'js-cookie';
/**
 * 登录接口
 * @export
 * @param {any} data
 * @returns
 */
export function login (data) {
    return fetch({
        url: '/user/login',
        method: 'POST',
        data: data
    });
}
/**
 * 登出接口
 * @export
 * @param {any} data
 * @returns
 */
export function logout (token,ver=1) {
    return fetch({
        url: '/user/logout',
        method: 'POST',
        data: {
            token,
            ver
        }
    });
}
/**
 * 菜单权限
 * @export
 * @param {any} data
 * @returns
 */
export function menu (data) {
    return fetch({
        url: '/user/menu/list',
        headers:{token:Cookies.get('token')},
        method: 'POST',
        data: data
    });
}
