import {Controller, useForm} from "react-hook-form";
import {Button, Input, Label, ModalBody, ModalFooter, Spinner} from "reactstrap";
import FormHelper from "../../helpers/form";
import {useEffect, useState} from "react";
import Api from 'api/invoice'
import Company from "../../api/company";
import Customers from "../../api/customers";
import Missions from "../../api/missions";
import Select from "react-select";
import PDFTemplate from "./PDFTemplate";

const Add = ({fetchData, form, setForm}) => {
    const {control, watch, handleSubmit, setValue, setError, formState: {errors}} = useForm()
    const [loader, setLoader] = useState(false)
    const data = form?.data
    const [companies, setCompanies] = useState([])
    const [customers, setCustomers] = useState([])
    const [services, setServices] = useState([])

    const submit = async values => {
        setLoader(true)
        try {
            await Api[values?.id ? 'update' : 'add'](values)
            fetchData()
            setForm({})
        } catch (e) {
            FormHelper.setApiErrors(e.response.data, setError)
        } finally {
            setLoader(false)
        }
    }

    const getCompanies = async () => {
        const {data} = await Company.selectListDetail()
        setCompanies(data)
    }

    const getCustomers = async () => {
        const {data} = await Customers.getSelect()
        setCustomers(data)
    }

    const getServices = async () => {
        const {data} = await Missions.getSelect()
        setServices(data)
    }

    useEffect(() => {
        if (data && companies.length && customers.length && services.length) {
            setValue('id', data.id)
            setValue('name', data.name)
            setValue('note', data.note)
        }
    }, [form, companies, customers, services])

    useEffect(() => {
        getCompanies()
        getCustomers()
        getServices()
    }, [])

    return (
        <form onSubmit={handleSubmit(submit)}>
            <ModalBody>
                <div className="mb-3">
                    <Label for="company_id">Daxili şirkət</Label>
                    <Controller rules={{required: true}} render={({field: {value, onChange}}) => (
                        <Select
                            options={companies}
                            placeholder=""
                            className={`w-100 ${errors?.company_id && 'is-invalid'}`}
                            onChange={onChange}
                            value={value}
                            name="company_id"
                            id="company_id"/>
                    )} name="company_id" control={control}/>
                    {FormHelper.generateFormFeedback(errors, 'company_id')}
                </div>
                <div className="mb-3">
                    <Label for="customer_id">Müştəri şirkət</Label>
                    <div className="d-flex align-items-center gap-2">
                        <Controller rules={{required: true}} name="customer_id"
                                    control={control}
                                    render={({field: {value, onChange}}) => (
                                        <div className="w-100">
                                            <Select
                                                options={customers}
                                                placeholder=""
                                                className={`w-100 ${errors?.customer_id && 'is-invalid'}`}
                                                onChange={onChange}
                                                value={value}
                                                name="customer_id"
                                                id="customer_id"/>
                                            {FormHelper.generateFormFeedback(errors, 'customer_id')}
                                        </div>
                                    )}/>
                    </div>
                </div>
                <div className="mb-3">
                    <Label for="product_id">Xidmət/Məhsul</Label>
                    <div className="d-flex align-items-center gap-2">
                        <Controller rules={{required: true}} name="product_id"
                                    control={control}
                                    render={({field: {value, onChange}}) => (
                                        <div className="w-100">
                                            <Select
                                                options={services}
                                                placeholder=""
                                                className={`w-100 ${errors?.product_id && 'is-invalid'}`}
                                                onChange={onChange}
                                                value={value}
                                                name="product_id"
                                                id="product_id"/>
                                            {FormHelper.generateFormFeedback(errors, 'product_id')}
                                        </div>
                                    )}/>
                    </div>
                </div>
                <div className="mb-3">
                    <Label for="note">Say</Label>
                    <Controller rules={{required: true}} name="quantity" control={control}
                                render={({field: {value, onChange}}) => (
                                    <Input
                                        type="number"
                                        name="quantity"
                                        id="quantity"
                                        value={value}
                                        onChange={onChange}
                                        className={errors?.quantity && 'is-invalid'}
                                    />
                                )}/>
                    {FormHelper.generateFormFeedback(errors, 'quantity')}
                </div>
                <div className="mb-3">
                    <Label for="price">Qiymət</Label>
                    <Controller rules={{required: true}} name="price" control={control}
                                render={({field: {value, onChange}}) => (
                                    <Input
                                        type="number"
                                        name="price"
                                        id="price"
                                        value={value}
                                        onChange={onChange}
                                        className={errors?.price && 'is-invalid'}
                                    />
                                )}/>
                    {FormHelper.generateFormFeedback(errors, 'quantity')}
                </div>
                <div className="mb-3">
                    <Label for="price">Cəm</Label>
                    <Input
                        type="number"
                        name="price"
                        id="price"
                        disabled
                        value={watch('quantity') * watch('price')}
                    />
                </div>
            </ModalBody>
            <ModalFooter>
                <div className="d-flex justify-content-end gap-1">
                    <PDFTemplate data={watch()} disabled={false}/>
                    <Button outline type="button" onClick={() => setForm({})} color="secondary">Bağla</Button>
                    <Button disabled={loader} type="submit" color="primary">
                        {loader ? <Spinner color="light" size="sm"/> : 'Yadda saxla'}
                    </Button>
                </div>
            </ModalFooter>
        </form>
    )
}

export default Add
