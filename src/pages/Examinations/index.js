import ConfirmModal from "components/Common/ConfirmModal";
import Breadcrumbs from "components/Common/Breadcrumb";
import {useState} from "react";
import Api from 'api/examinations'

import {Badge, Button, Card, CardBody, Col, Row, Spinner} from "reactstrap";
import moment from "moment";
import Add from "./Add";
import {toast} from "react-toastify";

const Examinations = () => {
    document.title = 'Xidmətlər və məhsullar'
    const [confirmModal, setConfirmModal] = useState(false)
    const [form, setForm] = useState({})
    const [data, setData] = useState({})
    const [isFetching, setIsFetching] = useState(false)
    const [addButtonIsDisabled, setAddButtonIsDisabled] = useState(false)

    const getColor = item => item?.debt > 0 ? {background: '#f46a6a', color: '#fff'} : {
        background: '#34c38f',
        color: '#fff'
    }


    const deleteData = async () => {
        await Api.delete(confirmModal)
        fetchData()
    }

    const fetchData = async (showLoader = true, id) => {
        setIsFetching(showLoader)
        const data = await Api.getByPatient(id)
        setData(data?.data)
        setIsFetching(false)
    }

    const removeData = index => {
        let newData = data?.examinations?.filter(item => !item?.id)
        newData = newData.filter((_, i) => i !== index)
        setData({
            ...data,
            examinations: newData
        })
    }

    const addBulk = async () => {
        setAddButtonIsDisabled(true)
        try {
            await Api.addBulk({
                examinations: data?.examinations?.filter(item => !item?.id)
            })
            fetchData(true, data?.examinations?.find(item => item?.patient_id)?.patient_id)
        } catch (e) {
            toast.error('Xəta baş verdi')
        } finally {
            setAddButtonIsDisabled(false)
        }
    }

    return (
        <div className="page-content">
            <ConfirmModal active={confirmModal} setActive={setConfirmModal} callback={deleteData}/>
            <div className="container-fluid">
                <Breadcrumbs breadcrumbItem={`XİDMƏTLƏR VƏ MƏHSULLAR (${data?.examinations?.length || 0})`}/>
                <Row>
                    <Col sm={12}>
                        <Card>
                            <CardBody>
                                <Add setData={setData} data={data} fetchData={fetchData} setForm={setForm} form={form}/>
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
                                <CardBody className="mt-3" style={{overflow: 'auto', maxHeight: '470px'}}>
                                    {data?.examinations?.some(item => !item?.id) && (
                                        <Button type="button" onClick={addBulk} disabled={addButtonIsDisabled}
                                                color="primary" className="mb-2">
                                            {addButtonIsDisabled ? <Spinner size="sm" color="light"/> : 'Yadda saxla'}
                                        </Button>
                                    )}
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
                                            {data?.examinations?.map((item, index) => (
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
                                                    {!item?.id && (
                                                        <td>
                                                            <Button onClick={() => removeData(index)} color="danger"
                                                                    id={`delete-${item.id}`}>
                                                                <i className="bx bx-trash"/>
                                                            </Button>
                                                        </td>
                                                    )}
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
                                                    {data?.examinations?.some(item => !item?.id) ? (
                                                        <Badge className="p-2 font-size-12"
                                                               color="warning">{data?.examinations?.reduce((acc, val) => {
                                                            return acc + val?.price
                                                        }, 0)}</Badge>
                                                    ) : (
                                                        <Badge className="p-2 font-size-12"
                                                               color="warning">{data?.total_price}</Badge>
                                                    )}
                                                </td>
                                                <td/>
                                                <td>
                                                    {data?.examinations?.some(item => !item?.id) ? (
                                                        <Badge className="p-2 font-size-12"
                                                               color="info">{data?.examinations?.reduce((acc, val) => {
                                                            console.log(val)
                                                            return acc + Number(val?.final_price)
                                                        }, 0)}</Badge>
                                                    ) : (
                                                        <Badge className="p-2 font-size-12"
                                                               color="info">{data?.total_final_price}</Badge>
                                                    )}
                                                </td>
                                                <td>
                                                    <Badge className="p-2 font-size-12"
                                                           color="success">{data?.total_payment}</Badge>
                                                </td>
                                                <td>
                                                    <Badge className="p-2 font-size-12"
                                                           color="danger">{data?.total_debt}</Badge>
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
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default Examinations
