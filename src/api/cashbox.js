import axios from './index'

const path = 'payment'

class Cashbox {
    get = (params) => axios.get(`${path}/grouped-index`, {params})
    getGroupedShow = (params) => axios.get(`${path}/grouped-show`, {params})
    payment = data => axios.post(`${path}/examination-multiple/store`, data)
}

export default new Cashbox()
