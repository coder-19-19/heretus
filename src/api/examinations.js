import axios from './index'

const path = 'examinations'

class Examinations {
    get = (params) => axios.get(`${path}/index`, {params})
    getById = id => axios.get(`${path}/show/${id}`)
    getByPatient = id => axios.get(`${path}/getAllByPatient/${id}`)
    getDistinct = (params) => axios.get(`${path}/distinct-by-patient`, {params})
    add = data => axios.post(`${path}/store`, data)
    addBulk = data => axios.post(`${path}/store/bulk`, data)
    update = (data) => axios.post(`${path}/update/${data.id}`, data)
    delete = id => axios.delete(`${path}/delete/${id}`)

    getStatistics = (params) => axios.get(`${path}/indexGrouped`, {params})
}

export default new Examinations()
