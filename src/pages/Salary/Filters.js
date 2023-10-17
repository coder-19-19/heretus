import {Button, Card, CardBody, Col, Label, Row, Spinner, UncontrolledTooltip} from "reactstrap";
import {Controller} from "react-hook-form";
import Select from "react-select";
import FlatPicker from "react-flatpickr";
import {useEffect, useState} from "react";
import Employees from "../../api/employees";

const Filters = ({form, fetchData, defaultValues}) => {
    const [loader, setLoader] = useState(false)
    const [workers, setWorkers] = useState([])

    const fetchWorkers = async () => {
        const {data} = await Employees.getSelect()
        setWorkers(data)
    }

    const submit = async () => {
        setLoader(true)
        await fetchData(true, 1)
        setLoader(false)
    }

    useEffect(() => {
        fetchWorkers()
    }, [])

    return (
        <Card>
            <CardBody>
                <form onSubmit={form.handleSubmit(submit)}>
                    <Row>
                        <Col sm={12} md={4}>
                            <div className="mb-3">
                                <Label for="worker_id">İşçilər</Label>
                                <Controller defaultValue="" name="worker_id"
                                            control={form.control}
                                            render={({field: {value, onChange}}) => (
                                                <Select
                                                    isClearable
                                                    options={workers}
                                                    placeholder=""
                                                    onChange={onChange}
                                                    value={value}
                                                    name="worker_id"
                                                    id="worker_id"/>
                                            )}/>
                            </div>
                        </Col>
                        <Col sm={12} md={4}>
                            <div className="mb-3 w-100">
                                <Label for="start_date">Başlama tarixi</Label>
                                <Controller name="start_date"
                                            control={form.control}
                                            render={({field: {value, onChange}}) => (
                                                <FlatPicker
                                                    className="form-control d-block"
                                                    value={value}
                                                    onChange={onChange}
                                                    options={{
                                                        locale: 'az'
                                                    }}
                                                />
                                            )}/>
                            </div>
                        </Col>
                        <Col sm={12} md={4}>
                            <div className="mb-3 w-100">
                                <Label for="end_date">Bitmə tarixi</Label>
                                <Controller name="end_date"
                                            control={form.control}
                                            render={({field: {value, onChange}}) => (
                                                <FlatPicker
                                                    className="form-control d-block"
                                                    value={value}
                                                    onChange={onChange}
                                                    options={{
                                                        locale: 'az'
                                                    }}
                                                />
                                            )}/>
                            </div>
                        </Col>
                        <Col sm={12}>
                            <div className="d-flex justify-content-end">
                                <div className="d-flex gap-2">
                                    <Button id="reset-patient-btn" outline color="primary"
                                            onClick={() => {
                                                form.reset(defaultValues)
                                                fetchData(true, 1)
                                            }}>
                                        <i className="bx bx-rotate-right"/>
                                    </Button>
                                    <UncontrolledTooltip placement="bottom"
                                                         target="reset-patient-btn">
                                        Sıfırla
                                    </UncontrolledTooltip>
                                    <Button color="primary" disabled={loader}>
                                        {loader ?
                                            <Spinner size="sm" color="light"/> : 'Axtar'}
                                    </Button>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </form>
            </CardBody>
        </Card>
    )
}

export default Filters
