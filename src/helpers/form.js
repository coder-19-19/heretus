import {FormFeedback} from "reactstrap";
import React from 'react'
import {toast} from "react-toastify";
import moment from "moment";

const setApiErrors = (data, setError) => {
    const errorData = data?.data
    if (!errorData) {
        toast.error(data?.message)
        return
    }
    Object.keys(errorData).map(item => {
        setError(item, {
            type: 'custom',
            message: Array.isArray(errorData?.[item]) ? errorData?.[item]?.[0] : errorData?.[item]
        })
    })
}

const generateFormFeedback = (errors, name) => {
    const error = errors?.[name]
    return error ? (
        <FormFeedback
            type="invalid">{error?.message || 'Xana məcburidir'}</FormFeedback>
    ) : null
}

const convertToSelectValue = data => {
    return data?.map(item => {
        return {
            label: item.name,
            value: item.id
        }
    })
}

const generateFileUrl = (url) => {
    return process.env.REACT_APP_FILE_URL + url
}


const convertFormDate = date => {
    if (!date) {
        return null
    }

    if (Array.isArray(date)) {
        return moment(date[0]).format('YYYY-MM-DD')
    }

    return moment(date).format('YYYY-MM-DD')
}

const convertForBackend = (date) => {
    const originalDate = new Date(date);

    const year = originalDate.getFullYear();
    const month = String(originalDate.getMonth() + 1).padStart(2, '0');
    const day = String(originalDate.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

const convertToReadableDate = (date) => {
    return moment(new Date(date)).format('DD.MM.YYYY')
}

const validateBody = data => {
    const body = {}
    Object.keys(data).forEach(item => {
        const param = data[item]
        if (param && param !== '' && param != null && param != undefined) {
            body[item] = param
        }

        if (param?.value && param?.label) {
            body[item] = param?.value
        }
    })
    return body
}

export default {
    generateFormFeedback,
    setApiErrors,
    convertToSelectValue,
    generateFileUrl,
    convertFormDate,
    convertToReadableDate,
    convertForBackend,
    validateBody
}
