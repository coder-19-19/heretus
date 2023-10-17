import {Controller, useForm} from "react-hook-form";
import {Button, Input, Label, ModalBody, ModalFooter, Spinner} from "reactstrap";
import FormHelper from "../../helpers/form";
import {useEffect, useState} from "react";
import Api from 'api/positions'

const Add = ({fetchData, form, setForm}) => {
    const rejectedNames = ['Anbardar', 'anbardar']
    const {control, handleSubmit, setValue, setError, formState: {errors}} = useForm()
    const [loader, setLoader] = useState(false)
    const data = form?.data

    const submit = async values => {
        if (values?.id && rejectedNames.includes(values?.name)) {
            return
        }
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
            setValue('is_doctor', data.is_doctor)
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
                                        disabled={rejectedNames.includes(data?.name)}
                                        value={value}
                                        onChange={onChange}
                                        className={errors?.name && 'is-invalid'}
                                    />
                                )}/>
                    {FormHelper.generateFormFeedback(errors, 'name')}
                </div>
                <div className="mb-3">
                    <Controller name="is_doctor" control={control}
                                render={({field: {value, onChange}}) => (
                                    <Label className="d-flex gap-1">
                                        <div className="form-check">
                                            <input type="checkbox"
                                                   value={value}
                                                   checked={value == 1}
                                                   disabled={rejectedNames.includes(data?.name)}
                                                   onChange={onChange}
                                                   name={value}
                                                   className="form-check-input"/>
                                        </div>
                                        Xidmətlərdə görünsün
                                    </Label>
                                )}/>
                    {FormHelper.generateFormFeedback(errors, 'name')}
                </div>
            </ModalBody>
            <ModalFooter>
                <div className="d-flex justify-content-end gap-1">
                    <Button outline type="button" onClick={() => setForm({})} color="secondary">Bağla</Button>
                    {!rejectedNames.includes(data?.name) && (
                        <Button disabled={loader} type="submit" color="primary">
                            {loader ? <Spinner color="light" size="sm"/> : 'Yadda saxla'}
                        </Button>
                    )}
                </div>
            </ModalFooter>
        </form>
    )
}

export default Add
