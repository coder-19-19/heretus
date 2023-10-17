import {
    Badge,
    Button,
    Card,
    CardBody,
    Col,
    Label,
    ModalBody,
    ModalFooter,
    Row,
    Spinner,
    UncontrolledTooltip
} from "reactstrap";
import {Controller, useForm} from "react-hook-form";
import Select from "react-select";
import moment from "moment";
import PDFTemplate from "../Cashbox/PDFTemplate";
import {useEffect, useState} from "react";
import Cashbox from "../../api/cashbox";
import Employees from "../../api/employees";
import Missions from "../../api/missions";

const ViewModal = ({modal, setModal}) => {
    const data = modal?.data
    const [isFetching, setIsFetching] = useState(true)
    const [examinations, setExaminations] = useState([])
    const [employees, setEmployees] = useState([])
    const [missions, setMissions] = useState([])
    const [doctors, setDoctors] = useState([])
    const [selectedExaminations, setSelectedExaminations] = useState([])

    const {control, setValue, reset, watch, formState: {errors}} = useForm()

    const getColor = item => item?.debt > 0 ? {background: '#f46a6a', color: '#fff'} : {
        background: '#34c38f',
        color: '#fff'
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

    const getData = async (id, date, query, p = null) => {
        setIsFetching(true)
        const {data} = await Cashbox.getGroupedShow({
            patient_id: id,
            date,
            ...query ? query : {
                doctor_id: doctorId?.value || null,
                worker_id: senderDoctorId?.value || null,
                service_id: missionId?.value || null,
                page: p || null
            }
        })
        setExaminations(data)
        setSelectedExaminations([])
        if (query) {
            setValue('doctor', null)
            setValue('senderDoctor', null)
            setValue('mission', null)
        }
        setIsFetching(false)
    }

    const doctorId = watch('doctor')
    const senderDoctorId = watch('senderDoctor')
    const missionId = watch('mission')

    const toggleAllData = () => {
        const data = examinations?.examinations
        if (selectedExaminations?.length === data?.length) {
            setSelectedExaminations([])
            return
        }
        setSelectedExaminations(data?.map(item => item?.id))
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

    const fetchAllData = async () => {
        await Promise.all([fetchEmployees(), fetchDoctors(), fetchMissions()])
    }
    useEffect(() => {
        if (data || doctorId || senderDoctorId || missionId) {
            getData(data?.patientId, data?.date)
        }
    }, [data, doctorId, senderDoctorId, missionId])

    useEffect(() => {
        if (data) {
            fetchAllData()
        }
    }, data)

    return (
        <>
            <ModalBody>
                <Col sm={12}>
                    <div className="d-flex flex-column gap-2">
                        <Card>
                            <CardBody>
                                <Row>
                                    <Col sm={12} md={4}>
                                        <div className="mb-3">
                                            <Label for="doctor">Həkim</Label>
                                            <Controller name="doctor"
                                                        control={control}
                                                        render={({field: {value, onChange}}) => (
                                                            <Select
                                                                options={doctors}
                                                                placeholder=""
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
                                            <Button id="reset-examination-btn" outline
                                                    color="primary"
                                                    onClick={() => {
                                                        reset({})
                                                        getData(data?.patientId, data?.date, {}, 1)
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
                            <CardBody>
                                {isFetching ? <div className="d-flex justify-content-center p-5">
                                    <Spinner color="primary" size="lg"/>
                                </div> : <div>
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
                                                           color="info">{examinations?.total_final_amount}</Badge>
                                                </td>
                                                <td>
                                                    <Badge className="p-2 font-size-12"
                                                           color="success">{examinations?.total_payment}</Badge>
                                                </td>
                                                <td>
                                                    <Badge className="p-2 font-size-12"
                                                           color="success">{examinations?.total_payment_cash}</Badge>
                                                </td>
                                                <td>
                                                    <Badge className="p-2 font-size-12"
                                                           color="success">{examinations?.total_payment_card}</Badge>
                                                </td>
                                                <td>
                                                    <Badge className="p-2 font-size-12"
                                                           color="danger">{examinations?.total_debt}</Badge>
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
                                                                   checked={selectedExaminations.length === examinations?.examinations?.length}
                                                                   onChange={toggleAllData}
                                                                   disabled={!examinations?.examinations?.length}
                                                                   className="form-check-input"/>
                                                        </div>
                                                    </Label>
                                                </th>
                                                <th>Həkim</th>
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
                                                    <PDFTemplate
                                                        examinations={examinations?.examinations}
                                                        selectedExaminations={selectedExaminations}/>
                                                </th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {examinations?.examinations?.map((item, index) => (
                                                <tr key={item.id}>
                                                    <td style={getColor(item)}>
                                                        <span>{index + 1}</span>
                                                        <Label className="d-flex gap-1">
                                                            <div className="form-check">
                                                                <input type="checkbox"
                                                                       value={1}
                                                                       checked={selectedExaminations.includes(item.id)}
                                                                       onChange={() => {
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
                                                           color="warning">{examinations?.total_amount}</Badge>
                                                </td>
                                                <td/>
                                                <td>
                                                    <Badge className="p-2 font-size-12"
                                                           color="info">{examinations?.total_final_amount}</Badge>
                                                </td>
                                                <td>
                                                    <Badge className="p-2 font-size-12"
                                                           color="success">{examinations?.total_payment}</Badge>
                                                </td>
                                                <td>
                                                    <Badge className="p-2 font-size-12"
                                                           color="success">{examinations?.total_payment_cash}</Badge>
                                                </td>
                                                <td>
                                                    <Badge className="p-2 font-size-12"
                                                           color="success">{examinations?.total_payment_card}</Badge>
                                                </td>
                                                <td>
                                                    <Badge className="p-2 font-size-12"
                                                           color="danger">{examinations?.total_debt}</Badge>
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

                                </div>}
                            </CardBody>
                        </Card>
                    </div>
                </Col>
            </ModalBody>
            <ModalFooter>
                <div className="d-flex justify-content-end gap-1">
                    <Button outline type="button" onClick={() => setModal({})} color="secondary">Bağla</Button>
                </div>
            </ModalFooter>
        </>
    )
}

export default ViewModal
