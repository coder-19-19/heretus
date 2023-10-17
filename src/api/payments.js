import axios from './index'

const path = 'payments'

class Payments {
    get = () => axios.get(path)
    getById = id => axios.get(`${path}/${id}`)
    add = data => axios.post(path, data)
    payMany = data => axios.post(`${path}/many`, data)
    update = (data) => axios.put(path, data)
    delete = id => axios.delete(`${path}/${id}`)
}

export default new Payments()
