import Breadcrumbs from "components/Common/Breadcrumb";
import {useEffect, useState} from "react";
import Api from 'api/products'

import {Button, Card, CardBody, Col, Input, Label, Row, Spinner, UncontrolledTooltip} from "reactstrap";
import CustomPagination from "../../components/CustomPagination";
import {Controller, useForm} from "react-hook-form";
import Select from "react-select";
import ProductTypes from "../../api/product-types";
import Form from "../../helpers/form";

const Branches = () => {
    document.title = 'Anbarda qalıq'
    const [data, setData] = useState([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [isFetching, setIsFetching] = useState(true)
    const [types, setTypes] = useState([])
    const [loader, setLoader] = useState(false)
    const {control, handleSubmit, reset, getValues} = useForm()

    const fetchData = async (showLoader = true, p = null) => {
        setIsFetching(showLoader)
        const data = await Api.getWarehouseLeft({page: p || page, ...Form.validateBody(getValues())})
        setData(data?.data)
        setTotal(data?.meta?.total)
        setIsFetching(false)
    }

    const fetchTypes = async () => {
        const {data} = await ProductTypes.getSelect()
        setTypes(data)
    }

    const filter = async () => {
        setPage(1)
        setLoader(true)
        fetchData(true, 1)
        setLoader(false)
    }

    useEffect(() => {
        fetchTypes()
    }, [])

    useEffect(() => {
        fetchData()
    }, [page])

    return (
        <div className="page-content">
            <div className="container-fluid">
                <Breadcrumbs breadcrumbItem={`ANBARDA QALIQ (${total})`}/>
                <Row>
                    <Col sm={12}>
                        <Card>
                            <CardBody>
                                <form onSubmit={handleSubmit(filter)}>
                                    <Row>
                                        <Col sm={12} md={4}>
                                            <Label for="prodcut">Məhsul</Label>
                                            <Controller render={({field: {value, onChange}}) => (
                                                <Input value={value} onChange={onChange} name="product" id="product"/>
                                            )} name="product" control={control}/>
                                        </Col>
                                        <Col sm={12} md={4}>
                                            <Label for="type_id">Növ</Label>
                                            <Controller render={({field: {value, onChange}}) => (
                                                <Select
                                                    isClearable
                                                    options={types}
                                                    placeholder=""
                                                    value={value}
                                                    onChange={onChange}
                                                    name="type_id"
                                                    id="type_id"/>
                                            )} name="type_id" control={control}/>
                                        </Col>
                                        <Col sm={12} md={4}>
                                            <Label for="quantity">Qalıq</Label>
                                            <Controller render={({field: {value, onChange}}) => (
                                                <Input type="number" value={value} onChange={onChange} name="quantity"
                                                       id="quantity"/>
                                            )} name="quantity" control={control}/>
                                        </Col>
                                        <Col sm={12}>
                                            <div className="d-flex justify-content-end mt-2">
                                                <div className="d-flex gap-2">
                                                    <Button id="reset-patient-btn" outline color="primary"
                                                            onClick={() => {
                                                                reset({
                                                                    quantity: '',
                                                                    product: '',
                                                                    type_id: null
                                                                })
                                                                setPage(1)
                                                                fetchData(true, 1)
                                                            }}>
                                                        <i className="bx bx-rotate-right"/>
                                                    </Button>
                                                    <UncontrolledTooltip placement="bottom"
                                                                         target="reset-patient-btn">
                                                        Sıfırla
                                                    </UncontrolledTooltip>
                                                    <Button color="primary" disabled={loader}>
                                                        {loader ?
                                                            <Spinner size="sm" color="light"/> : 'Axtar'}
                                                    </Button>
                                                </div>
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
                                    <div className="table-responsive">
                                        <table className="table table-bordered">
                                            <thead>
                                            <tr>
                                                <th>№</th>
                                                <th>Məhsul</th>
                                                <th>Növü</th>
                                                <th>Qalıq</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {data.map((item, index) => (
                                                <tr key={item.id}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.label}</td>
                                                    <td>{item.type_name}</td>
                                                    <td>{item.count}</td>
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
