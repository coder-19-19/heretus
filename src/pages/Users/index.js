import ConfirmModal from "components/Common/ConfirmModal";
import Breadcrumbs from "components/Common/Breadcrumb";
import {useEffect, useState} from "react";
import Api from 'api/users'

import {Badge, Button, Card, CardBody, Col, Modal, ModalHeader, Row, Spinner, UncontrolledTooltip} from "reactstrap";
import Add from "./Add";

const Users = () => {
    document.title = 'İstifadəçilər'
    const [confirmModal, setConfirmModal] = useState(false)
    const [form, setForm] = useState({})
    const [data, setData] = useState([])
    const [isFetching, setIsFetching] = useState(true)

    const deleteData = async () => {
        await Api.delete(confirmModal)
        fetchData()
    }

    const fetchData = async (showLoader = true) => {
        setIsFetching(showLoader)
        const {data} = await Api.get()
        setData(data)
        setIsFetching(false)
    }

    useEffect(() => {
        fetchData()
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
                <Breadcrumbs breadcrumbItem={`İSTİFADƏÇİLƏR (${data.length})`}/>
                <Row>
                    <Col sm={12}>
                        <Card>
                            {isFetching ? (
                                <div className="d-flex justify-content-center p-5">
                                    <Spinner color="primary" size="lg"/>
                                </div>
                            ) : (
                                <CardBody>
                                    {/*<Button*/}
                                    {/*    onClick={() => setForm({status: true})}*/}
                                    {/*    type="button"*/}
                                    {/*    color="success"*/}
                                    {/*    className="btn-label mb-3"*/}
                                    {/*>*/}
                                    {/*    <i className="bx bx-plus label-icon"/> Əlavə et*/}
                                    {/*</Button>*/}
                                    <div className="table-responsive">
                                        <table className="table table-bordered">
                                            <thead>
                                            <tr>
                                                <th>№</th>
                                                <th>Ad</th>
                                                <th>Soyad</th>
                                                <th>Status</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {data.map((item, index) => (
                                                <tr key={item.id}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.employee.firstName}</td>
                                                    <td>{item.employee.lastName}</td>
                                                    <td><Badge
                                                        color={item.status ? 'success' : 'danger'}>{item.status ? 'Aktiv' : 'Deaktiv'}</Badge>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex align-items-center gap-1">
                                                            <Button color="danger"
                                                                    id={`delete-${item.id}`}
                                                                    onClick={() => setConfirmModal(item.id)}>
                                                                <i className="bx bx-trash"/>
                                                            </Button>
                                                            <UncontrolledTooltip target={`delete-${item.id}`}
                                                                                 placement="bottom">
                                                                Sil
                                                            </UncontrolledTooltip>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardBody>
                            )}
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default Users
