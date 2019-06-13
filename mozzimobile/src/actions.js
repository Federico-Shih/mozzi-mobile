export const CHANGE_PAGE = 'CHANGE_PAGE';
export const ADD_PERMISSIONS = 'ADD_PERMISSIONS';

export function changePage(currentPage) {
    return {
        type: CHANGE_PAGE,
        currentPage
    }
}