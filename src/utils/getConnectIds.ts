export const getConnectIds = (ids: number[]) => {
    return ids.map(id => ({ id }))
}

// [1, 2, 3] => [{id: 1}, {id: 2}, {id: 3}]