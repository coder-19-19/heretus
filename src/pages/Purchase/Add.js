import {Controller, useFieldArray, useForm} from "react-hook-form";
import {Badge, Button, Col, Input, Label, ModalBody, ModalFooter, Row, Spinner} from "reactstrap";
import FormHelper from "../../helpers/form";
import {useEffect, useState} from "react";
import Api from 'api/purchase'
import Employees from "../../api/employees";
import Suppliers from "../../api/suppliers";
import Products from "../../api/products";
import Select from "react-select";

const Add = ({fetchData, form, setForm}) => {
    const {control, handleSubmit, setValue, setError, formState: {errors}} = useForm()
    const [loader, setLoader] = useState(false)
    const [workers, setWorkers] = useState([])
    const [suppliers, setSuppliers] = useState([])
    const [products, setProducts] = useState([])
    const [addData, setAddData] = useState({})
    const data = form?.data

    const productsArr = useFieldArray({
        control,
        name: 'products'
    })

    const submit = async values => {
        setLoader(true)
        try {
            await Api[values?.id ? 'update' : 'add']({
                ...FormHelper.validateBody(values),
                products: values?.products?.every(item => item.product_id && item.quantity) ? values?.products?.map(item => {
                    return {
                        ...item,
                        product_id: item?.product_id?.value || item?.product_id
                    }
                }) : []
            })
            fetchData()
            setForm({})
        } catch (e) {
            FormHelper.setApiErrors(e.response.data, setError)
        } finally {
            setLoader(false)
        }
    }

    const fetchWorkers = async () => {
        const {data} = await Employees.getSelect()
        setWorkers(data)
    }

    const fetchSuppliers = async () => {
        const {data} = await Suppliers.getSelect()
        setSuppliers(data)
    }

    const fetchProducts = async () => {
        const {data} = await Products.getSelect()
        setProducts(data)
    }

    const fetchModalData = async () => {
        await Promise.all([fetchWorkers(), fetchSuppliers(), fetchProducts()])
    }

    useEffect(() => {
        if (data && workers.length && suppliers.length && products.length) {
            setValue('id', data.id)
            setValue('supplier_id', suppliers.find(item => item.value == data?.supplier_id))
            setValue('worker_id', workers.find(item => item.value == data?.worker_id))
            setValue('products', data?.products || [])
            setValue('edv', data?.edv)
            setValue('note', data.note)
        }
    }, [form, workers, suppliers, products])

    useEffect(() => {
        fetchModalData()
    }, []);

    return (
        <form onSubmit={handleSubmit(submit)}>
            <ModalBody>
                <Row>
                    <Col sm={12} md={5}>
                        <div className="mb-3">
                            <Label for="supplier_id">Təhcizatçı</Label>
                            <Controller rules={{required: true}} render={({field: {value, onChange}}) => (
                                <Select
                                    options={suppliers}
                                    placeholder=""
                                    className={`w-100 ${errors?.supplier_id && 'is-invalid'}`}
                                    onChange={onChange}
                                    value={value}
                                    name="supplier_id"
                                    id="supplier_id"/>
                            )} name="supplier_id" control={control}/>
                            {FormHelper.generateFormFeedback(errors, 'supplier_id')}
                        </div>
                        <div className="mb-3">
                            <Label for="worker_id">İşçi</Label>
                            <Controller rules={{required: true}} render={({field: {value, onChange}}) => (
                                <Select
                                    options={workers}
                                    placeholder=""
                                    className={`w-100 ${errors?.worker_id && 'is-invalid'}`}
                                    onChange={onChange}
                                    value={value}
                                    name="worker_id"
                                    id="worker_id"/>
                            )} name="worker_id" control={control}/>
                            {FormHelper.generateFormFeedback(errors, 'worker_id')}
                        </div>
                        <div className="mb-3">
                            <Label for="note">Qeyd</Label>
                            <Controller name="note" control={control}
                                        render={({field: {value, onChange}}) => (
                                            <Input
                                                type="textarea"
                                                rows={5}
                                                name="note"
                                                id="note"
                                                value={value}
                                                onChange={onChange}
                                                className={errors?.note && 'is-invalid'}
                                            />
                                        )}/>
                            {FormHelper.generateFormFeedback(errors, 'note')}
                        </div>
                    </Col>
                    <Col sm={12} md={7}>
                        <div className="mb-3">
                            <Label for="product_id">Məhsul</Label>
                            <div className="d-flex gap-2">
                                <Select
                                    options={products.filter(item => !productsArr.fields?.map(data => data?.product_id?.value || data?.product_id).includes(item?.value))}
                                    placeholder=""
                                    className={`w-100`}
                                    onChange={e => setAddData(prev => ({
                                        ...prev,
                                        product_id: e
                                    }))}
                                    value={addData?.product_id}
                                    name="product_id"
                                    id="product_id"/>
                                <Button onClick={() => {
                                    productsArr.append(addData)
                                    setAddData({quantity: '', price: '', product_id: null, edv: ''})
                                }} disabled={!addData?.product_id || !addData?.quantity || !addData?.price}
                                        color="primary">
                                    <i className="bx bx-plus"/>
                                </Button>
                            </div>
                        </div>
                        <div className="mb-3">
                            <Label for="quantity">Sayı</Label>
                            <Input
                                onChange={e => setAddData(prev => ({
                                    ...prev,
                                    quantity: e.target.value
                                }))}
                                value={addData?.quantity}
                                name="quantity"
                                type="number"
                                id="quantity"/>
                        </div>
                        {/*<div className="mb-3">*/}
                        {/*    <Label for="edv">ƏDV(%)</Label>*/}
                        {/*    <Input*/}
                        {/*        type="number"*/}
                        {/*        rows={5}*/}
                        {/*        name="edv"*/}
                        {/*        id="edv"*/}
                        {/*        onChange={e => setAddData(prev => ({*/}
                        {/*            ...prev,*/}
                        {/*            edv: e.target.value*/}
                        {/*        }))}*/}
                        {/*        value={addData?.edv}*/}
                        {/*        className={errors?.edv && 'is-invalid'}*/}
                        {/*    />*/}
                        {/*</div>*/}
                        <div className="mb-3">
                            <Label for="price">Qiyməti</Label>
                            <Input
                                onChange={e => setAddData(prev => ({
                                    ...prev,
                                    price: e.target.value
                                }))}
                                value={addData?.price}
                                name="price"
                                type="number"
                                id="price"/>
                        </div>
                        {productsArr.fields?.length > 0 && (
                            <div style={{maxHeight: '400px', overflow: 'auto'}}>
                                <div className="table-responsive w-100">
                                    <table className="table table-bordered w-100">
                                        <thead>
                                        <tr>
                                            <th>Məhsul</th>
                                            <th>Sayı</th>
                                            {/*<th>ƏDV(%)</th>*/}
                                            <th>Qiyməti</th>
                                            <th>Məbləğ</th>
                                            <th/>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {productsArr.fields.map((item, index) => (
                                            <tr key={item.id}>
                                                <td>{item?.product_id?.label || item?.product_name}</td>
                                                <td>{item?.quantity}</td>
                                                {/*<td>{item?.edv}</td>*/}
                                                <td>{item?.price}</td>
                                                <td>{(Number(item?.price) + Number(item?.edv || 0)) * Number(item?.quantity)}</td>
                                                <td>
                                                    <Button size="sm" onClick={() => {
                                                        productsArr.remove(index)
                                                    }} color="danger" type="button"><i
                                                        className={`bx bx-minus`}/></Button>
                                                </td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td/>
                                            <td/>
                                            <td><b>Yekun məbləğ</b></td>
                                            <td>
                                                <Badge color="danger">
                                                    {productsArr.fields.reduce((acc, val) => {
                                                        return Number(acc) + ((Number(val?.price) + Number(val?.edv || 0)) * Number(val?.quantity))
                                                    }, 0)}
                                                </Badge>
                                            </td>
                                            <td/>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </Col>
                </Row>
            </ModalBody>
            <ModalFooter>
                <div className="d-flex justify-content-end gap-1">
                    <Button outline type="button" onClick={() => setForm({})}
                            color="secondary">Bağla</Button>
                    <Button disabled={loader || !productsArr.fields?.length} type="submit" color="primary">
                        {loader ? <Spinner color="light" size="sm"/> : 'Yadda saxla'}
                    </Button>
                </div>
            </ModalFooter>
        </form>
    )
}

export default Add