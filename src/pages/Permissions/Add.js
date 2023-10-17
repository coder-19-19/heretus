import {Controller, useForm} from "react-hook-form";
import {
    AccordionBody,
    AccordionHeader,
    Button,
    Input,
    Label,
    ModalBody,
    ModalFooter,
    Spinner,
    UncontrolledAccordion
} from "reactstrap";
import FormHelper from "../../helpers/form";
import {useEffect, useState} from "react";
import Api from 'api/permission'

const Add = ({fetchData, form, setForm}) => {
    const {control, handleSubmit, setValue, setError, watch, formState: {errors}} = useForm()
    const [loader, setLoader] = useState(false)
    const [actions, setActions] = useState([])
    const [selectedActions, setSelectedActions] = useState({})
    const [isFetching, setIsFetching] = useState(true)
    const data = form?.data

    const submit = async values => {
        setLoader(true)
        try {
            await Api.add({
                ...values,
                id: values?.id || null,
                actions: values?.actions?.map((item, index) => {
                    return {
                        index,
                        value: item || false
                    }
                }).slice(1)
            })
            fetchData()
            setForm({})
            if (values?.id) {
                window.location.reload()
            }
        } catch (e) {
            FormHelper.setApiErrors(e.response.data, setError)
        } finally {
            setLoader(false)
        }
    }

    const fetchActions = async () => {
        setIsFetching(true)
        const {data} = await Api.getActions()
        setActions(data)
        setIsFetching(false)
    }

    const fetchPermission = async () => {
        setIsFetching(true)
        const res = await Api.getById(data?.id)
        res?.data?.forEach(item => {
            item?.actions?.forEach(action => {
                setValue(`actions.${action?.index}`, action?.value)
            })
        })
        setIsFetching(false)
    }

    useEffect(() => {
        fetchActions().then(() => {
            if (data?.id) {
                setValue('id', data?.id)
                setValue('name', data?.name)
                fetchPermission()
            }
        })
    }, [form])

    return (
        <form onSubmit={handleSubmit(submit)}>
            <ModalBody>
                <div className="mb-3">
                    <label htmlFor="">Səlahiyyətin adı</label>
                    <Controller rules={{required: true}} render={({field: {value, onChange}}) => (
                        <Input className={errors?.name && 'is-invalid'} value={value} onChange={onChange}/>
                    )} control={control} name="name"/>
                    {FormHelper.generateFormFeedback(errors, 'name')}
                </div>
                {isFetching ? (
                    <div className="d-flex justify-content-center">
                        <Spinner color="primary"/>
                    </div>
                ) : actions?.map(item => (
                    <UncontrolledAccordion key={item.key}>
                        <AccordionHeader targetId={item.key}>{item.displayName}</AccordionHeader>
                        <AccordionBody accordionId={item.key}>
                            {item?.actions?.map(action => (
                                <Label className="d-flex gap-1" key={action.index}>
                                    <div className="form-check">
                                        <Controller render={({field: {value, onChange}}) => (
                                            <>
                                                <input type="checkbox"
                                                       checked={value}
                                                       onChange={onChange}
                                                       className="form-check-input"/>
                                            </>
                                        )} name={`actions.${action.index}`} control={control}/>
                                    </div>
                                    {action.displayName}
                                </Label>
                            ))}
                        </AccordionBody>
                    </UncontrolledAccordion>
                ))}
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
