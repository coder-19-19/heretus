import ConfirmModal from "components/Common/ConfirmModal";
import Breadcrumbs from "components/Common/Breadcrumb";
import {useEffect, useState} from "react";
import Api from 'api/missions'

import {
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
import Add from "./Add";
import CustomPagination from "../../components/CustomPagination";
import Branches from "../../api/branches";
import {Controller, useForm} from "react-hook-form";
import Select from "react-select";
import FormHelper from '../../helpers/form'
import Can from "../../components/Common/Can";

const Missions = () => {
    document.title = 'Xidmətlər'
    const [confirmModal, setConfirmModal] = useState(false)
    const [form, setForm] = useState({})
    const [data, setData] = useState([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [branches, setBranches] = useState([])
    const [isFetching, setIsFetching] = useState(true)

    const {control, getValues, errors, reset} = useForm()

    const deleteData = async () => {
        await Api.delete(confirmModal)
        fetchData()
    }

    const fetchBranches = async () => {
        const {data} = await Branches.getSelect()
        setBranches(data)
    }

    const fetchData = async (showLoader = true, p = null) => {
        setIsFetching(showLoader)
        const data = await Api.get({page: p || page, ...FormHelper.validateBody(getValues())})
        setData(data?.data.services)
        setTotal(data?.meta?.total)
        setIsFetching(false)
    }

    useEffect(() => {
        fetchData()
    }, [page])

    useEffect(() => {
        fetchBranches()
    }, [])

    return (
        <div className="page-content">
            <ConfirmModal active={confirmModal} setActive={setConfirmModal} callback={deleteData}/>
            <Modal className="modal-dialog-centered" isOpen={form?.status}
                   toggle={() => setForm({})}>
                <ModalHeader
                    toggle={() => setForm({})}>{form?.data ? 'Düzəliş et' : 'Əlavə et'}</ModalHeader>
                <Add fetchData={fetchData} form={form} setForm={setForm}/>
            </Modal>
            <div className="container-fluid">
                <Breadcrumbs breadcrumbItem={`XİDMƏTLƏR (${total})`}/>
                <Row>
                    <Col sm={12}>
                        <div className="d-flex flex-column gap-2">
                            <Card>
                                <CardBody>
                                    <Row>
                                        <Col sm={12} md={4}>
                                            <div className="mb-3">
                                                <Label for="name">Ad</Label>
                                                <Controller name="name" control={control}
                                                            render={({field: {value, onChange}}) => (
                                                                <Input
                                                                    name="name"
                                                                    id="name"
                                                                    value={value}
                                                                    onChange={e => {
                                                                        onChange(e)
                                                                        setPage(1)
                                                                        fetchData(true, 1)
                                                                    }}
                                                                    className={errors?.name && 'is-invalid'}
                                                                />
                                                            )}/>
                                            </div>
                                        </Col>
                                        <Col sm={12} md={4}>
                                            <div className="mb-3">
                                                <Label for="department_id">Şöbə</Label>
                                                <Controller name="department_id"
                                                            control={control}
                                                            render={({field: {value, onChange}}) => (
                                                                <Select
                                                                    isClearable={true}
                                                                    options={branches}
                                                                    placeholder=""
                                                                    className={`w-100 ${errors?.department_id && 'is-invalid'}`}
                                                                    onChange={e => {
                                                                        onChange(e)
                                                                        setPage(1)
                                                                        fetchData(true, 1)
                                                                    }}
                                                                    value={value}
                                                                    name="department_id"
                                                                    id="department_id"/>
                                                            )}/>
                                            </div>
                                        </Col>
                                        <Col sm={12} md={4}>
                                            <div className="mb-3">
                                                <Label for="price">Qiymət</Label>
                                                <Controller name="price" control={control}
                                                            render={({field: {value, onChange}}) => (
                                                                <Input
                                                                    name="price"
                                                                    id="price"
                                                                    value={value}
                                                                    onChange={e => {
                                                                        onChange(e)
                                                                        setPage(1)
                                                                        fetchData(true, 1)
                                                                    }}
                                                                    className={errors?.price && 'is-invalid'}
                                                                />
                                                            )}/>
                                            </div>
                                        </Col>
                                        <Col sm={12}>
                                            <div className="d-flex justify-content-end">
                                                <Button id="reset-btn" color="primary" outline onClick={() => {
                                                    reset({
                                                        department_id: null,
                                                        price: '',
                                                        name: ''
                                                    })
                                                    setPage(1)
                                                    fetchData(1)
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
                                {isFetching ? (
                                    <div className="d-flex justify-content-center p-5">
                                        <Spinner color="primary" size="lg"/>
                                    </div>
                                ) : (
                                    <CardBody>
                                        <Can action="service_add">
                                            <Button
                                                onClick={() => setForm({status: true})}
                                                type="button"
                                                color="success"
                                                className="btn-label mb-3"
                                            >
                                                <i className="bx bx-plus label-icon"/> Əlavə et
                                            </Button>
                                        </Can>
                                        <div className="table-responsive">
                                            <table className="table table-bordered">
                                                <thead>
                                                <tr>
                                                    <th>№</th>
                                                    <th>Ad</th>
                                                    <th>Şöbə</th>
                                                    <th>Qiymət</th>
                                                    <th/>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {data.map((item, index) => (
                                                    <tr key={item.id}>
                                                        <td>{index + 1}</td>
                                                        <td>{item.name}</td>
                                                        <td>{item?.department_name}</td>
                                                        <td>{item.price}</td>
                                                        <td>
                                                            <div className="d-flex align-items-center gap-1">
                                                                <Can action="service_edit">
                                                                    <>
                                                                        <Button color="success"
                                                                                id={`edit-${item.id}`}
                                                                                onClick={() => setForm({
                                                                                    status: true,
                                                                                    data: item
                                                                                })}>
                                                                            <i className="bx bx-pencil"/>
                                                                        </Button>
                                                                        <UncontrolledTooltip target={`edit-${item.id}`}
                                                                                             placement="bottom">
                                                                            Düzəliş et
                                                                        </UncontrolledTooltip>
                                                                    </>
                                                                </Can>
                                                                <Can action="service_delete">
                                                                    <>
                                                                        <Button color="danger"
                                                                                id={`delete-${item.id}`}
                                                                                onClick={() => setConfirmModal(item.id)}>
                                                                            <i className="bx bx-trash"/>
                                                                        </Button>
                                                                        <UncontrolledTooltip
                                                                            target={`delete-${item.id}`}
                                                                            placement="bottom">
                                                                            Sil
                                                                        </UncontrolledTooltip>
                                                                    </>
                                                                </Can>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
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

export default Missions
