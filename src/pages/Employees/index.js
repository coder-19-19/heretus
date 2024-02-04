import ConfirmModal from "components/Common/ConfirmModal";
import Breadcrumbs from "components/Common/Breadcrumb";
import {useEffect, useState} from "react";
import Api from 'api/employees'

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
import Can from "../../components/Common/Can";
import {Controller, useForm} from "react-hook-form";
import Select from "react-select";
import FlatPicker from "react-flatpickr";

const Employees = () => {
    document.title = 'İşçilər'
    const [confirmModal, setConfirmModal] = useState(false)
    const [form, setForm] = useState({})
    const [data, setData] = useState([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [isFetching, setIsFetching] = useState(true)
    const {control, errors, reset, getValues, handleSubmit} = useForm()

    const deleteData = async () => {
        await Api.delete(confirmModal)
        fetchData()
    }

    const fetchData = async (showLoader = true,p = null) => {
        setIsFetching(showLoader)
        const data = await Api.get({
            page: p || page,
            ...getValues()
        })
        setData(data?.data?.workers)
        setTotal(data?.meta?.total)
        setIsFetching(false)
    }

    const filter = async () => {
        fetchData(true, 1)
    }

    useEffect(() => {
        fetchData()
    }, [page])

    return (
        <div className="page-content">
            <ConfirmModal active={confirmModal} setActive={setConfirmModal} callback={deleteData}/>
            <Modal size="xl" className="modal-dialog-centered" isOpen={form?.status}
                   toggle={() => setForm({})}>
                <ModalHeader
                    toggle={() => setForm({})}>{form?.data ? 'Düzəliş et' : 'Əlavə et'}</ModalHeader>
                <Add fetchData={fetchData} form={form} setForm={setForm}/>
            </Modal>
            <div className="container-fluid">
                <Breadcrumbs breadcrumbItem={`İŞÇİLƏR (${total})`}/>
                <Row>
                    <Col sm={12}>
                        <Card>
                            <CardBody>
                                <form onSubmit={handleSubmit(filter)}>
                                    <Row>
                                        <Col sm={12} md={3}>
                                            <div className="mb-3">
                                                <Label for="name">Ad</Label>
                                                <Controller name="name"
                                                            control={control}
                                                            render={({field: {value, onChange}}) => (
                                                                <Input
                                                                    name="name"
                                                                    id="name"
                                                                    value={value}
                                                                    onChange={onChange}
                                                                />
                                                            )}/>
                                            </div>
                                        </Col>
                                        <Col sm={12} md={3}>
                                            <div className="mb-3">
                                                <Label for="surname">Soyad</Label>
                                                <Controller name="surname"
                                                            control={control}
                                                            render={({field: {value, onChange}}) => (
                                                                <Input
                                                                    name="surname"
                                                                    id="surname"
                                                                    value={value}
                                                                    onChange={onChange}
                                                                />
                                                            )}/>
                                            </div>
                                        </Col>
                                        <Col sm={12} md={3}>
                                            <div className="mb-3">
                                                <Label for="father_name">Ata adı</Label>
                                                <Controller name="father_name"
                                                            control={control}
                                                            render={({field: {value, onChange}}) => (
                                                                <Input
                                                                    name="father_name"
                                                                    id="father_name"
                                                                    value={value}
                                                                    onChange={onChange}
                                                                />
                                                            )}/>
                                            </div>
                                        </Col>
                                        <Col sm={12} md={3}>
                                            <div className="mb-3">
                                                <Label for="fin_code">Fin kod</Label>
                                                <Controller name="fin_code"
                                                            control={control}
                                                            render={({field: {value, onChange}}) => (
                                                                <Input
                                                                    name="fin_code"
                                                                    id="fin_code"
                                                                    value={value}
                                                                    onChange={onChange}
                                                                />
                                                            )}/>
                                            </div>
                                        </Col>
                                        <Col sm={12}>
                                            <div className="d-flex gap-2 justify-content-end">
                                                <Button id="reset-btn" color="primary" outline onClick={() => {
                                                    reset({
                                                        name: null,
                                                        surname: null,
                                                        father_name: null,
                                                        fin_code: null
                                                    })
                                                    setPage(1)
                                                    fetchData(true, 1)
                                                }}>
                                                    <i className="bx bx-rotate-right"/>
                                                </Button>
                                                <UncontrolledTooltip placement="bottom" target="reset-btn">
                                                    Sıfırla
                                                </UncontrolledTooltip>
                                                <Button type="submit" color="primary">
                                                    Axtar
                                                </Button>
                                            </div>
                                        </Col>
                                    </Row>
                                </form>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col sm={12}>
                        <Card>
                            {isFetching ? (
                                <div className="d-flex justify-content-center p-5">
                                    <Spinner color="primary" size="lg"/>
                                </div>
                            ) : (
                                <CardBody>
                                    <Can action="worker_add">
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
                                                <th>Soyad</th>
                                                <th>Ata adı</th>
                                                <th>Vəzifə</th>
                                                <th>Səlahiyyət</th>
                                                <th>Mobil nömrə</th>
                                                <th>FİN kod</th>
                                                <th>Hazırda işlədiyi yeri</th>
                                                <th>Qeyd</th>
                                                <th/>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {data.map((item, index) => (
                                                <tr key={item.id}>
                                                    <td>{index + 1}</td>
                                                    <td>{item?.name}</td>
                                                    <td>{item?.surname}</td>
                                                    <td>{item?.father_name}</td>
                                                    <td>{item?.position_name}</td>
                                                    <td>{item?.role_name}</td>
                                                    <td>{item?.mobile_phone}</td>
                                                    <td>{item?.fin_code}</td>
                                                    <td>{item?.current_workplace}</td>
                                                    <td>{item?.note}</td>
                                                    <td>
                                                        <div className="d-flex align-items-center gap-1">
                                                            <Can action="worker_edit">
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
                                                            </Can>
                                                            <Can action="worker_delete">
                                                                <Button color="danger"
                                                                        id={`delete-${item.id}`}
                                                                        onClick={() => setConfirmModal(item.id)}>
                                                                    <i className="bx bx-trash"/>
                                                                </Button>
                                                                <UncontrolledTooltip target={`delete-${item.id}`}
                                                                                     placement="bottom">
                                                                    Sil
                                                                </UncontrolledTooltip>
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
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default Employees
