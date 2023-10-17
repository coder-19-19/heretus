import axios from './index'

const path = 'auth'

class Auth {
    get = () => axios.get(path)
    auth = () => axios.get('/authUser')
    getById = id => axios.get(`${path}/${id}`)
    login = data => axios.post(`login`, data)
    update = (id, data) => axios.put(`${path}/${id}`, data)
    delete = id => axios.delete(`${path}/${id}`)
}

export default new Auth()
