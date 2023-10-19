import ConfirmModal from "components/Common/ConfirmModal";
import Breadcrumbs from "components/Common/Breadcrumb";
import {useEffect, useState} from "react";
import Api from 'api/cashbox'

import {
    Badge,
    Button,
    Card,
    CardBody,
    Col,
    Input,
    Label,
    Modal,
    ModalHeader,
    Row,
    Spinner,
    UncontrolledTooltip
} from "reactstrap";
import moment from "moment/moment";
import Add from "./Add";
import {toast} from "react-toastify";
import Missions from "../../api/missions";
import Employees from "../../api/employees";
import {Controller, useForm} from "react-hook-form";
import Form from "../../helpers/form";
import Patients from "../../api/patients";
import FlatPicker from "react-flatpickr";
import Select from "react-select";
import PDFTemplate from "./PDFTemplate";
import Kassam from "../../api/kassam";
import Can from "../../components/Common/Can";
import Customers from "../../api/customers";

const Branches = () => {
    document.title = 'Kassa'
    const {control, setValue, reset, watch, formState: {errors}} = useForm()
    const patientForm = useForm({
        defaultValues: {
            start_date: new Date(),
            end_date: new Date()
        }
    })
    const [confirmModal, setConfirmModal] = useState(false)
    const [form, setForm] = useState({})
    const [data, setData] = useState([])
    const [isFetching, setIsFetching] = useState(true)
    const [patientFilterLoader, setPatientFilterLoader] = useState(false)
    const [payManyLoader, setPayManyLoader] = useState(false)
    const [examinationsIsFetching, setExaminationsIsFetching] = useState(false)
    const [examinationsDetail, setExaminationsDetail] = useState([])
    const [selectedExaminations, setSelectedExaminations] = useState([])
    const [selectedPatientId, setSelectedPatientId] = useState(null)
    const [employees, setEmployees] = useState([])
    const [missions, setMissions] = useState([])
    const [doctors, setDoctors] = useState([])
    const [inputValues, setInputValues] = useState({})
    const [patients, setPatients] = useState([])
    const [shift, setShift] = useState({})
    const [shiftLoader, setShiftLoader] = useState(true)
    const paymentTypes = [
        {
            value: 1,
            label: 'Nağd'
        },
        {
            value: 2,
            label: 'Kart'
        }
    ]
    const [paymentType, setPaymentType] = useState(paymentTypes[0])

    const deleteData = async () => {
        await Api.delete(confirmModal)
        fetchData()
    }

    const getColor = item => item?.debt > 0 ? {background: '#f46a6a', color: '#fff'} : {
        background: '#34c38f',
        color: '#fff'
    }

    const fetchData = async (showLoader = true, query = null) => {
        setIsFetching(showLoader)
        const params = patientForm.getValues()
        const {data} = await Api.get(query ? {
            start_date: Form.convertFormDate(new Date()),
            end_date: Form.convertFormDate(new Date())
        } : {
            patient_id: params?.patientId?.value || null,
            start_date: Form.convertFormDate(params.start_date),
            end_date: Form.convertFormDate(params.end_date)
        })
        setData(data)
        setIsFetching(false)
    }
    const fetchPatients = async () => {
        const {data} = await Customers.getSelect()
        setPatients(data)
    }

    const getExaminations = async (id, date, query) => {
        setSelectedPatientId({id, date})
        setExaminationsIsFetching(true)
        const {data} = await Api.getGroupedShow({
            patient_id: id,
            date,
            ...query ? query : {
                doctor_id: doctorId?.value || null,
                worker_id: senderDoctorId?.value || null,
                service_id: missionId?.value || null
            }
        })
        if (query) {
            setValue('doctor', null)
            setValue('senderDoctor', null)
            setValue('mission', null)
        }
        setExaminationsDetail(data)
        setExaminationsIsFetching(false)
        setSelectedExaminations([])
        setInputValues({})
    }

    const fetchEmployees = async () => {
        const {data} = await Employees.getSelect()
        setEmployees(data)
    }

    const fetchMissions = async () => {
        const {data} = await Missions.getSelect()
        setMissions(data)
    }

    const fetchDoctors = async () => {
        const {data} = await Employees.getDoctors()
        setDoctors(data)
    }

    const fetchFilterData = async () => {
        await Promise.all([fetchEmployees(), fetchMissions(), fetchPatients(), fetchDoctors()])
    }

    const toggleAllData = () => {
        const data = examinationsDetail?.examinations
        if (selectedExaminations?.length === data?.length) {
            setSelectedExaminations([])
            setInputValues({})
            return
        }
        setSelectedExaminations(data?.map(item => item?.id))
        let newValues = {}
        examinationsDetail?.examinations?.forEach(item => {
            newValues[item.id] = item?.debt
        })
        setInputValues(newValues)
    }

    const handleChangeCheckbox = id => {
        if (selectedExaminations.includes(id)) {
            setSelectedExaminations(prev => ([
                ...prev.filter(item => item !== id)
            ]))
            return
        }
        setSelectedExaminations(prev => ([
            ...prev,
            id
        ]))
    }

    const payMany = async () => {
        setPayManyLoader(true)
        const isCash = paymentType.value === 1
        try {
            await Api.payment(
                {
                    payments: selectedExaminations.map((id) => {
                        return {
                            amount: isCash ? inputValues?.[id] : 0,
                            amount_card: isCash ? 0 : inputValues?.[id],
                            examination_id: id,
                        }
                    })
                }
            )
            setSelectedExaminations([])
            setInputValues({})
            getExaminations(selectedPatientId?.id, selectedPatientId?.date)
        } catch (e) {
            toast.error('Xəta baş verdi')
        } finally {
            setPayManyLoader(false)
        }
    }

    const doctorId = watch('doctor')
    const senderDoctorId = watch('senderDoctor')
    const missionId = watch('mission')

    const handlePatientFilter = async () => {
        setPatientFilterLoader(true)
        await fetchData(true)
        setPatientFilterLoader(false)
    }

    const getShiftStatus = async () => {
        setShiftLoader(true)
        // const {data} = await Kassam.shiftStatus()
        // setShift(data)
        setShiftLoader(false)
    }

    const toggleShift = async type => {
        setShiftLoader(true)
        await Kassam.toggle(type)
        await getShiftStatus()
        setShiftLoader(false)
    }

    useEffect(() => {
        fetchData()
        fetchFilterData()
        getShiftStatus()
    }, [])

    useEffect(() => {
        if (doctorId || senderDoctorId || missionId) {
            getExaminations(selectedPatientId?.id, selectedPatientId?.date)
        }
    }, [doctorId, senderDoctorId, missionId])

    return (
        <div className="page-content">
            <Modal className="modal-dialog-centered" isOpen={form?.status}
                   toggle={() => setForm({})}>
                <ModalHeader
                    toggle={() => setForm({})}>Ödəniş et</ModalHeader>
                <Add fetchData={fetchData} form={form} setForm={setForm}/>
            </Modal>
            <ConfirmModal active={confirmModal} setActive={setConfirmModal} callback={deleteData}/>
            <div className="container-fluid">
                <Breadcrumbs breadcrumbItem={`KASSA`}/>
                <Row>
                    <Col sm={12} md={4}>
                        <div className="d-flex flex-column gap-2">
                            <Card>
                                <CardBody>
                                    <form onSubmit={patientForm.handleSubmit(handlePatientFilter)}>
                                        <Row>
                                            <Col sm={12}>
                                                <div className="mb-3">
                                                    <Label for="patientId">Müştəri</Label>
                                                    <Controller defaultValue="" name="patientId"
                                                                control={patientForm.control}
                                                                render={({field: {value, onChange}}) => (
                                                                    <Select
                                                                        options={patients}
                                                                        placeholder=""
                                                                        className={`w-100 ${errors?.patientId && 'is-invalid'}`}
                                                                        onChange={onChange}
                                                                        value={value}
                                                                        name="patientId"
                                                                        id="patientId"/>
                                                                )}/>
                                                </div>
                                            </Col>
                                            <Col sm={12}>
                                                <div className="d-flex gap-2 w-100">
                                                    <div className="mb-3 w-100">
                                                        <Label for="start_date">Başlama tarixi</Label>
                                                        <Controller name="start_date"
                                                                    control={patientForm.control}
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
                                                    </div>
                                                    <div className="mb-3 w-100">
                                                        <Label for="end_date">Bitmə tarixi</Label>
                                                        <Controller name="end_date"
                                                                    control={patientForm.control}
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
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col sm={12}>
                                                <div className="d-flex justify-content-end">
                                                    <div className="d-flex gap-2">
                                                        <Button id="reset-patient-btn" outline color="primary"
                                                                onClick={() => {
                                                                    patientForm.reset()
                                                                    fetchData(true, {})
                                                                }}>
                                                            <i className="bx bx-rotate-right"/>
                                                        </Button>
                                                        <UncontrolledTooltip placement="bottom"
                                                                             target="reset-patient-btn">
                                                            Sıfırla
                                                        </UncontrolledTooltip>
                                                        <Button color="primary" disabled={patientFilterLoader}>
                                                            {patientFilterLoader ?
                                                                <Spinner size="sm" color="light"/> : 'Axtar'}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </form>
                                </CardBody>
                            </Card>
                            <Card>
                                {isFetching ? (
                                    <div className="d-flex justify-content-center p-5">
                                        <Spinner color="primary" size="lg"/>
                                    </div>
                                ) : (
                                    <CardBody style={{maxHeight: '600px', overflow: 'auto'}}>
                                        <Breadcrumbs
                                            breadcrumbItem={`MüştəriLƏR (${data?.grouped_examinations?.length || 0})`}/>
                                        <div className="table-responsive">
                                            <table className="table table-bordered">
                                                <thead>
                                                <tr>
                                                    <th>№</th>
                                                    <th>Müştəri</th>
                                                    <th>Tarix</th>
                                                    <th/>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {data?.grouped_examinations?.map((item, index) => (
                                                    <tr key={item.patientId}>
                                                        <td>{index + 1}</td>
                                                        <td>{item?.patient}</td>
                                                        <td>{item?.admission_date && moment(item?.admission_date).format('DD.MM.YYYY')}</td>
                                                        <td>
                                                            <div className="d-flex align-items-center gap-1">
                                                                <Button color="success"
                                                                        id={`view-${item.id}`}
                                                                        onClick={() => getExaminations(item.patient_id, item.admission_date)}>
                                                                    <i className="bx bx-show"/>
                                                                </Button>
                                                                <UncontrolledTooltip target={`view-${item.id}`}
                                                                                     placement="bottom">
                                                                    Bax
                                                                </UncontrolledTooltip>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </table>
                                            <table className="table table-bordered">
                                                <thead>
                                                <tr>
                                                    <th>Ümumi məbləğ</th>
                                                    <th>Ümumi edilmiş ödəniş</th>
                                                    <th>Nağd ödəniş</th>
                                                    <th>Kart ödənişi</th>
                                                    <th>Ümumi qalıq borc</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                <tr>
                                                    <td>
                                                        <Badge className="p-2 font-size-12"
                                                               color="warning">{data?.total_amount}</Badge>
                                                    </td>
                                                    <td>
                                                        <Badge className="p-2 font-size-12"
                                                               color="success">{data?.total_payment}</Badge>
                                                    </td>
                                                    <td>
                                                        <Badge className="p-2 font-size-12"
                                                               color="success">{data?.total_payment_cash}</Badge>
                                                    </td>
                                                    <td>
                                                        <Badge className="p-2 font-size-12"
                                                               color="success">{data?.total_payment_card}</Badge>
                                                    </td>
                                                    <td>
                                                        <Badge className="p-2 font-size-12"
                                                               color="danger">{data?.total_debt}</Badge>
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </CardBody>
                                )}
                            </Card>
                        </div>
                    </Col>
                    <Col sm={12} md={8}>
                        <div className="d-flex flex-column gap-2">
                            <Card>
                                <CardBody>
                                    <Row>
                                        <Col sm={12} md={4}>
                                            <div className="mb-3">
                                                <Label for="doctor">Nümayəndə</Label>
                                                <Controller name="doctor"
                                                            control={control}
                                                            render={({field: {value, onChange}}) => (
                                                                <Select
                                                                    options={doctors}
                                                                    placeholder=""
                                                                    isDisabled={!selectedPatientId}
                                                                    className={`w-100 ${errors?.doctor && 'is-invalid'}`}
                                                                    onChange={onChange}
                                                                    value={value}
                                                                    name="doctor"
                                                                    id="doctor"/>
                                                            )}/>
                                            </div>
                                        </Col>
                                        <Col sm={12} md={4}>
                                            <div className="mb-3">
                                                <Label for="senderDoctor">Göndərən şəxs</Label>
                                                <Controller name="senderDoctor"
                                                            control={control}
                                                            render={({field: {value, onChange}}) => (
                                                                <Select
                                                                    options={employees}
                                                                    placeholder=""
                                                                    isDisabled={!selectedPatientId}
                                                                    className={`w-100 ${errors?.senderDoctor && 'is-invalid'}`}
                                                                    onChange={onChange}
                                                                    value={value}
                                                                    name="senderDoctor"
                                                                    id="senderDoctor"/>
                                                            )}/>
                                            </div>
                                        </Col>
                                        <Col sm={12} md={4}>
                                            <div className="mb-3">
                                                <Label for="mission">Xidmət</Label>
                                                <Controller name="mission"
                                                            control={control}
                                                            render={({field: {value, onChange}}) => (
                                                                <Select
                                                                    options={missions}
                                                                    placeholder=""
                                                                    isDisabled={!selectedPatientId}
                                                                    className={`w-100 ${errors?.mission && 'is-invalid'}`}
                                                                    onChange={onChange}
                                                                    value={value}
                                                                    name="mission"
                                                                    id="mission"/>
                                                            )}/>
                                            </div>
                                        </Col>
                                        <Col sm={12}>
                                            <div className="d-flex justify-content-end">
                                                <Button disabled={!selectedPatientId} id="reset-examination-btn" outline
                                                        color="primary"
                                                        onClick={() => {
                                                            reset({})
                                                            getExaminations(selectedPatientId?.id, selectedPatientId?.date, {})
                                                        }}>
                                                    <i className="bx bx-rotate-right"/>
                                                </Button>
                                                <UncontrolledTooltip placement="bottom"
                                                                     target="reset-examination-btn">
                                                    Sıfırla
                                                </UncontrolledTooltip>
                                            </div>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                            <Card>
                                {examinationsIsFetching ? (
                                    <div className="d-flex justify-content-center p-5">
                                        <Spinner color="primary" size="lg"/>
                                    </div>
                                ) : (
                                    <CardBody style={{maxHeight: '600px', overflow: 'auto'}}>
                                        <div className="d-flex justify-content-between align-items-center mb-0">
                                            <Breadcrumbs
                                                breadcrumbItem={`MÜAYİNƏLƏR (${examinationsDetail?.examinations?.length || 0})`}/>
                                            <div className="mb-3">
                                                <Select options={paymentTypes}
                                                        value={paymentType}
                                                        onChange={setPaymentType}/>
                                            </div>
                                            {/*<div>*/}
                                            {/*    {shift?.shift_open &&*/}
                                            {/*        <span>{moment(shift?.shift_open_time).format('DD.MM.YYYY')}</span>}*/}
                                            {/*    <Button*/}
                                            {/*        onClick={() => toggleShift(shift?.shift_open ? 'close' : 'open')}*/}
                                            {/*        color="success" disabled={shiftLoader}>*/}
                                            {/*        {shiftLoader ? <Spinner size="sm" color="light"/> : (*/}
                                            {/*            shift?.shift_open ? 'Kassanı bağla' : 'Kassanı aç'*/}
                                            {/*        )}*/}
                                            {/*    </Button>*/}
                                            {/*</div>*/}
                                        </div>
                                        {selectedExaminations.map((item, index) => (
                                            inputValues[item] >= 0 && (
                                                <div key={index} className="mb-3">
                                                    <div className="d-flex align-items-center gap-2 mb-2">
                                                        {paymentType.value === 1 ? (
                                                            <Input
                                                                disabled={paymentType.value === 2}
                                                                value={inputValues[item]}
                                                                placeholder={`Nağd ödəniş`}
                                                                onChange={e => setInputValues(prev => ({
                                                                    ...prev,
                                                                    [item]: e.target.value
                                                                }))}
                                                            />
                                                        ) : (
                                                            <Input
                                                                value={inputValues[item]}
                                                                disabled={paymentType.value === 1}
                                                                placeholder={`Kartla ödəniş`}
                                                                onChange={e => setInputValues(prev => ({
                                                                    ...prev,
                                                                    [item]: e.target.value
                                                                }))}
                                                            />
                                                        )}
                                                        {index === 0 && (
                                                            <Can action="examinationPayment_add">
                                                                <Button color="success"
                                                                        onClick={payMany}
                                                                        disabled={!selectedExaminations.length || payManyLoader}
                                                                    //!shift?.shift_open for disabled
                                                                        id="pay-btn">
                                                                    <i className="bx bx-save"/>
                                                                </Button>
                                                                <UncontrolledTooltip target="pay-btn"
                                                                                     placement="bottom">
                                                                    Ödəniş et
                                                                </UncontrolledTooltip>
                                                            </Can>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        ))}
                                        <div className="table-responsive">
                                            <table className="table table-bordered">
                                                <thead>
                                                <tr>
                                                    <th>Ümumi məbləğ</th>
                                                    <th>Ümumi edilmiş ödəniş</th>
                                                    <th>Nağd ödəniş</th>
                                                    <th>Kart ödənişi</th>
                                                    <th>Ümumi qalıq borc</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                <tr>
                                                    <td>
                                                        <Badge className="p-2 font-size-12"
                                                               color="info">{examinationsDetail?.total_final_amount}</Badge>
                                                    </td>
                                                    <td>
                                                        <Badge className="p-2 font-size-12"
                                                               color="success">{examinationsDetail?.total_payment}</Badge>
                                                    </td>
                                                    <td>
                                                        <Badge className="p-2 font-size-12"
                                                               color="success">{examinationsDetail?.total_payment_cash}</Badge>
                                                    </td>
                                                    <td>
                                                        <Badge className="p-2 font-size-12"
                                                               color="success">{examinationsDetail?.total_payment_card}</Badge>
                                                    </td>
                                                    <td>
                                                        <Badge className="p-2 font-size-12"
                                                               color="danger">{examinationsDetail?.total_debt}</Badge>
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="table-responsive">
                                            <table className="table table-bordered">
                                                <thead>
                                                <tr>
                                                    <th>
                                                        <span>№</span>
                                                        <Label className="d-flex gap-1">
                                                            <div className="form-check">
                                                                <input type="checkbox"
                                                                       checked={selectedExaminations.length === examinationsDetail?.examinations?.length}
                                                                       onChange={toggleAllData}
                                                                       disabled={!examinationsDetail?.examinations?.length}
                                                                       className="form-check-input"/>
                                                            </div>
                                                        </Label>
                                                    </th>
                                                    <th>Nümayəndə</th>
                                                    <th>Göndərən şəxs</th>
                                                    <th>Xidmət</th>
                                                    <th>Say</th>
                                                    <th>Qiymət</th>
                                                    <th>Endirim faizi</th>
                                                    <th>Yekun qiymət</th>
                                                    <th>Ödəniş</th>
                                                    <th>Nağd ödənilən</th>
                                                    <th>Kartla ödənilən</th>
                                                    <th>Borc</th>
                                                    <th>Qəbul tarixi</th>
                                                    <th>Bitmə tarixi</th>
                                                    <th>Ödəniş tarixi</th>
                                                    <th>Qeyd</th>
                                                    <th>
                                                        <PDFTemplate inputValues={inputValues}
                                                                     examinations={examinationsDetail?.examinations}
                                                                     selectedExaminations={selectedExaminations}/>
                                                    </th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {examinationsDetail?.examinations?.map((item, index) => (
                                                    <tr key={item.id}>
                                                        <td style={getColor(item)}>
                                                            <span>{index + 1}</span>
                                                            <Label className="d-flex gap-1">
                                                                <div className="form-check">
                                                                    <input type="checkbox"
                                                                           value={1}
                                                                           checked={selectedExaminations.includes(item.id)}
                                                                           onChange={() => {
                                                                               if (item?.debt != 0) {
                                                                                   setInputValues(prev => ({
                                                                                       ...prev,
                                                                                       [item.id]: item?.debt
                                                                                   }))
                                                                               }
                                                                               handleChangeCheckbox(item.id)
                                                                           }}
                                                                           name={`checkbox-${item.id}`}
                                                                           className="form-check-input"/>
                                                                </div>
                                                            </Label>
                                                        </td>
                                                        <td style={getColor(item)}>{item?.doctor}</td>
                                                        <td style={getColor(item)}>{item?.worker}</td>
                                                        <td style={getColor(item)}>{item?.service}</td>
                                                        <td style={getColor(item)}>{item?.quantity}</td>
                                                        <td style={getColor(item)}>{item?.price}</td>
                                                        <td style={getColor(item)}>{item?.discount}</td>
                                                        <td style={getColor(item)}>{item?.final_price}</td>
                                                        <td style={getColor(item)}>{item?.payment}</td>
                                                        <td style={getColor(item)}>{item?.payment_cash}</td>
                                                        <td style={getColor(item)}>{item?.payment_card}</td>
                                                        <td style={getColor(item)}>{item?.debt}</td>
                                                        <td style={getColor(item)}>{item?.admission_date && moment(item?.admission_date).format('DD.MM.YYYY')}</td>
                                                        <td style={getColor(item)}>{item?.expiration_date && moment(item?.expiration_date).format('DD.MM.YYYY')}</td>
                                                        <td style={getColor(item)}>{item?.payment_date && moment(item?.payment_date).format('DD.MM.YYYY')}</td>
                                                        <td style={getColor(item)}>{item?.note}</td>
                                                        <td style={getColor(item)}>
                                                            <PDFTemplate item={item}/>
                                                        </td>
                                                    </tr>
                                                ))}
                                                <tr>
                                                    <td/>
                                                    <td/>
                                                    <td/>
                                                    <td/>
                                                    <td/>
                                                    <td>
                                                        <Badge className="p-2 font-size-12"
                                                               color="warning">{examinationsDetail?.total_amount}</Badge>
                                                    </td>
                                                    <td/>
                                                    <td>
                                                        <Badge className="p-2 font-size-12"
                                                               color="info">{examinationsDetail?.total_final_amount}</Badge>
                                                    </td>
                                                    <td>
                                                        <Badge className="p-2 font-size-12"
                                                               color="success">{examinationsDetail?.total_payment}</Badge>
                                                    </td>
                                                    <td>
                                                        <Badge className="p-2 font-size-12"
                                                               color="success">{examinationsDetail?.total_payment_cash}</Badge>
                                                    </td>
                                                    <td>
                                                        <Badge className="p-2 font-size-12"
                                                               color="success">{examinationsDetail?.total_payment_card}</Badge>
                                                    </td>
                                                    <td>
                                                        <Badge className="p-2 font-size-12"
                                                               color="danger">{examinationsDetail?.total_debt}</Badge>
                                                    </td>
                                                    <td/>
                                                    <td/>
                                                    <td/>
                                                    <td/>
                                                    <td/>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </CardBody>
                                )}
                            </Card>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default Branches
