import {Controller, useFieldArray, useForm} from "react-hook-form";
import {Button, Col, Input, Label, ModalBody, ModalFooter, Row, Spinner, UncontrolledTooltip} from "reactstrap";
import FormHelper from "../../helpers/form";
import {useEffect, useState} from "react";
import Api from 'api/sale'
import Employees from "../../api/employees";
import Products from "../../api/products";
import Select from "react-select";
import Branches from "../../api/branches";

const Add = ({fetchData, form, setForm}) => {
    const {control, handleSubmit, setValue, setError, formState: {errors}} = useForm()
    const [loader, setLoader] = useState(false)
    const [workers, setWorkers] = useState([])
    const [products, setProducts] = useState([])
    const [addData, setAddData] = useState({})
    const [doctors, setDoctors] = useState([])
    const [branches, setBranches] = useState([])
    const [storekeepers, setStorekeepers] = useState([])
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

    const fetchStorekeepers = async () => {
        const {data} = await Employees.getSelect({is_storekeeper: true})
        setStorekeepers(data)
    }

    const fetchProducts = async () => {
        const {data} = await Products.getWarehouseLeft({select: true})
        setProducts(data)
    }

    const fetchDoctors = async () => {
        const {data} = await Employees.getDoctors()
        setDoctors(data)
    }

    const fetchBranches = async () => {
        const {data} = await Branches.getSelect()
        setBranches(data)
    }

    const fetchModalData = async () => {
        await Promise.all([fetchWorkers(), fetchProducts(), fetchDoctors(), fetchBranches(), fetchStorekeepers()])
    }

    useEffect(() => {
        if (data && workers.length && products.length && doctors.length && branches.length) {
            setValue('id', data.id)
            setValue('worker_id', workers.find(item => item.value == data?.worker_id))
            setValue('storehouser_id', workers.find(item => item.value == data?.storehouser_id))
            setValue('department_id', branches.find(item => item.value == data?.department_id))
            setValue('doctor_id', doctors.find(item => item.value == data?.doctor_id))
            setValue('products', data?.products || [])
            setValue('note', data.note)
        }
    }, [form, workers, products, doctors, branches])

    useEffect(() => {
        fetchModalData()
    }, []);

    return (
        <form onSubmit={handleSubmit(submit)}>
            <ModalBody>
                <Row>
                    <Col sm={12} md={6}>
                        <div className="mb-3">
                            <Label for="storehouser_id">Anbardar</Label>
                            <Controller rules={{required: true}} render={({field: {value, onChange}}) => (
                                <Select
                                    options={storekeepers}
                                    placeholder=""
                                    className={`w-100 ${errors?.storehouser_id && 'is-invalid'}`}
                                    onChange={onChange}
                                    value={value}
                                    name="storehouser_id"
                                    id="storehouser_id"/>
                            )} name="storehouser_id" control={control}/>
                            {FormHelper.generateFormFeedback(errors, 'storehouser_id')}
                        </div>
                        <div className="mb-3">
                            <Label for="department_id">Şöbə</Label>
                            <Controller rules={{required: true}} render={({field: {value, onChange}}) => (
                                <Select
                                    options={branches}
                                    placeholder=""
                                    className={`w-100 ${errors?.department_id && 'is-invalid'}`}
                                    onChange={onChange}
                                    value={value}
                                    name="department_id"
                                    id="department_id"/>
                            )} name="department_id" control={control}/>
                            {FormHelper.generateFormFeedback(errors, 'department_id')}
                        </div>
                        <div className="mb-3">
                            <Label for="worker_id">Götürən işçi</Label>
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
                            <Label for="doctor_id">Götürən Nümayəndə</Label>
                            <Controller rules={{required: true}} render={({field: {value, onChange}}) => (
                                <Select
                                    options={doctors}
                                    placeholder=""
                                    className={`w-100 ${errors?.doctor_id && 'is-invalid'}`}
                                    onChange={onChange}
                                    value={value}
                                    name="doctor_id"
                                    id="doctor_id"/>
                            )} name="doctor_id" control={control}/>
                            {FormHelper.generateFormFeedback(errors, 'doctor_id')}
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
                    <Col sm={12} md={6}>
                        <div className="mb-1">
                            <Label for="product_id">Məhsul</Label>
                            <div className="d-flex gap-2">
                                <Select
                                    options={products.filter(item => !productsArr.fields?.map(data => data?.product_id?.value || data?.product_id).includes(item?.value))}
                                    placeholder=""
                                    className={`w-100`}
                                    onChange={e => setAddData(prev => ({
                                        ...prev,
                                        product_id: e,
                                    }))}
                                    value={addData?.product_id}
                                    name="product_id"
                                    id="product_id"/>
                                <Button onClick={() => {
                                    productsArr.append(addData)
                                    setAddData({quantity: '', product_id: null})
                                }} disabled={!addData?.product_id || !addData?.quantity}
                                        color="primary">
                                    <i className="bx bx-plus"/>
                                </Button>
                            </div>
                        </div>
                        <div className="mb-1">
                            <Label for="quantity">Sayı</Label>
                            <Input
                                onChange={e => {
                                    if (Number(e.target.value) <= Number(addData?.product_id?.count)) {
                                        setAddData(prev => ({
                                            ...prev,
                                            quantity: e.target.value
                                        }))
                                    }
                                }}
                                value={addData?.quantity}
                                name="quantity"
                                disabled={!addData?.product_id}
                                max={addData?.product_id?.count}
                                type="number"
                                id="quantity"/>
                            <UncontrolledTooltip target="quantity" placement="right">
                                Anbarda {addData?.product_id?.count} ədəd qalıb
                            </UncontrolledTooltip>
                        </div>
                        {productsArr.fields?.length > 0 && (
                            <div style={{maxHeight: '400px', overflow: 'auto'}}>
                                <div className="table-responsive w-100">
                                    <table className="table table-bordered w-100">
                                        <thead>
                                        <tr>
                                            <th>Məhsul</th>
                                            <th>Sayı</th>
                                            <th/>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {productsArr.fields.map((item, index) => (
                                            <tr key={item.id}>
                                                <td>{item?.product_id?.label || item?.product_name}</td>
                                                <td>{item?.quantity}</td>
                                                <td>
                                                    <Button size="sm" onClick={() => {
                                                        productsArr.remove(index)
                                                    }} color="danger" type="button"><i
                                                        className={`bx bx-minus`}/></Button>
                                                </td>
                                            </tr>
                                        ))}
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
