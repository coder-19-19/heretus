import ConfirmModal from "components/Common/ConfirmModal";
import Breadcrumbs from "components/Common/Breadcrumb";
import {useEffect, useState} from "react";
import Api from 'api/outside-work'

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
import Add from "./Add";
import CustomPagination from "../../components/CustomPagination";
import Can from "../../components/Common/Can";
import moment from "moment";
import {Controller, useForm} from "react-hook-form";
import FlatPicker from "react-flatpickr";
import Form from "../../helpers/form";

const OutsideWork = () => {
    document.title = 'Kənar işçilik'
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

    const fetchData = async (showLoader = true, p = null) => {
        setIsFetching(showLoader)
        const data = await Api.get({
            page: p || page,
            date: Form.convertFormDate(getValues()?.date)
        })
        setData(data?.data?.works)
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
            <Modal className="modal-dialog-centered" isOpen={form?.status}
                   toggle={() => setForm({})}>
                <ModalHeader
                    toggle={() => setForm({})}>{form?.data ? 'Düzəliş et' : 'Əlavə et'}</ModalHeader>
                <Add fetchData={fetchData} form={form} setForm={setForm}/>
            </Modal>
            <div className="container-fluid">
                <Breadcrumbs breadcrumbItem={`KƏNAR İŞÇİLİK (${total})`}/>
                <Row>
                    <Col sm={12}>
                        <Card>
                            <CardBody>
                                <form onSubmit={handleSubmit(filter)}>
                                    <Row>
                                        <Col sm={12} md={4}>
                                            <div className="mb-3">
                                                <Label for="date">Tarix</Label>
                                                <Controller name="date"
                                                            control={control}
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
                                            <div className="d-flex gap-2 justify-content-end">
                                                <Button id="reset-btn" color="primary" outline onClick={() => {
                                                    reset({
                                                        date: null
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
                                    <Can action="outside_work_add">
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
                                                <th>Fayl</th>
                                                <th>Mədxail</th>
                                                <th>Məxaric</th>
                                                <th>Mənfəət</th>
                                                <th>Yaradılma tarixi</th>
                                                <th>Qeyd</th>
                                                <th/>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {data.map((item, index) => (
                                                <tr key={item.id}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        <a target="_blank"
                                                           href={`${process.env.REACT_APP_FILE_URL}${item.file}`}>Fayl</a>
                                                    </td>
                                                    <td>{item.income}</td>
                                                    <td>{item.expense}</td>
                                                    <td>{item.benefit}</td>
                                                    <td>{moment(item?.created_at).format('DD.MM.YYYY HH:mm')}</td>
                                                    <td>{item.note}</td>
                                                    <td>
                                                        <div className="d-flex align-items-center gap-1">
                                                            <Can action="outside_work_delete">
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
                                            <tr>
                                                <td/>
                                                <td/>
                                                <td>
                                                    <Badge className="p-2 font-size-12" color="primary">
                                                        {data?.reduce((acc, val) => {
                                                            return acc + val?.income
                                                        }, 0)}{' '}
                                                    </Badge>
                                                </td>
                                                <td>
                                                    <Badge className="p-2 font-size-12" color="danger">
                                                        {data?.reduce((acc, val) => {
                                                            return acc + val?.expense
                                                        }, 0)}{' '}
                                                    </Badge>
                                                </td>
                                                <td>
                                                    <Badge className="p-2 font-size-12" color="success">
                                                        {data?.reduce((acc, val) => {
                                                            return acc + val?.benefit
                                                        }, 0)}{' '}
                                                    </Badge>
                                                </td>
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
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default OutsideWork
