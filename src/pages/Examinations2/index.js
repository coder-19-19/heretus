import Breadcrumbs from "components/Common/Breadcrumb";
import {useEffect, useState} from "react";
import Api from 'api/examinations'

import {
    Badge,
    Button,
    Card,
    CardBody,
    Col,
    Label,
    Modal,
    ModalHeader,
    Row,
    Spinner,
    UncontrolledTooltip
} from "reactstrap";
import {Controller, useForm} from "react-hook-form";
import Form from "../../helpers/form";
import Patients from "../../api/patients";
import FlatPicker from "react-flatpickr";
import Select from "react-select";
import moment from "moment";
import CustomPagination from "../../components/CustomPagination";
import ViewModal from "./ViewModal";
import PDFTemplate from "./PDFTemplate";
import Customers from "../../api/customers";

const Examinations2 = () => {
    document.title = 'Xidmətlər və Məhsullar 2'
    const patientForm = useForm({
        defaultValues: {
            start_date: new Date(),
            end_date: new Date()
        }
    })
    const [data, setData] = useState([])
    const [isFetching, setIsFetching] = useState(true)
    const [patientFilterLoader, setPatientFilterLoader] = useState(false)
    const [patients, setPatients] = useState([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [modal, setModal] = useState({status: false})
    const [selectedExaminations, setSelectedExaminations] = useState([])

    const toggleAllData = () => {
        const newData = data?.grouped_examinations
        if (selectedExaminations?.length === newData?.length) {
            setSelectedExaminations([])
            return
        }
        setSelectedExaminations(newData?.map(item => item?.id))
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

    const fetchData = async (showLoader = true, query = null, p = null) => {
        setIsFetching(showLoader)
        const params = patientForm.getValues()
        const data = await Api.getStatistics(query ? {
            start_date: Form.convertFormDate(new Date()),
            end_date: Form.convertFormDate(new Date()),
            page: p || null
        } : {
            patient_id: params?.patientId?.value || null,
            start_date: Form.convertFormDate(params.start_date),
            end_date: Form.convertFormDate(params.end_date),
            page: p || null
        })
        setData(data?.data)
        setTotal(data?.meta?.total)
        setIsFetching(false)
    }

    const fetchPatients = async () => {
        const {data} = await Customers.getSelect()
        setPatients(data)
    }

    const fetchFilterData = async () => {
        await Promise.all([fetchPatients()])
    }

    const handlePatientFilter = async () => {
        setPatientFilterLoader(true)
        await fetchData(true)
        setPatientFilterLoader(false)
    }


    useEffect(() => {
        fetchData()
        fetchFilterData()
    }, [])


    return (
        <div className="page-content">
            <Modal size="xl" className="modal-dialog-centered" isOpen={modal?.status}
                   toggle={() => setModal({})}>
                <ModalHeader
                    toggle={() => setModal({})}>{modal?.data?.patientName}</ModalHeader>
                <ViewModal modal={modal} setModal={setModal}/>
            </Modal>
            <div className="container-fluid">
                <Breadcrumbs breadcrumbItem={`XİDMƏTLƏR VƏ MƏHSULLAR (${total})`}/>
                <Row>
                    <Col sm={12}>
                        <div className="d-flex flex-column gap-2">
                            <Card>
                                <CardBody>
                                    <form onSubmit={patientForm.handleSubmit(handlePatientFilter)}>
                                        <Row>
                                            <Col sm={4}>
                                                <div className="mb-3">
                                                    <Label for="patientId">Müştəri</Label>
                                                    <Controller defaultValue="" name="patientId"
                                                                control={patientForm.control}
                                                                render={({field: {value, onChange}}) => (
                                                                    <Select
                                                                        options={patients}
                                                                        placeholder=""
                                                                        className={`w-100`}
                                                                        onChange={onChange}
                                                                        value={value}
                                                                        name="patientId"
                                                                        id="patientId"/>
                                                                )}/>
                                                </div>
                                            </Col>
                                            <Col sm={4}>
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
                                            </Col>
                                            <Col sm={4}>
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
                                            </Col>
                                            <Col sm={12}>
                                                <div className="d-flex justify-content-end">
                                                    <div className="d-flex gap-2">
                                                        <Button id="reset-patient-btn" outline color="primary"
                                                                onClick={() => {
                                                                    patientForm.reset()
                                                                    setPage(1)
                                                                    fetchData(true, {}, 1)
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
                                <CardBody>
                                    {isFetching ? <div className="d-flex justify-content-center p-5">
                                        <Spinner color="primary" size="lg"/>
                                    </div> : (
                                        <>
                                            <div className="table-responsive">
                                                <table className="table table-bordered">
                                                    <thead>
                                                    <tr>
                                                        <th>
                                                            №
                                                            <Label className="d-flex gap-1">
                                                                <div className="form-check">
                                                                    <input type="checkbox"
                                                                           checked={selectedExaminations.length === data?.grouped_examinations?.length}
                                                                           onChange={toggleAllData}
                                                                           disabled={!data?.grouped_examinations?.length}
                                                                           className="form-check-input"/>
                                                                </div>
                                                            </Label>
                                                        </th>
                                                        <th>Müştəri</th>
                                                        <th>Qəbul tarixi</th>
                                                        <th>Ümumi ödəniş</th>
                                                        <th>Ümumi borc</th>
                                                        <th>
                                                            <PDFTemplate
                                                                totals={data}
                                                                examinations={data?.grouped_examinations}
                                                                selectedExaminations={selectedExaminations}/>
                                                        </th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {data?.grouped_examinations?.map((item, index) => (
                                                        <tr key={index}>
                                                            <td>
                                                                {index + 1}
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
                                                            <td>{item.patient}</td>
                                                            <td>{moment(item.admission_date).format('DD.MM.YYYY')}</td>
                                                            <td>
                                                                <Badge color="success">{item.totalPayment || 0}</Badge>
                                                            </td>
                                                            <td>
                                                                <Badge color="danger">{item.totalDebt || 0}</Badge>
                                                            </td>
                                                            <td>
                                                                <div className="d-flex align-items-center gap-1">
                                                                    <PDFTemplate item={item}/>
                                                                    <Button color="success"
                                                                            id={`view-${item.id}`}
                                                                            onClick={() => setModal({
                                                                                status: true,
                                                                                data: {
                                                                                    patientName: item?.patient,
                                                                                    patientId: item.patient_id,
                                                                                    date: item.admission_date
                                                                                }
                                                                            })}>
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
                                            </div>
                                            <div>
                                                <table className="table table-bordered">
                                                    <thead>
                                                    <tr>
                                                        <th>Ümumi məbləğ</th>
                                                        <th>Ümumi ödəniş</th>
                                                        <th>Ümumi borc</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    <tr>
                                                        <td>
                                                            <Badge color="warning">{data?.total_amount || 0}</Badge>
                                                        </td>
                                                        <td>
                                                            <Badge color="success">{data.total_payment || 0}</Badge>
                                                        </td>
                                                        <td>
                                                            <Badge color="danger">{data.total_debt || 0}</Badge>
                                                        </td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <CustomPagination total={total} setPage={setPage} page={page}/>
                                        </>
                                    )}
                                </CardBody>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default Examinations2
