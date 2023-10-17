import {Controller, useFieldArray, useForm} from "react-hook-form";
import {Button, Col, Input, Label, ModalBody, ModalFooter, Row, Spinner} from "reactstrap";
import FormHelper from "../../helpers/form";
import {useEffect, useState} from "react";
import Doctors from "../../api/employees";
import Positions from "../../api/positions";
import Select from "react-select";
import Branches from "../../api/branches";
import Permission from "../../api/permission";
import LocalStorageManager from "../../helpers/localStorageManager";

const Add = ({fetchData, form, setForm}) => {
    const {control, handleSubmit, reset, setError, formState: {errors}} = useForm()
    const percentArr = useFieldArray({
        control,
        name: 'profit_percents'
    })

    const otherPercents = useFieldArray({
        control,
        name: 'other_profit_percents'
    })

    const [loader, setLoader] = useState(false)
    const [isFetching, setIsFetching] = useState(false)
    const [positions, setPositions] = useState([])
    const [services, setServices] = useState([])
    const [serviceValue, setServiceValue] = useState('')
    const [percentValue, setPercentValue] = useState('')
    const [otherPercent, setOtherPercents] = useState({service_id: ''})
    const [roles, setRoles] = useState([])
    const [searchValue, setSearchValue] = useState('')
    const data = form?.data
    const submit = async values => {
        setLoader(true)
        try {
            await Doctors[values?.id ? 'update' : 'add']({
                ...FormHelper.validateBody(values),
                mobile_phone: String(values?.mobile_phone),
                fin_code: String(values?.fin_code),
                profit_percents: values?.profit_percents?.every(item => item.service_id && item.percent) ? values?.profit_percents : [],
                other_profit_percents: values?.other_profit_percents?.every(item => item.service_id && item.percent) ? values?.other_profit_percents : []
            })
            fetchData()
            setForm({})
            if (values?.id == LocalStorageManager.get('user')?.id) {
                window.location.reload()
            }
        } catch (e) {
            FormHelper.setApiErrors(e.response.data, setError)
        } finally {
            setLoader(false)
        }
    }

    const fetchPositions = async () => {
        const {data} = await Positions.getSelect()
        setPositions(data)
    }

    const fetchMissions = async () => {
        const {data} = await Branches.getSelect()
        setServices(data)
    }

    const fetchRoles = async () => {
        const {data} = await Permission.selectList()
        setRoles(data)
    }

    const fetchById = async () => {
        setIsFetching(true)
        const res = await Doctors.getById(data?.id)
        reset({
            ...res?.data?.worker,
            position_id: positions?.find(item => item?.value == res?.data?.worker?.position_id),
            role_id: roles?.find(item => item?.value == res?.data?.worker?.role_id)
        })
        setIsFetching(false)
    }

    useEffect(() => {
        fetchPositions()
        fetchMissions()
        fetchRoles()
    }, [])

    useEffect(() => {
        if (data && positions?.length && roles?.length) {
            fetchById()
        }
    }, [form, positions, roles])

    return (
        <form onSubmit={handleSubmit(submit)}>
            <ModalBody>
                {isFetching ? <div className="d-flex justify-content-center">
                    <Spinner size="lg" color="primary"/>
                </div> : (
                    <Row>
                        <Col sm={12} md={3}>
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
                                <Label for="surname">Soyad</Label>
                                <Controller rules={{required: true}} name="surname" control={control}
                                            render={({field: {value, onChange}}) => (
                                                <Input
                                                    name="surname"
                                                    id="surname"
                                                    value={value}
                                                    onChange={onChange}
                                                    className={errors?.surname && 'is-invalid'}
                                                />
                                            )}/>
                                {FormHelper.generateFormFeedback(errors, 'surname')}
                            </div>
                            <div className="mb-3">
                                <Label for="father_name">Ata adı</Label>
                                <Controller name="father_name" rules={{required: true}} control={control}
                                            render={({field: {value, onChange}}) => (
                                                <Input
                                                    name="father_name"
                                                    id="father_name"
                                                    value={value}
                                                    onChange={onChange}
                                                    className={errors?.father_name && 'is-invalid'}
                                                />
                                            )}/>
                                {FormHelper.generateFormFeedback(errors, 'father_name')}
                            </div>
                            {!data && (
                                <div className="mb-3">
                                    <Label className="form-label">Kod</Label>
                                    <Controller rules={{
                                        required: true,
                                        maxLength: {
                                            value: 4,
                                            message: 'Maksimum 4 simovaldan ibarət olmalıdır'
                                        },
                                        minLength: {
                                            value: 4,
                                            message: 'Minimum 4 simovaldan ibarət olmalıdır'
                                        }
                                    }} render={({field: {value, onChange}}) => (
                                        <Input
                                            name="code"
                                            value={value}
                                            disabled={data}
                                            type="text"
                                            onChange={onChange}
                                            invalid={errors?.code}
                                        />
                                    )} name="code" control={control}/>
                                    {FormHelper.generateFormFeedback(errors, 'code', errors?.code?.message)}
                                </div>
                            )}
                            <div className="mb-3">
                                <Label for="position_id">Vəzifə</Label>
                                <Controller rules={{required: true}} name="position_id"
                                            control={control}
                                            render={({field: {value, onChange}}) => (
                                                <Select
                                                    options={positions}
                                                    placeholder=""
                                                    className={`w-100 ${errors?.position_id && 'is-invalid'}`}
                                                    onChange={onChange}
                                                    value={value}
                                                    name="position_id"
                                                    id="position_id"/>
                                            )}/>
                                {FormHelper.generateFormFeedback(errors, 'position_id')}
                            </div>
                            <div className="mb-3">
                                <Label for="role_id">Səlahiyyət</Label>
                                <Controller rules={{required: true}} name="role_id"
                                            control={control}
                                            render={({field: {value, onChange}}) => (
                                                <Select
                                                    options={roles}
                                                    placeholder=""
                                                    className={`w-100 ${errors?.role_id && 'is-invalid'}`}
                                                    onChange={onChange}
                                                    value={value}
                                                    name="role_id"
                                                    id="role_id"/>
                                            )}/>
                                {FormHelper.generateFormFeedback(errors, 'role_id')}
                            </div>
                        </Col>
                        <Col sm={12} md={3}>
                            <div className="mb-3">
                                <Label for="mobile_phone">Mobil nömrə</Label>
                                <Controller name="mobile_phone" rules={{required: true}} control={control}
                                            render={({field: {value, onChange}}) => (
                                                <Input
                                                    type="number"
                                                    name="mobile_phone"
                                                    id="mobile_phone"
                                                    value={value}
                                                    onChange={onChange}
                                                    className={errors?.mobile_phone && 'is-invalid'}
                                                />
                                            )}/>
                                {FormHelper.generateFormFeedback(errors, 'mobile_phone')}
                            </div>
                            <div className="mb-3">
                                <Label for="fin_code">FİN kod</Label>
                                <Controller rules={{
                                    pattern: /^[\w-_.]*$/,
                                    minLength: {
                                        value: 7,
                                        message: 'FİN 7 simvoldan ibarət olmalıdır',
                                    },
                                    maxLength: {
                                        value: 7,
                                        message: 'FİN 7 simvoldan ibarət olmalıdır',
                                    },
                                }} name="fin_code" control={control}
                                            render={({field: {value, onChange}}) => (
                                                <Input
                                                    name="fin_code"
                                                    id="fin_code"
                                                    value={value?.toUpperCase()}
                                                    onChange={onChange}
                                                    className={errors?.fin_code && 'is-invalid'}
                                                />
                                            )}/>
                                {FormHelper.generateFormFeedback(errors, 'fin_code')}
                            </div>
                            <div className="mb-3">
                                <Label for="current_workplace">Hazırda işlədiyi yer</Label>
                                <Controller name="current_workplace" control={control}
                                            render={({field: {value, onChange}}) => (
                                                <Input
                                                    name="current_workplace"
                                                    id="current_workplace"
                                                    value={value}
                                                    onChange={onChange}
                                                    className={errors?.current_workplace && 'is-invalid'}
                                                />
                                            )}/>
                                {FormHelper.generateFormFeedback(errors, 'current_workplace')}
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
                        <Col sm={12} md={3}>
                            <Label>Müştəri qəbulundan verilən faiz</Label>
                            <div style={{maxHeight: '400px', overflow: 'auto'}}>
                                <div className="mb-3">
                                    <div className="mb-2">
                                        <div className="d-flex gap-2 w-100">
                                            <div className="w-100">
                                                <select value={serviceValue}
                                                        onChange={e => setServiceValue(e.target.value)}
                                                        className="form-control">
                                                    <option value="" disabled>Şöbə</option>
                                                    {services?.filter(d => !percentArr.fields.map(p => Number(p?.service_id)).includes(d?.value)).map(item => (
                                                        <option
                                                            value={item.value}
                                                            key={item.value}>{item.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <Button disabled={!serviceValue || !percentValue} onClick={() => {
                                                percentArr.append({
                                                    service_id: serviceValue,
                                                    percent: percentValue
                                                })
                                                setPercentValue('')
                                                setServiceValue('')
                                            }} color="primary" type="button"><i
                                                className={`bx bx-plus`}/></Button>
                                        </div>
                                    </div>
                                    <div>
                                        <Input
                                            onChange={e => {
                                                const val = e.target.value
                                                if (val <= 100) {
                                                    setPercentValue(val)
                                                }
                                            }}
                                            type="number"
                                            max={100}
                                            value={percentValue}
                                            placeholder="Faiz"
                                        />
                                    </div>
                                </div>
                            </div>
                            {percentArr.fields?.length > 0 && (
                                <div style={{maxHeight: '400px', overflow: 'auto'}}>
                                    <div className="table-responsive w-100">
                                        <table className="table table-bordered w-100">
                                            <thead>
                                            <tr>
                                                <th>Şöbə</th>
                                                <th>Faiz</th>
                                                <th/>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {percentArr.fields.map((item, index) => (
                                                <tr key={item.id}>
                                                    <td>{services.find(data => data?.value == item?.service_id)?.label}</td>
                                                    <td>{item?.percent}</td>
                                                    <td>
                                                        <Button size="sm" onClick={() => {
                                                            percentArr.remove(index)
                                                        }} color="danger" type="button"><i
                                                            className={`bx bx-minus`}/></Button>
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </Col>
                        <Col sm={12} md={3}>
                            <Label>Müştəri göndərişindən verilən faiz</Label>
                            <div style={{maxHeight: '400px', overflow: 'auto'}}>
                                <div className="mb-3">
                                    <div className="mb-2">
                                        <div className="d-flex gap-2 w-100">
                                            <div className="w-100">
                                                <select value={otherPercent?.service_id}
                                                        onChange={e => setOtherPercents(prevState => ({
                                                            ...prevState,
                                                            service_id: e.target.value
                                                        }))}
                                                        className="form-control">
                                                    <option value="" disabled>Şöbə</option>
                                                    {services?.filter(d => !otherPercents.fields.map(p => Number(p?.service_id)).includes(d?.value)).map(item => (
                                                        <option
                                                            value={item.value}
                                                            key={item.value}>{item.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <Button disabled={!otherPercent?.service_id || !otherPercent?.percent}
                                                    onClick={() => {
                                                        otherPercents.append(otherPercent)
                                                        setOtherPercents({
                                                            service_id: '',
                                                            percent: ''
                                                        })
                                                    }} color="primary" type="button"><i
                                                className={`bx bx-plus`}/></Button>
                                        </div>
                                    </div>
                                    <div>
                                        <Input
                                            onChange={e => {
                                                const val = e.target.value
                                                if (val <= 100) {
                                                    setOtherPercents(prevState => ({
                                                        ...prevState,
                                                        percent: e.target.value
                                                    }))
                                                }
                                            }}
                                            type="number"
                                            max={100}
                                            value={otherPercent?.percent}
                                            placeholder="Faiz"
                                        />
                                    </div>
                                </div>
                            </div>
                            {otherPercents.fields?.length > 0 && (
                                <div style={{maxHeight: '400px', overflow: 'auto'}}>
                                    <div className="table-responsive w-100">
                                        <table className="table table-bordered w-100">
                                            <thead>
                                            <tr>
                                                <th>Şöbə</th>
                                                <th>Faiz</th>
                                                <th/>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {otherPercents.fields.map((item, index) => (
                                                <tr key={item.id}>
                                                    <td>{services.find(data => data?.value == item?.service_id)?.label}</td>
                                                    <td>{item?.percent}</td>
                                                    <td>
                                                        <Button size="sm" onClick={() => {
                                                            otherPercents.remove(index)
                                                        }} color="danger" type="button"><i
                                                            className={`bx bx-minus`}/></Button>
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </Col>
                    </Row>
                )}
            </ModalBody>
            <ModalFooter>
                <div className="d-flex justify-content-end gap-1">
                    <Button outline type="button" onClick={() => setForm({})} color="secondary">Bağla</Button>
                    <Button disabled={loader || isFetching} type="submit" color="primary">
                        {loader ? <Spinner color="light" size="sm"/> : 'Yadda saxla'}
                    </Button>
                </div>
            </ModalFooter>
        </form>
    )
}

export default Add
