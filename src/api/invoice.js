import axios from './index'

const path = 'invoice'

class Invoice {
    get = (params) => axios.get(`${path}/index`, {params})
    getSelect = () => axios.get(`${path}/selectList`)
    getById = id => axios.get(`${path}/show/${id}`)
    add = data => axios.post(`${path}/store`, data)
    update = (data) => axios.post(`${path}/update/${data.id}`, data)
    savePDF = (data) => axios.post(`${path}/storePdf`, data)
    delete = id => axios.delete(`${path}/delete/${id}`)
}

export default new Invoice()
