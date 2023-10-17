import axios from './index'

const path = 'salary'

class Salary {
    get = (params) => axios.get(`${path}/index`, {params})
    pay = (data) => axios.post(`${path}/pay`, data)
}

export default new Salary()
