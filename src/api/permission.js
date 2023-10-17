import axios from "./index";

const path = 'permission'

class Permission {
    get = (params) => axios.get(`${path}/roles`, {params})
    selectList = () => axios.get(`${path}/roles/selectList`)
    getById = (id) => axios.get(`${path}/role/edit/${id}`,)
    getActions = (params) => axios.get(`${path}/actions`, {params})
    add = data => axios.post(`${path}/storeUpdate`, data)
    delete = id => axios.get(`${path}/role/delete/${id}`)
}

export default new Permission()
