import {Controller, useForm} from "react-hook-form";
import {Button, Col, Input, Label, Modal, ModalHeader, Row} from "reactstrap";
import FormHelper from "../../helpers/form";
import {useEffect, useState} from "react";
import Api from 'api/examinations'
import Employees from "../../api/employees";
import Missions from "../../api/missions";
import FlatPicker from "react-flatpickr";
import AddEmployee from '../Employees/Add'
import AddMission from '../Missions/Add'
import AddCustomer from '../Customers/Add'
import Select from "react-select";
import Customers from "../../api/customers";

const Add = ({fetchData, form, setData, data}) => {
    const {control, handleSubmit, setValue, getValues, watch, reset, setError, formState: {errors}} = useForm({
        defaultValues: {
            price: 0,
            note: '',
            doctor_id: null,
            patient_id: null,
            service_id: null,
            worker_id: null,
            discount: 0,
            quantity: 1,
            admission_date: new Date(),
            expiration_date: new Date(),
            payment_date: new Date(),
        }
    })
    const [patients, setPatients] = useState([])
    const [employees, setEmployees] = useState([])
    const [missions, setMissions] = useState([])
    const [doctors, setDoctors] = useState([])
    const [loader, setLoader] = useState(false)
    const [patientForm, setPatientForm] = useState({})
    const [employeeForm, setEmployeeForm] = useState({})
    const [missionForm, setMissionForm] = useState({})

    const submit = async values => {
        setLoader(true)
        try {
            await Api[values?.id ? 'update' : 'add']({
                ...FormHelper.validateBody(values),
                admission_date: FormHelper.convertForBackend(values?.admission_date),
                expiration_date: FormHelper.convertForBackend(values?.expiration_date),
                payment_date: FormHelper.convertForBackend(values?.payment_date),
            })
            fetchData(true, values?.patient_id?.value)
            reset()
            setValue('patient_id', values?.patient_id)
        } catch (e) {
            FormHelper.setApiErrors(e.response.data, setError)
        } finally {
            setLoader(false)
        }
    }

    const fetchEmployees = async () => {
        const {data} = await Employees.getSelect()
        setEmployees(data)
    }

    const fetchDoctors = async () => {
        const {data} = await Employees.getDoctors()
        setDoctors(data)
    }

    const fetchPatients = async () => {
        const {data} = await Customers.getSelect()
        setPatients(data)
    }

    const fetchMissions = async () => {
        const {data} = await Missions.getSelect()
        setMissions(data)
    }

    const fetchModalData = async () => {
        await Promise.all([fetchEmployees(), fetchPatients(), fetchMissions(), fetchDoctors()])
    }

    const saveAsDraft = (e) => {
        e.preventDefault()
        const values = getValues()
        const newData = {...data}
        newData.examinations = [
            ...newData.examinations || [],
            {
                patient: values?.patient_id?.label,
                doctor: values?.doctor_id?.label,
                worker: values?.worker_id?.label,
                is_product: values?.service_id?.is_product,
                service: values?.service_id?.label,
                ...FormHelper.validateBody(values),
                service_id: values?.service_id?.value2,
                patient_id: values?.patient_id?.value || values?.patient_id?.value,
                admission_date: FormHelper.convertForBackend(values?.admission_date),
                expiration_date: FormHelper.convertForBackend(values?.expiration_date),
                payment_date: FormHelper.convertForBackend(values?.payment_date),
                price: values?.price * values?.quantity,
                final_price: ((values?.price * values?.quantity) - (((values?.price * values?.quantity) * Number((values?.discount || 0)) / 100))).toFixed(2)
            }
        ]
        setData(newData)
    }

    useEffect(() => {
        if (form?.data) {
            reset(form?.data)
        }
    }, [form])

    useEffect(() => {
        fetchModalData()
    }, [])

    return (
        <>
            <Modal className="modal-dialog-centered" isOpen={patientForm?.status}
                   toggle={() => setPatientForm({})}>
                <ModalHeader
                    toggle={() => setPatientForm({})}>{patientForm?.data ? 'Düzəliş et' : 'Əlavə et'}</ModalHeader>
                <AddCustomer fetchData={fetchPatients} form={patientForm} setForm={setPatientForm}/>
            </Modal>
            <Modal size="xl" className="modal-dialog-centered" isOpen={employeeForm?.status}
                   toggle={() => setEmployeeForm({})}>
                <ModalHeader
                    toggle={() => setEmployeeForm({})}>{employeeForm?.data ? 'Düzəliş et' : 'Əlavə et'}</ModalHeader>
                <AddEmployee fetchData={fetchEmployees} form={employeeForm} setForm={setEmployeeForm}/>
            </Modal>
            <Modal className="modal-dialog-centered" isOpen={missionForm?.status}
                   toggle={() => setMissionForm({})}>
                <ModalHeader
                    toggle={() => setMissionForm({})}>{missionForm?.data ? 'Düzəliş et' : 'Əlavə et'}</ModalHeader>
                <AddMission fetchData={fetchMissions} form={missionForm} setForm={setMissionForm}/>
            </Modal>
            <form onSubmit={handleSubmit(submit)}>
                <Row>
                    <Col sm={12} md={4}>
                        <div className="mb-3">
                            <Label for="patient_id">Müştəri</Label>
                            <div className="d-flex align-items-center gap-2">
                                <Controller rules={{required: true}} name="patient_id"
                                            control={control}
                                            render={({field: {value, onChange}}) => (
                                                <div className="w-100">
                                                    <Select
                                                        options={patients}
                                                        placeholder=""
                                                        className={`w-100 ${errors?.patient_id && 'is-invalid'}`}
                                                        onChange={onChange}
                                                        value={value}
                                                        name="patient_id"
                                                        id="patient_id"/>
                                                    {FormHelper.generateFormFeedback(errors, 'patient_id')}
                                                </div>
                                            )}/>
                                <Button type="button" onClick={() => setPatientForm({status: true})}
                                        color="primary">
                                    <i className="bx bx-plus"/>
                                </Button>
                            </div>
                        </div>
                        <div className="mb-3">
                            <Label for="doctor_id">Nümayəndə</Label>
                            <div className="d-flex align-items-center gap-2">
                                <Controller rules={{required: true}} name="doctor_id"
                                            control={control}
                                            render={({field: {value, onChange}}) => (
                                                <Select
                                                    options={doctors}
                                                    placeholder=""
                                                    className={`w-100 ${errors?.doctor_id && 'is-invalid'}`}
                                                    onChange={onChange}
                                                    value={value}
                                                    name="doctor_id"
                                                    id="doctor_id"/>
                                            )}/>
                                <Button type="button" onClick={() => setEmployeeForm({status: true})}
                                        color="primary">
                                    <i className="bx bx-plus"/>
                                </Button>
                            </div>
                            {FormHelper.generateFormFeedback(errors, 'doctor_id')}
                        </div>
                        <div className="mb-3">
                            <Label for="worker_id">Göndərən şəxs</Label>
                            <div className="d-flex align-items-center gap-2">
                                <Controller name="worker_id"
                                            control={control}
                                            render={({field: {value, onChange}}) => (
                                                <Select
                                                    options={employees}
                                                    placeholder=""
                                                    className={`w-100 ${errors?.worker_id && 'is-invalid'}`}
                                                    onChange={onChange}
                                                    value={value}
                                                    name="worker_id"
                                                    id="worker_id"/>
                                            )}/>
                                <Button type="button" onClick={() => setEmployeeForm({status: true})}
                                        color="primary">
                                    <i className="bx bx-plus"/>
                                </Button>
                            </div>
                            {FormHelper.generateFormFeedback(errors, 'worker_id')}
                        </div>
                        <div className="mb-3">
                            <Label for="service_id">Xidmət</Label>
                            <div className="d-flex align-items-center gap-2">
                                <Controller rules={{required: true}} name="service_id"
                                            control={control}
                                            render={({field: {value, onChange}}) => (
                                                <Select
                                                    options={missions}
                                                    placeholder=""
                                                    className={`w-100 ${errors?.service_id && 'is-invalid'}`}
                                                    onChange={e => {
                                                        onChange(e)
                                                        setValue('price', missions?.find(item => item?.value == e?.value)?.price)
                                                        if (e?.is_product != 1) {
                                                            setValue('quantity', 1)
                                                        }
                                                    }}
                                                    value={value}
                                                    name="service_id"
                                                    id="service_id"/>
                                            )}/>
                                <Button type="button" onClick={() => setMissionForm({status: true})}
                                        color="primary">
                                    <i className="bx bx-plus"/>
                                </Button>
                            </div>
                            {FormHelper.generateFormFeedback(errors, 'service_id')}
                        </div>
                        <div className="mb-3">
                            <Label for="quantity">Say</Label>
                            <Controller rules={{required: true}} name="quantity" control={control}
                                        render={({field: {value, onChange}}) => (
                                            <Input
                                                type="number"
                                                name="quantity"
                                                disabled={watch('service_id')?.is_product != 1}
                                                id="quantity"
                                                value={value}
                                                onChange={onChange}
                                                className={errors?.quantity && 'is-invalid'}
                                            />
                                        )}/>
                            {FormHelper.generateFormFeedback(errors, 'quantity')}
                        </div>

                    </Col>
                    <Col sm={12} md={4}>
                        <div className="mb-3">
                            <Label for="price">Qiymət</Label>
                            <Controller rules={{required: true}} name="price" control={control}
                                        render={({field: {value, onChange}}) => (
                                            <Input
                                                type="number"
                                                name="price"
                                                id="price"
                                                disabled
                                                value={(value - (value * watch('discount') / 100)) * watch('quantity')}
                                                onChange={onChange}
                                                className={errors?.price && 'is-invalid'}
                                            />
                                        )}/>
                            {FormHelper.generateFormFeedback(errors, 'price')}
                        </div>
                        <div className="mb-3">
                            <Label for="discount">Endirim faizi</Label>
                            <Controller rules={{
                                min: {
                                    value: 0,
                                    message: 'Minimum 0 olmalıdır'
                                },
                                max: {
                                    value: 100,
                                    message: 'Maksimum 100 olmalıdır'
                                }
                            }} name="discount" control={control}
                                        render={({field: {value, onChange}}) => (
                                            <Input
                                                type="number"
                                                name="discount"
                                                id="discount"
                                                value={value}
                                                onChange={onChange}
                                                className={errors?.discount
                                                    && 'is-invalid'}
                                            />
                                        )}/>
                            {FormHelper.generateFormFeedback(errors, 'discount')}
                        </div>
                        <div className="mb-3">
                            <Label for="admission_date">Qəbul tarixi</Label>
                            <Controller name="admission_date" control={control}
                                        render={({field: {value, onChange}}) => (
                                            <FlatPicker
                                                className="form-control d-block"
                                                value={value}
                                                onChange={onChange}
                                                options={{
                                                    locale: 'az'
                                                }}
                                            />
                                        )}/>
                            {FormHelper.generateFormFeedback(errors, 'admission_date')}
                        </div>
                        <div className="mb-3">
                            <Label for="expiration_date">Bitmə tarixi</Label>
                            <Controller name="expiration_date" control={control}
                                        render={({field: {value, onChange}}) => (
                                            <FlatPicker
                                                className="form-control d-block"
                                                value={value}
                                                onChange={onChange}
                                                options={{
                                                    locale: 'az'
                                                }}
                                            />
                                        )}/>
                            {FormHelper.generateFormFeedback(errors, 'expiration_date')}
                        </div>
                    </Col>
                    <Col sm={12} md={4}>
                        <div className="mb-3">
                            <Label for="payment_date">Ödəniş tarixi</Label>
                            <Controller name="payment_date" control={control}
                                        render={({field: {value, onChange}}) => (
                                            <FlatPicker
                                                className="form-control d-block"
                                                value={value}
                                                onChange={onChange}
                                                options={{
                                                    locale: 'az'
                                                }}
                                            />
                                        )}/>
                            {FormHelper.generateFormFeedback(errors, 'payment_date')}
                        </div>
                        <div className="mb-3">
                            <Label for="note">Qeyd</Label>
                            <Controller name="note" control={control}
                                        render={({field: {value, onChange}}) => (
                                            <Input
                                                type="textarea"
                                                rows={5}
                                                name="note"
                                                id="note"
                                                value={value}
                                                onChange={onChange}
                                                className={errors?.note && 'is-invalid'}
                                            />
                                        )}/>
                            {FormHelper.generateFormFeedback(errors, 'note')}
                        </div>
                    </Col>
                </Row>
                <div className="d-flex justify-content-end gap-1">
                    <Button type="submit" onClick={saveAsDraft} color="success">
                        Əlavə et
                    </Button>
                </div>
            </form>
        </>
    )
}

export default Add
