import {Controller, useForm} from "react-hook-form";
import {Button, Input, Label, ModalBody, ModalFooter, Spinner} from "reactstrap";
import FormHelper from "../../helpers/form";
import {useState} from "react";
import Api from 'api/outside-work'

const Add = ({fetchData, form, setForm}) => {
    const {control, watch, handleSubmit, setValue, setError, formState: {errors}} = useForm()
    const [loader, setLoader] = useState(false)


    const submit = async values => {
        setLoader(true)
        try {
            const formData = new FormData()
            formData.append('file', values?.file)
            formData.append('expense', values?.expense)
            formData.append('income', values?.income)
            formData.append('benefit', values?.benefit)
            formData.append('note', values?.note)
            await Api.add(formData)
            fetchData()
            setForm({})
        } catch (e) {
            FormHelper.setApiErrors(e.response.data, setError)
        } finally {
            setLoader(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(submit)}>
            <ModalBody>
                <div className="mb-3">
                    <Label for="file">Fayl</Label>
                    <Controller rules={{required: true}} name="file" control={control}
                                render={({field: {value, onChange}}) => (
                                    <Input
                                        type="file"
                                        name="file"
                                        id="file"
                                        onChange={e => {
                                            onChange(e.target.files[0])
                                        }}
                                        className={errors?.file && 'is-invalid'}
                                    />
                                )}/>
                    {FormHelper.generateFormFeedback(errors, 'file')}
                </div>
                <div className="mb-3">
                    <Label for="income">Mədaxil</Label>
                    <Controller rules={{required: true}} name="income" control={control}
                                render={({field: {value, onChange}}) => (
                                    <Input
                                        type="number"
                                        name="income"
                                        id="income"
                                        value={value}
                                        onChange={e => {
                                            onChange(e)
                                            setValue('benefit', e.target.value - watch('expense'))
                                        }}
                                        className={errors?.income && 'is-invalid'}
                                    />
                                )}/>
                    {FormHelper.generateFormFeedback(errors, 'income')}
                </div>
                <div className="mb-3">
                    <Label for="expense">Məxaric</Label>
                    <Controller rules={{required: true}} name="expense" control={control}
                                render={({field: {value, onChange}}) => (
                                    <Input
                                        type="number"
                                        name="expense"
                                        id="expense"
                                        value={value}
                                        onChange={e => {
                                            onChange(e)
                                            setValue('benefit', watch('income') - e.target.value)
                                        }}
                                        className={errors?.expense && 'is-invalid'}
                                    />
                                )}/>
                    {FormHelper.generateFormFeedback(errors, 'expense')}
                </div>
                <div className="mb-3">
                    <Label for="benefit">Mənfəət</Label>
                    <Controller rules={{required: true}} name="benefit" control={control}
                                render={({field: {value, onChange}}) => (
                                    <Input
                                        type="number"
                                        name="benefit"
                                        id="benefit"
                                        value={value}
                                        onChange={onChange}
                                        className={errors?.benefit && 'is-invalid'}
                                    />
                                )}/>
                    {FormHelper.generateFormFeedback(errors, 'benefit')}
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
