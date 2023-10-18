import ConfirmModal from "components/Common/ConfirmModal";
import Breadcrumbs from "components/Common/Breadcrumb";
import {useEffect, useState} from "react";

import {Badge, Button, Card, CardBody, Col, Label, Row, Spinner, UncontrolledTooltip} from "reactstrap";
import moment from "moment";
import {Controller, useForm} from "react-hook-form";
import Employees from "../../api/employees";
import Missions from "../../api/missions";
import Patients from "../../api/patients";
import ExaminationsApi from "../../api/examinations";
import CustomPagination from "../../components/CustomPagination";
import Select from "react-select";

const Examinations = () => {
    document.title = 'Xidmətlər və Məhsullar'
    const [confirmModal, setConfirmModal] = useState(false)
    const [examinationsIsFetching, setExaminationsIsFetching] = useState(false)
    const [examinations, setExaminations] = useState([])
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [employees, setEmployees] = useState([])
    const [doctors, setDoctors] = useState([])
    const [missions, setMissions] = useState([])
    const [patients, setPatients] = useState([])
    const {control, reset, watch, formState: {errors}} = useForm()

    const getColor = item => item?.debt > 0 ? {background: '#f46a6a', color: '#fff'} : {
        background: '#34c38f',
        color: '#fff'
    }

    const deleteData = async () => {
        await ExaminationsApi.delete(confirmModal)
        filterExaminations()
    }


    const fetchEmployees = async () => {
        const {data} = await Employees.getSelect()
        setEmployees(data)
    }

    const fetchMissions = async () => {
        const {data} = await Missions.getSelect()
        setMissions(data)
    }

    const fetchPatients = async () => {
        const {data} = await Patients.getSelect()
        setPatients(data)
    }

    const fetchDoctors = async () => {
        const {data} = await Employees.getDoctors()
        setDoctors(data)
    }

    const fetchFilterData = async () => {
        await Promise.all([fetchEmployees(), fetchMissions(), fetchPatients(), fetchDoctors()])
    }

    const doctorId = watch('doctorId')
    const senderDoctorId = watch('senderDoctorId')
    const missionId = watch('missionId')
    const patientId = watch('patientId')

    const filterExaminations = async (p = null) => {
        setExaminationsIsFetching(true)
        const data = await ExaminationsApi.get({
            patient_id: patientId?.value || null,
            doctor_id: doctorId?.value || null,
            worker_id: senderDoctorId?.value || null,
            service_id: missionId?.value || null,
            page: p || page
        })
        setExaminations(data?.data)
        setTotal(data?.meta?.total)
        setExaminationsIsFetching(false)
    }

    useEffect(() => {
        fetchFilterData()
    }, []);

    useEffect(() => {
        filterExaminations(1)
        setPage(1)
    }, [patientId, doctorId, senderDoctorId, missionId]);

    useEffect(() => {
        filterExaminations()
    }, [page])

    return (
        <div className="page-content">
            <ConfirmModal active={confirmModal} setActive={setConfirmModal} callback={deleteData}/>
            <div className="container-fluid">
                <Breadcrumbs breadcrumbItem={`XİDMƏTLƏR VƏ MƏHSULLAR (${total})`}/>
                <Row>
                    <Col sm={12}>
                        <div className="d-flex flex-column gap-2">
                            <Card>
                                <CardBody>
                                    <Row>
                                        <Col sm={12} md={3}>
                                            <div className="mb-3">
                                                <Label for="patientId">Müştəri</Label>
                                                <Controller name="patientId"
                                                            control={control}
                                                            render={({field: {value, onChange}}) => (
                                                                <Select
                                                                    isClearable
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
                                        <Col sm={12} md={3}>
                                            <div className="mb-3">
                                                <Label for="doctorId">Nümayəndə</Label>
                                                <Controller name="doctorId"
                                                            control={control}
                                                            render={({field: {value, onChange}}) => (
                                                                <Select
                                                                    isClearable
                                                                    options={doctors}
                                                                    placeholder=""
                                                                    className={`w-100 ${errors?.doctorId && 'is-invalid'}`}
                                                                    onChange={onChange}
                                                                    value={value}
                                                                    name="doctorId"
                                                                    id="doctorId"/>
                                                            )}/>
                                            </div>
                                        </Col>
                                        <Col sm={12} md={3}>
                                            <div className="mb-3">
                                                <Label for="senderDoctor">Göndərən şəxs</Label>
                                                <Controller name="senderDoctorId"
                                                            control={control}
                                                            render={({field: {value, onChange}}) => (
                                                                <Select
                                                                    isClearable
                                                                    options={employees}
                                                                    placeholder=""
                                                                    className={`w-100 ${errors?.senderDoctorId && 'is-invalid'}`}
                                                                    onChange={onChange}
                                                                    value={value}
                                                                    name="senderDoctorId"
                                                                    id="senderDoctorId"/>
                                                            )}/>
                                            </div>
                                        </Col>
                                        <Col sm={12} md={3}>
                                            <div className="mb-3">
                                                <Label for="missionId">Xidmət</Label>
                                                <Controller name="missionId"
                                                            control={control}
                                                            render={({field: {value, onChange}}) => (
                                                                <Select
                                                                    isClearable
                                                                    options={missions}
                                                                    placeholder=""
                                                                    className={`w-100 ${errors?.missionId && 'is-invalid'}`}
                                                                    onChange={onChange}
                                                                    value={value}
                                                                    name="missionId"
                                                                    id="missionId"/>
                                                            )}/>
                                            </div>
                                        </Col>
                                        <Col sm={12}>
                                            <div className="d-flex justify-content-end">
                                                <Button id="reset-btn" outline color="primary" onClick={() => {
                                                    reset({
                                                        doctorId: null,
                                                        patientId: null,
                                                        senderDoctorId: null,
                                                        missionId: null
                                                    })
                                                    setPage(1)
                                                    filterExaminations(1)
                                                }}>
                                                    <i className="bx bx-rotate-right"/>
                                                </Button>
                                                <UncontrolledTooltip placement="bottom" target="reset-btn">
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
                                    <CardBody>
                                        <div className="table-responsive">
                                            <table className="table table-bordered">
                                                <thead>
                                                <tr>
                                                    <th>№</th>
                                                    <th>Müştəri</th>
                                                    <th>Nümayəndə</th>
                                                    <th>Göndərən şəxs</th>
                                                    <th>Xidmət</th>
                                                    <th>Say</th>
                                                    <th>Qiymət</th>
                                                    <th>Endirim faizi</th>
                                                    <th>Yekun qiymət</th>
                                                    <th>Ödəniş</th>
                                                    <th>Borc</th>
                                                    <th>Qəbul tarixi</th>
                                                    <th>Bitmə tarixi</th>
                                                    <th>Ödəniş tarixi</th>
                                                    <th>Qeyd</th>
                                                    <th/>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {examinations?.examinations?.map((item, index) => (
                                                    <tr key={item.id}>
                                                        <td style={getColor(item)}>{index + 1}</td>
                                                        <td style={getColor(item)}>{item?.patient}</td>
                                                        <td style={getColor(item)}>{item?.doctor}</td>
                                                        <td style={getColor(item)}>{item?.worker}</td>
                                                        <td style={getColor(item)}>{item?.service}</td>
                                                        <td style={getColor(item)}>{item?.quantity}</td>
                                                        <td style={getColor(item)}>{item?.price}</td>
                                                        <td style={getColor(item)}>{item?.discount}</td>
                                                        <td style={getColor(item)}>{item?.final_price}</td>
                                                        <td style={getColor(item)}>{item?.payment}</td>
                                                        <td style={getColor(item)}>{item?.debt}</td>
                                                        <td style={getColor(item)}>{item?.admission_date && moment(item?.admission_date).format('DD.MM.YYYY')}</td>
                                                        <td style={getColor(item)}>{item?.expiration_date && moment(item?.expiration_date).format('DD.MM.YYYY')}</td>
                                                        <td style={getColor(item)}>{item?.payment_date && moment(item?.payment_date).format('DD.MM.YYYY')}</td>
                                                        <td style={getColor(item)}>{item?.note}</td>
                                                        {/*<td>*/}
                                                        {/*    <div className="d-flex align-items-center gap-1">*/}
                                                        {/*        <Button color="success"*/}
                                                        {/*                id={`edit-${item.id}`}*/}
                                                        {/*                onClick={() => setForm({*/}
                                                        {/*                    status: true,*/}
                                                        {/*                    data: item*/}
                                                        {/*                })}>*/}
                                                        {/*            <i className="bx bx-pencil"/>*/}
                                                        {/*        </Button>*/}
                                                        {/*        <UncontrolledTooltip target={`edit-${item.id}`}*/}
                                                        {/*                             placement="bottom">*/}
                                                        {/*            Düzəliş et*/}
                                                        {/*        </UncontrolledTooltip>*/}
                                                        <td>
                                                            <Button color="danger"
                                                                    id={`delete-${item.id}`}
                                                                    onClick={() => setConfirmModal(item.id)}>
                                                                <i className="bx bx-trash"/>
                                                            </Button>
                                                            <UncontrolledTooltip target={`delete-${item.id}`}
                                                                                 placement="bottom">
                                                                Sil
                                                            </UncontrolledTooltip>
                                                        </td>
                                                        {/*    </div>*/}
                                                        {/*</td>*/}
                                                    </tr>
                                                ))}
                                                <tr>
                                                    <td/>
                                                    <td/>
                                                    <td/>
                                                    <td/>
                                                    <td/>
                                                    <td/>
                                                    <td>
                                                        <Badge className="p-2 font-size-12"
                                                               color="warning">{examinations?.total_price}</Badge>
                                                    </td>
                                                    <td/>
                                                    <td>
                                                        <Badge className="p-2 font-size-12"
                                                               color="info">{examinations?.total_final_price}</Badge>
                                                    </td>
                                                    <td>
                                                        <Badge className="p-2 font-size-12"
                                                               color="success">{examinations?.total_payment}</Badge>
                                                    </td>
                                                    <td>
                                                        <Badge className="p-2 font-size-12"
                                                               color="danger">{examinations?.total_debt}</Badge>
                                                    </td>
                                                    <td/>
                                                    <td/>
                                                    <td/>
                                                    <td/>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <CustomPagination total={total} setPage={setPage} page={page}/>
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

export default Examinations
