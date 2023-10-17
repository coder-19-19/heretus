import axios from './index'

const path = 'workers'

class Employees {
    get = (params) => axios.get(`${path}/index`, {params})
    getSelect = (params) => axios.get(`${path}/selectList`, {params})
    getDoctors = () => axios.get(`${path}/doctors`)
    getById = id => axios.get(`${path}/show/${id}`)
    add = data => axios.post(`${path}/store`, data)
    update = (data) => axios.post(`${path}/update/${data.id}`, data)
    delete = id => axios.delete(`${path}/delete/${id}`)
}

export default new Employees()
