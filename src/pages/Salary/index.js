import Breadcrumbs from "components/Common/Breadcrumb";
import {useEffect, useState} from "react";
import Api from 'api/salary'

import {Button, Card, CardBody, Col, Modal, ModalHeader, Row, Spinner, UncontrolledTooltip} from "reactstrap";
import CustomPagination from "../../components/CustomPagination";
import {useForm} from "react-hook-form";
import Filters from "./Filters";
import Form from "../../helpers/form";
import Detail from "./Detail";
import Pay from "./Pay";
import Can from "../../components/Common/Can";

const Branches = () => {
    document.title = 'Maaşlar'
    const currentDate = new Date()
    const start_date = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const [data, setData] = useState([])
    const [payModal, setPayModal] = useState(false)
    const defaultValues = {
        start_date,
        end_date: new Date(),
        worker_id: null
    }
    const filterForm = useForm({defaultValues})
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [isFetching, setIsFetching] = useState(true)
    const [detailModal, setDetailModal] = useState(false)

    const fetchData = async (showLoader = true, p = null) => {
        if (p) {
            setPage(p)
        }
        setIsFetching(showLoader)
        const values = filterForm.getValues()
        const data = await Api.get({
            page: p || page,
            ...Form.validateBody(values),
            start_date: Form.convertFormDate(values?.start_date),
            end_date: Form.convertFormDate(values?.end_date)
        })
        setData(data?.data?.workers)
        setTotal(data?.meta?.total)
        setIsFetching(false)
    }

    useEffect(() => {
        fetchData()
    }, [page])

    return (
        <div className="page-content">
            <Modal size="xl" className="modal-dialog-centered" isOpen={detailModal?.status}
                   toggle={() => setDetailModal({})}>
                <ModalHeader
                    toggle={() => setDetailModal({})}>İşçinin müayinələri</ModalHeader>
                <Detail data={detailModal} setActive={setDetailModal}/>
            </Modal>
            <Modal className="modal-dialog-centered" isOpen={payModal?.status}
                   toggle={() => setPayModal({})}>
                <ModalHeader
                    toggle={() => setPayModal({})}>Maaşı ödə</ModalHeader>
                <Pay form={payModal} fetchData={fetchData} setForm={setPayModal}/>
            </Modal>
            <div className="container-fluid">
                <Breadcrumbs breadcrumbItem={`MAAŞLAR (${total})`}/>
                <Row>
                    <Col sm={12}>
                        <Filters form={filterForm} fetchData={fetchData} defaultValues={defaultValues}/>
                    </Col>
                    <Col sm={12}>
                        <Card>
                            {isFetching ? (
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
                                                <th>Ad soyad</th>
                                                <th>Xəstə qəbul sayı</th>
                                                <th>Xəstə qəbula görə qazanılan gəlir</th>
                                                <th>Xəstə qəbula görə ödənilən maaş</th>
                                                <th>Göndərilən Müştəri sayı</th>
                                                <th>Göndərilən Müştəriə görə qazanılan gəlir</th>
                                                <th>Göndərilən Müştəriə görə ödənilən maaş</th>
                                                <th>Ümumi qazanılan məbləğ</th>
                                                <th>Ümumi ödənilən məbləğ</th>
                                                <th/>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {data.map((item, index) => (
                                                <tr key={item.id}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.name} {item.surname}</td>
                                                    <td>{item.doctor_examination_count}</td>
                                                    <td>{item.doctor_examination_price}</td>
                                                    <td>{item.doctor_examination_paid_price}</td>
                                                    <td>{item.worker_examination_count}</td>
                                                    <td>{item.worker_examination_price}</td>
                                                    <td>{item.worker_examination_paid_price}</td>
                                                    <td>{item.doctor_examination_price + item.worker_examination_price}</td>
                                                    <td>{item.doctor_examination_paid_price + item.worker_examination_paid_price}</td>
                                                    <td>
                                                        <div className="d-flex align-items-center gap-1">
                                                            <Button color="primary"
                                                                    id={`show-${item.id}`}
                                                                    onClick={() => setDetailModal({
                                                                        status: true,
                                                                        data: item
                                                                    })}>
                                                                <i className="bx bx-show"/>
                                                            </Button>
                                                            <UncontrolledTooltip target={`show-${item.id}`}
                                                                                 placement="bottom">
                                                                Bax
                                                            </UncontrolledTooltip>
                                                            <Can action="salary_add">
                                                                <Button color="success"
                                                                        disabled={item.doctor_examination_price + item.worker_examination_price <= item.doctor_examination_paid_price + item.worker_examination_paid_price}
                                                                        id={`pay-${item.id}`}
                                                                        onClick={() => setPayModal({
                                                                            status: true,
                                                                            data: {
                                                                                ...item,
                                                                                start_date: filterForm.getValues()?.start_date,
                                                                                end_date: filterForm.getValues()?.end_date,
                                                                            }
                                                                        })}>
                                                                    <i className="bx bx-money"/>
                                                                </Button>
                                                                <UncontrolledTooltip target={`pay-${item.id}`}
                                                                                     placement="bottom">
                                                                    Ödə
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

export default Branches
