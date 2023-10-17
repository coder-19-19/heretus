class User {
    getFirstChars = (user) => {
        return `${user?.name?.[0]?.toUpperCase()}${user?.surname?.[0]?.toUpperCase() || ''}`
    }
}

export default new User()
