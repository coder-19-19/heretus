import axios from './index'

const path = 'patients'

class Patients {
    get = (params) => axios.get(`${path}/index`, {params})
    getSelect = () => axios.get(`${path}/selectList`)
    getById = id => axios.get(`${path}/show/${id}`)
    add = data => axios.post(`${path}/store`, data)
    update = (data) => axios.post(`${path}/update/${data.id}`, data)
    delete = id => axios.delete(`${path}/delete/${id}`)
}

export default new Patients()
