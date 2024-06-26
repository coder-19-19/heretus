import axios from './index'

const path = 'company'

class Company {
    get = (params) => axios.get(`${path}/index`, {params})
    getSelect = () => axios.get(`${path}/selectList`)
    selectListDetail = () => axios.get(`${path}/selectListDetail`)
    getById = id => axios.get(`${path}/show/${id}`)
    add = data => axios.post(`${path}/store`, data)
    update = (data) => axios.post(`${path}/update/${data.id}`, data)
    delete = id => axios.delete(`${path}/delete/${id}`)
}

export default new Company()
