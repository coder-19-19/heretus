class TextHelper {
    concatNameAndSurname = (data) => {
        return `${data?.firstName} ${data?.lastName}`
    }
}

export default new TextHelper()
