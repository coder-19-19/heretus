import {Controller, useForm} from "react-hook-form";
import {Button, Input, Label, ModalBody, ModalFooter, Spinner} from "reactstrap";
import FormHelper from "../../helpers/form";
import {useEffect, useState} from "react";
import Api from 'api/invoice'

const Add = ({fetchData, form, setForm}) => {
    const {control, watch, handleSubmit, setValue, setError, formState: {errors}} = useForm()
    const [loader, setLoader] = useState(false)


    const submit = async values => {
        setLoader(true)
        try {
            const formData = new FormData()
            formData.append('id', values?.id)
            formData.append('pdf', values?.pdf)
            formData.append('note', values?.note)
            await Api.savePDF(formData)
            fetchData()
            setForm({})
        } catch (e) {
            FormHelper.setApiErrors(e.response.data, setError)
        } finally {
            setLoader(false)
        }
    }


    useEffect(() => {
        if (form?.data) {
            setValue('id', form?.data?.id)
        }
    }, [form])

    return (
        <form onSubmit={handleSubmit(submit)}>
            <ModalBody>
                <div className="mb-3">
                    <Label for="pdf">Fayl</Label>
                    <Controller rules={{required: true}} name="pdf" control={control}
                                render={({field: {value, onChange}}) => (
                                    <Input
                                        type="file"
                                        accept=".pdf"
                                        name="pdf"
                                        id="pdf"
                                        onChange={e => {
                                            onChange(e.target.files[0])
                                        }}
                                        className={errors?.pdf && 'is-invalid'}
                                    />
                                )}/>
                    {FormHelper.generateFormFeedback(errors, 'pdf')}
                </div>
                <div className="mb-3">
                    <Label for="note">Qeyd</Label>
                    <Controller name="note" control={control}
                                render={({field: {value, onChange}}) => (
                                    <Input
                                        type="textarea"
                                        rows={4}
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
