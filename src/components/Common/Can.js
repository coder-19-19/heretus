import LocalStorageManager from "../../helpers/localStorageManager";

const Can = ({action, children}) => {
    const actions = LocalStorageManager.get('user')?.can

    if (actions?.[action]) {
        return children
    }
    return null
}

export default Can
