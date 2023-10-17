import {Button, Input, Label, ModalBody, ModalFooter, Spinner} from "reactstrap";
import {useEffect, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import FormHelper from "../../helpers/form";
import Salary from "../../api/salary";
import moment from "moment";

const Pay = ({form, setForm, fetchData}) => {
    const data = form?.data
    const [amount, setAmount] = useState(0)
    const {setValue, control, handleSubmit, setError, formState: {errors}} = useForm()
    const [loader, setLoader] = useState(false)
    const submit = async values => {
        setLoader(true)
        try {
            await Salary.pay({
                ...values,
                start_date: moment(values?.start_date).format('YYYY-MM-DD'),
                end_date: moment(values?.end_date).format('YYYY-MM-DD')
            })
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
            const am = (data?.doctor_examination_price + data?.worker_examination_price) - (data?.doctor_examination_paid_price + data?.worker_examination_paid_price)
            setAmount(am)
            setValue('user_id', data?.id)
            setValue('start_date', data?.start_date)
            setValue('end_date', data?.end_date)
            setValue('ids', data?.examinationIdsForNotPaidSalary)
            setValue('amount', am)
        }
    }, [data])
    return (
        <form onSubmit={handleSubmit(submit)} action="">
            <ModalBody>
                <div className="mb-3">
                    <Label for="amount">Məbləğ</Label>
                    <Controller rules={
                        {
                            required: true,
                            max: {
                                value: amount,
                                message: `Ödəniş ${amount} manatdan çox ola bilməz`
                            }
                        }} name="amount" control={control}
                                render={({field: {value, onChange}}) => (
                                    <Input
                                        name="amount"
                                        id="amount"
                                        value={value}
                                        onChange={onChange}
                                        className={errors?.amount && 'is-invalid'}
                                    />
                                )}/>
                    {FormHelper.generateFormFeedback(errors, 'amount')}
                </div>
            </ModalBody>
            <ModalFooter>
                <div className="d-flex justify-content-end gap-1">
                    <Button outline type="button" onClick={() => setForm({})} color="secondary">Bağla</Button>
                    <Button disabled={loader} type="submit" color="primary">
                        {loader ? <Spinner color="light" size="sm"/> : 'Ödə'}
                    </Button>
                </div>
            </ModalFooter>
        </form>
    )
}

export default Pay
