export const CHANGE_PAGE = 'CHANGE_PAGE';

export function changePage(currentPage) {
    return {
        type: CHANGE_PAGE,
        currentPage
    }
}