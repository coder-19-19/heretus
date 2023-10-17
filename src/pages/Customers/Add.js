import {Controller, useForm} from "react-hook-form";
import {Button, Col, Input, Label, ModalBody, ModalFooter, Row, Spinner} from "reactstrap";
import FormHelper from "../../helpers/form";
import {useEffect, useState} from "react";
import Api from 'api/customers'
import Company from "../../api/company";
import Select from "react-select";

const Add = ({fetchData, form, setForm}) => {
    const {control, handleSubmit, reset, setError, formState: {errors}} = useForm()
    const [loader, setLoader] = useState(false)
    const [companies, setCompanies] = useState([])
    const data = form?.data

    const submit = async values => {
        setLoader(true)
        try {
            await Api[values?.id ? 'update' : 'add']({
                ...values,
                company_id: values?.company_id?.value
            })
            fetchData()
            setForm({})
        } catch (e) {
            FormHelper.setApiErrors(e.response.data, setError)
        } finally {
            setLoader(false)
        }
    }

    const fetchCompanies = async () => {
        const {data} = await Company.getSelect()
        setCompanies(data)
    }

    useEffect(() => {
        if (data && companies.length) {
            reset({
                ...data,
                company_id: companies.find(item => item.value == data?.company_id)
            })
        }
    }, [form, companies])

    useEffect(() => {
        fetchCompanies()
    }, [])

    return (
        <form onSubmit={handleSubmit(submit)}>
            <ModalBody>
                <Row>
                    <Col sm={12} md={12}>
                        <div className="mb-3">
                            <Label for="company_id">Şirkət</Label>
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
                            <Label for="driver">Sürücü</Label>
                            <Controller rules={{required: true}} name="driver" control={control}
                                        render={({field: {value, onChange}}) => (
                                            <Input
                                                name="driver"
                                                id="driver"
                                                value={value}
                                                onChange={onChange}
                                                className={errors?.driver && 'is-invalid'}
                                            />
                                        )}/>
                            {FormHelper.generateFormFeedback(errors, 'driver')}
                        </div>
                        <div className="mb-3">
                            <Label for="car_number">Maşın nömrəsi</Label>
                            <Controller rules={{required: true}} name="car_number" control={control}
                                        render={({field: {value, onChange}}) => (
                                            <Input
                                                name="car_number"
                                                id="car_number"
                                                value={value}
                                                onChange={onChange}
                                                className={errors?.car_number && 'is-invalid'}
                                            />
                                        )}/>
                            {FormHelper.generateFormFeedback(errors, 'car_number')}
                        </div>
                        <div className="mb-3">
                            <Label for="phone">Nömrə</Label>
                            <Controller rules={{required: true}} name="phone" control={control}
                                        render={({field: {value, onChange}}) => (
                                            <Input
                                                name="phone"
                                                id="phone"
                                                value={value}
                                                onChange={onChange}
                                                className={errors?.phone && 'is-invalid'}
                                            />
                                        )}/>
                            {FormHelper.generateFormFeedback(errors, 'phone')}
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
                </Row>
            </ModalBody>
            <ModalFooter>
                <div className="d-flex justify-content-end gap-1">
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
