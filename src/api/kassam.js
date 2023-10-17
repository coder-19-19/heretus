import axios from './index'

const path = 'kassam'

class Kassam {
    shiftStatus = () => axios.get(`${path}/shift/status`)
    toggle = type => axios.get(`${path}/shift/${type}`)
}

export default new Kassam()
