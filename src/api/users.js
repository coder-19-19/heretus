import axios from './index'

const path = 'users'

class Users {
    get = () => axios.get(path)
    getById = id => axios.get(`${path}/${id}`)
    add = data => axios.post(path, data)
    update = (data) => axios.put(path, data)
    delete = id => axios.delete(`${path}/${id}`)
}

export default new Users()
