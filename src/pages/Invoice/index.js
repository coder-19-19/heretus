import ConfirmModal from "components/Common/ConfirmModal";
import Breadcrumbs from "components/Common/Breadcrumb";
import {useEffect, useState} from "react";
import Api from 'api/invoice'

import {Button, Card, CardBody, Col, Modal, ModalHeader, Row, Spinner, UncontrolledTooltip} from "reactstrap";
import Add from "./Add";
import CustomPagination from "../../components/CustomPagination";
import Can from "../../components/Common/Can";
import moment from "moment";
import ApproveModal from "./ApproveModal";

const Invoices = () => {
    document.title = 'Faktura'
    const [confirmModal, setConfirmModal] = useState(false)
    const [form, setForm] = useState({})
    const [approveForm, setApproveForm] = useState({})
    const [data, setData] = useState([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [isFetching, setIsFetching] = useState(true)

    const deleteData = async () => {
        await Api.delete(confirmModal)
        fetchData()
    }

    const fetchData = async (showLoader = true) => {
        setIsFetching(showLoader)
        const data = await Api.get({page})
        setData(data?.data?.invoices)
        setTotal(data?.meta?.total)
        setIsFetching(false)
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
            <Modal className="modal-dialog-centered" isOpen={approveForm?.status}
                   toggle={() => setApproveForm({})}>
                <ModalHeader
                    toggle={() => setApproveForm({})}>{'Təsdiqlə'}</ModalHeader>
                <ApproveModal fetchData={fetchData} form={approveForm} setForm={setApproveForm}/>
            </Modal>
            <div className="container-fluid">
                <Breadcrumbs breadcrumbItem={`FAKTURA (${total})`}/>
                <Row>
                    <Col sm={12}>
                        <Card>
                            {isFetching ? (
                                <div className="d-flex justify-content-center p-5">
                                    <Spinner color="primary" size="lg"/>
                                </div>
                            ) : (
                                <CardBody>
                                    <Can action="invoice_add">
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
                                                <th>Faktura No</th>
                                                <th>Şirkət</th>
                                                <th>Müştəri</th>
                                                <th>Xidmət/Məhsul</th>
                                                <th>Say</th>
                                                <th>Qiymət</th>
                                                <th>Cəm</th>
                                                <th>Fayllar</th>
                                                <th>Yaradılma tarixi</th>
                                                <th>Qeyd</th>
                                                <th/>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {data.map((item, index) => (
                                                <tr key={item.id}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.code}</td>
                                                    <td>{item.company_name}</td>
                                                    <td>{item.customer_name}</td>
                                                    <td>{item.product_name}</td>
                                                    <td>{item.quantity}</td>
                                                    <td>{item.price}</td>
                                                    <td>{item.price * item.quantity}</td>
                                                    <td>
                                                        <a target="_blank"
                                                           href={`${process.env.REACT_APP_FILE_URL}${item.pdf}`}>Faktura</a>
                                                        <br/>
                                                        {item.pdf2 &&
                                                            <a target="_blank"
                                                               href={`${process.env.REACT_APP_FILE_URL}${item.pdf2}`}>Təsdiqlənmiş
                                                                {' '}Faktura</a>}
                                                    </td>
                                                    <td>{moment(item?.created_at).format('DD.MM.YYYY HH:mm')}</td>
                                                    <td>{item.note}</td>
                                                    <td>
                                                        <div className="d-flex align-items-center gap-1">
                                                            {!item?.pdf2 && (
                                                                <>
                                                                    <Button color="success"
                                                                            id={`approve-${item.id}`}
                                                                            onClick={() => setApproveForm({
                                                                                status: true,
                                                                                data: item
                                                                            })}>
                                                                        <i className="fa fa-check"/>
                                                                    </Button>
                                                                    <UncontrolledTooltip target={`approve-${item.id}`}
                                                                                         placement="bottom">
                                                                        Təsdiqlə
                                                                    </UncontrolledTooltip>
                                                                </>
                                                            )}
                                                            <Can action="invoice_delete">
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

export default Invoices
