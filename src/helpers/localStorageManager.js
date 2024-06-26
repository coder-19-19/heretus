class LocalStorageManager {
    set = (name, data) => {
        localStorage.setItem(name, JSON.stringify(data))
    }

    get = name => {
        return JSON.parse(localStorage.getItem(name))
    }
}

export default new LocalStorageManager()
