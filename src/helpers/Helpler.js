const generateRandomNumber = (min, max) => {
    return Math.floor(Math.random() * max) + min;
}

const getOnlyWords = text => {
    const regex = /<[^>]+>/g
    const localText = text.replace(regex, '')
    return localText.split('\n').map(item => item && item.trim()?.replace(new RegExp('#', 'g'), ''))
}

export default {
    generateRandomNumber,
    getOnlyWords,
}
