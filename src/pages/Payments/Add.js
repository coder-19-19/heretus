import {Controller, useForm} from "react-hook-form";
import {Button, Input, Label, ModalBody, ModalFooter, Spinner} from "reactstrap";
import FormHelper from "../../helpers/form";
import {useEffect, useState} from "react";
import Api from 'api/payments'
import Employees from "../../api/employees";
import Patients from "../../api/patients";
import Missions from "../../api/missions";
import Examinations from "../../api/examinations";
import Text from "../../helpers/text";

const Add = ({fetchData, form, setForm}) => {
    const {control, handleSubmit, setValue, setError, formState: {errors}} = useForm()
    const [loader, setLoader] = useState(false)
    const data = form?.data
    const [patients, setPatients] = useState([])
    const [employees, setEmployees] = useState([])
    const [missions, setMissions] = useState([])
    const [examinations, setExaminations] = useState([])
    const submit = async values => {
        setLoader(true)
        try {
            await Api[values?.id ? 'update' : 'add'](values)
            fetchData()
            setForm({})
        } catch (e) {
            FormHelper.setApiErrors(e.response.data, setError)
        } finally {
            setLoader(false)
        }
    }

    const fetchEmployees = async () => {
        const {data} = await Employees.get()
        setEmployees(data)
    }

    const fetchExaminations = async () => {
        const {data} = await Examinations.get()
        setExaminations(data)
    }

    const fetchPatients = async () => {
        const {data} = await Patients.get()
        setPatients(data)
    }

    const fetchMissions = async () => {
        const {data} = await Missions.get()
        setMissions(data)
    }

    const fetchModalData = async () => {
        await Promise.all([fetchEmployees(), fetchPatients(), fetchMissions(),fetchExaminations()])
    }

    useEffect(() => {
        fetchModalData()
    }, [])

    useEffect(() => {
        if (data) {
            setValue('id', data.id)
            setValue('value', data.value)
            setValue('examination', data.examination)
        }
    }, [form])

    return (
        <form onSubmit={handleSubmit(submit)}>
            <ModalBody>
                <div className="mb-3">
                    <Label for="value">Məbləğ</Label>
                    <Controller rules={{required: true}} name="value" control={control}
                                render={({field: {value, onChange}}) => (
                                    <Input
                                        name="value"
                                        type="number"
                                        id="value"
                                        value={value}
                                        onChange={onChange}
                                        className={errors?.value && 'is-invalid'}
                                    />
                                )}/>
                    {FormHelper.generateFormFeedback(errors, 'value')}
                </div>
                <div className="mb-3">
                    <Label for="examination">Müayinə</Label>
                    <div className="d-flex align-items-center gap-2">
                        <Controller rules={{required: true}} defaultValue="" name="examination.id"
                                    control={control}
                                    render={({field: {value, onChange}}) => (
                                        <select
                                            className={`form-control ${errors?.mission && 'is-invalid'}`}
                                            onChange={onChange}
                                            value={value}
                                            name="examination"
                                            id="examination">
                                            <option value="" disabled>Seçim edin</option>
                                            {examinations.map(item => (
                                                <option value={item.id}
                                                        key={item.id}>{Text.concatNameAndSurname(item?.patient)} - {item?.mission?.title} - {item?.debt}</option>
                                            ))}
                                        </select>
                                    )}/>
                    </div>
                    {FormHelper.generateFormFeedback(errors, 'examination')}
                </div>
            </ModalBody>
            <ModalFooter>
                <div className="d-flex justify-content-end gap-1">
                    <Button outline type="button" onClick={() => setForm({})} color="secondary">Bağla</Button>
                    <Button disabled={loader} type="submit" color="primary">
                        {loader ? <Spinner color="light" size="sm"/> : 'Yadda saxla'}
                    </Button>
                </div>
            </ModalFooter>
        </form>
    )
}

export default Add
