import {Controller, useForm} from "react-hook-form";
import {Button, Input, Label, ModalBody, ModalFooter, Spinner} from "reactstrap";
import FormHelper from "../../helpers/form";
import {useEffect, useState} from "react";
import Api from 'api/missions'
import Branches from "../../api/branches";
import Select from "react-select";

const Add = ({fetchData, form, setForm}) => {
    const {control, handleSubmit, setValue, setError, formState: {errors}} = useForm()
    const [loader, setLoader] = useState(false)
    const [branches, setBranches] = useState([])

    const data = form?.data

    const submit = async values => {
        setLoader(true)
        try {
            await Api[values?.id ? 'update' : 'add'](FormHelper.validateBody(values))
            fetchData()
            setForm({})
        } catch (e) {
            FormHelper.setApiErrors(e.response.data, setError)
        } finally {
            setLoader(false)
        }
    }

    const fetchBranches = async () => {
        const {data} = await Branches.getSelect()
        setBranches(data)
    }

    const fetchModalData = async () => {
        await Promise.all([fetchBranches()])
    }

    useEffect(() => {
        fetchModalData()
    }, [])

    useEffect(() => {
        if (data) {
            setValue('id', data.id)
            setValue('name', data.name)
            setValue('price', data.price)
            setValue('department_id', {
                value: data.department_id,
                label: data.department_name
            })
        }
    }, [form])

    return (
        <form onSubmit={handleSubmit(submit)}>
            <ModalBody>
                <div className="mb-3">
                    <Label for="name">Ad</Label>
                    <Controller rules={{required: true}} name="name" control={control}
                                render={({field: {value, onChange}}) => (
                                    <Input
                                        name="name"
                                        id="name"
                                        value={value}
                                        onChange={onChange}
                                        className={errors?.name && 'is-invalid'}
                                    />
                                )}/>
                    {FormHelper.generateFormFeedback(errors, 'name')}
                </div>
                <div className="mb-3">
                    <Label for="department_id">Şöbə</Label>
                    <Controller rules={{required: true}} name="department_id" control={control}
                                render={({field: {value, onChange}}) => (
                                    <Select
                                        options={branches}
                                        placeholder=""
                                        className={`w-100 ${errors?.department_id && 'is-invalid'}`}
                                        onChange={onChange}
                                        value={value}
                                        name="department_id"
                                        id="department_id"/>
                                )}/>
                    {FormHelper.generateFormFeedback(errors, 'department_id')}
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
                    {FormHelper.generateFormFeedback(errors, 'price')}
                </div>
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
