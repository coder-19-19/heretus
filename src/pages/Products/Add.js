import {Controller, useForm} from "react-hook-form";
import {Button, Input, Label, ModalBody, ModalFooter, Spinner} from "reactstrap";
import FormHelper from "../../helpers/form";
import {useEffect, useState} from "react";
import Api from 'api/products'
import TypeApi from 'api/product-types'
import Select from "react-select";

const Add = ({fetchData, form, setForm}) => {
    const {control, handleSubmit, setValue, setError, formState: {errors}} = useForm()
    const [loader, setLoader] = useState(false)
    const [isFetching, setIsFetching] = useState(true)
    const data = form?.data
    const [types, setTypes] = useState([])

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

    const fetchTypes = async () => {
        setIsFetching(true)
        const {data} = await TypeApi.getSelect()
        setTypes(data)
        setIsFetching(false)
    }

    useEffect(() => {
        fetchTypes()
    }, []);

    useEffect(() => {
        if (data && types.length) {
            setValue('id', data.id)
            setValue('name', data.name)
            setValue('price', data.price)
            setValue('type_id', types.find(item => item.value == data?.type_id))
        }
    }, [form, types])

    return (
        <form onSubmit={handleSubmit(submit)}>
            <ModalBody>
                {isFetching ? <div className="d-flex justify-content-center">
                    <Spinner size="lg" color="primary"/>
                </div> : (
                    <>
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
                        <div class="mb-3">
                            <Label for="type_id">Növ</Label>
                            <Controller render={({field: {value, onChange}}) => (
                                <Select
                                    options={types}
                                    placeholder=""
                                    className={`w-100 ${errors?.type_id && 'is-invalid'}`}
                                    onChange={onChange}
                                    value={value}
                                    name="type_id"
                                    id="type_id"/>
                            )} name="type_id" control={control}/>
                        </div>
                    </>
                )}
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
