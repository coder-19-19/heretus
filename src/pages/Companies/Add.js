import {Controller, useForm} from "react-hook-form";
import {Button, Col, Input, Label, ModalBody, ModalFooter, Row, Spinner} from "reactstrap";
import FormHelper from "../../helpers/form";
import {useEffect, useState} from "react";
import Api from 'api/company'

const Add = ({fetchData, form, setForm}) => {
    const {control, handleSubmit, reset, setError, formState: {errors}} = useForm()
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
            reset(data)
        }
    }, [form])

    return (
        <form onSubmit={handleSubmit(submit)}>
            <ModalBody>
                <Row>
                    <Col sm={12} md={6}>
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
                            <Label for="voen">VÖEN</Label>
                            <Controller rules={{required: true}} name="voen" control={control}
                                        render={({field: {value, onChange}}) => (
                                            <Input
                                                name="voen"
                                                id="voen"
                                                value={value}
                                                onChange={onChange}
                                                className={errors?.voen && 'is-invalid'}
                                            />
                                        )}/>
                            {FormHelper.generateFormFeedback(errors, 'voen')}
                        </div>
                        <div className="mb-3">
                            <Label for="address">Ünvan</Label>
                            <Controller rules={{required: true}} name="address" control={control}
                                        render={({field: {value, onChange}}) => (
                                            <Input
                                                name="address"
                                                id="address"
                                                value={value}
                                                onChange={onChange}
                                                className={errors?.address && 'is-invalid'}
                                            />
                                        )}/>
                            {FormHelper.generateFormFeedback(errors, 'address')}
                        </div>
                        <div className="mb-3">
                            <Label for="email">Email</Label>
                            <Controller rules={{required: true}} name="email" control={control}
                                        render={({field: {value, onChange}}) => (
                                            <Input
                                                type="email"
                                                name="email"
                                                id="email"
                                                value={value}
                                                onChange={onChange}
                                                className={errors?.email && 'is-invalid'}
                                            />
                                        )}/>
                            {FormHelper.generateFormFeedback(errors, 'email')}
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
                    <Col sm={12} md={6}>
                        <div className="mb-3">
                            <Label for="bank_name">Bank adı</Label>
                            <Controller rules={{required: true}} name="bank_name" control={control}
                                        render={({field: {value, onChange}}) => (
                                            <Input
                                                name="bank_name"
                                                id="bank_name"
                                                value={value}
                                                onChange={onChange}
                                                className={errors?.bank_name && 'is-invalid'}
                                            />
                                        )}/>
                            {FormHelper.generateFormFeedback(errors, 'bank_name')}
                        </div>
                        <div className="mb-3">
                            <Label for="swift">S.W.I.F.T</Label>
                            <Controller rules={{required: true}} name="swift" control={control}
                                        render={({field: {value, onChange}}) => (
                                            <Input
                                                name="bank_name"
                                                id="swift"
                                                value={value}
                                                onChange={onChange}
                                                className={errors?.swift && 'is-invalid'}
                                            />
                                        )}/>
                            {FormHelper.generateFormFeedback(errors, 'swift')}
                        </div>
                        <div className="mb-3">
                            <Label for="bank_voen">Bankın VÖEN-i</Label>
                            <Controller rules={{required: true}} name="bank_voen" control={control}
                                        render={({field: {value, onChange}}) => (
                                            <Input
                                                name="bank_voen"
                                                id="bank_voen"
                                                value={value}
                                                onChange={onChange}
                                                className={errors?.bank_voen && 'is-invalid'}
                                            />
                                        )}/>
                            {FormHelper.generateFormFeedback(errors, 'bank_voen')}
                        </div>
                        <div className="mb-3">
                            <Label for="bank_account">Bankın müxbir hesabı</Label>
                            <Controller rules={{required: true}} name="bank_account" control={control}
                                        render={({field: {value, onChange}}) => (
                                            <Input
                                                name="bank_account"
                                                id="bank_account"
                                                value={value}
                                                onChange={onChange}
                                                className={errors?.bank_account && 'is-invalid'}
                                            />
                                        )}/>
                            {FormHelper.generateFormFeedback(errors, 'bank_account')}
                        </div>
                        <div className="mb-3">
                            <Label for="private_account">Şəxsi hesab</Label>
                            <Controller rules={{required: true}} name="private_account" control={control}
                                        render={({field: {value, onChange}}) => (
                                            <Input
                                                name="private_account"
                                                id="private_account"
                                                value={value}
                                                onChange={onChange}
                                                className={errors?.private_account && 'is-invalid'}
                                            />
                                        )}/>
                            {FormHelper.generateFormFeedback(errors, 'private_account')}
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
