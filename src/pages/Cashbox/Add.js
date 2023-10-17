import {Controller, useForm} from "react-hook-form";
import {Button, Input, Label, ModalBody, ModalFooter, Spinner} from "reactstrap";
import FormHelper from "../../helpers/form";
import {useEffect, useState} from "react";
import Api from 'api/payments'

const Add = ({fetchData, form, setForm}) => {
    const {control, handleSubmit, setValue, setError, formState: {errors}} = useForm()
    const [loader, setLoader] = useState(false)

    const submit = async values => {
        setLoader(true)
        try {
            await Api.add(values)
            fetchData()
            setForm({})
        } catch (e) {
            FormHelper.setApiErrors(e.response.data, setError)
        } finally {
            setLoader(false)
        }
    }

    useEffect(() => {
        setValue('examination.id',form?.data?.examinationId)
    },[form])

    return (
        <form onSubmit={handleSubmit(submit)}>
            <ModalBody>
                <div className="mb-3">
                    <Label for="value">Məbləğ</Label>
                    <Controller rules={{required: true}} name="value" control={control}
                                render={({field: {value, onChange}}) => (
                                    <Input
                                        name="value"
                                        id="value"
                                        value={value}
                                        onChange={onChange}
                                        className={errors?.value && 'is-invalid'}
                                    />
                                )}/>
                    {FormHelper.generateFormFeedback(errors, 'value')}
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
