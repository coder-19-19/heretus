import {Controller, useForm} from "react-hook-form";
import {Button, Input, Label, ModalBody, ModalFooter, Spinner} from "reactstrap";
import FormHelper from "../../helpers/form";
import {useEffect, useState} from "react";
import Api from 'api/branches'

const Add = ({fetchData, form, setForm}) => {
    const {control, handleSubmit, setValue, setError, formState: {errors}} = useForm()
    const [loader, setLoader] = useState(false)
    const data = form?.data

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

    useEffect(() => {
        if (data) {
            setValue('id', data.id)
            setValue('name', data.name)
            setValue('note', data.note)
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
