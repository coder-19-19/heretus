import {AccordionBody, AccordionHeader, Badge, Button, ModalBody, ModalFooter, UncontrolledAccordion} from "reactstrap";
import moment from "moment";

const Detail = ({setActive, data}) => {
    return (
        <>
            <ModalBody>
                <UncontrolledAccordion>
                    <AccordionHeader targetId="doctor" className="bg-light border rounded-1 rounded-bottom-0">
                        <p className="fw-bold mb-0">Müayinədən gələn gəlirlər</p>
                    </AccordionHeader>
                    <AccordionBody accordionId="doctor">
                        <div className="table-responsive">
                            <table className="table table-bordered">
                                <thead>
                                <tr>
                                    <th>№</th>
                                    <th>Müştəri</th>
                                    <th>Nümayəndə</th>
                                    <th>Göndərən şəxs</th>
                                    <th>Xidmət</th>
                                    <th>Ödənilən məbləğ</th>
                                    <th>Ödənilməli olan məbləğ</th>
                                    <th>Tarix</th>
                                    <th>Qeyd</th>
                                </tr>
                                </thead>
                                <tbody>
                                {data?.data?.doctor_examinations?.map((item, index) => (
                                    <tr key={item.id}>
                                        <td>{index + 1}</td>
                                        <td>{item?.patient}</td>
                                        <td>{item?.doctor}</td>
                                        <td>{item?.worker}</td>
                                        <td>{item?.service} - {item?.payments_sum_amount} AZN</td>
                                        <td>
                                            <Badge color="success">
                                                {item?.payments_sum_doctor_paid}
                                            </Badge>
                                        </td>
                                        <td>
                                            <Badge color="danger">
                                                {item?.payments_sum_doctor_taken}
                                            </Badge>
                                        </td>
                                        <td>{item?.admission_date && moment(item?.admission_date).format('DD.MM.YYYY')}</td>
                                        <td>{item?.note}</td>
                                    </tr>
                                ))}
                                <tr>
                                    <td/>
                                    <td/>
                                    <td/>
                                    <td/>
                                    <td/>
                                    <td>
                                        <Badge color="success">
                                            {data?.data?.doctor_examinations?.reduce((acc, val) => {
                                                return Number(acc) + Number(val?.payments_sum_doctor_paid)
                                            }, 0)}
                                        </Badge>
                                    </td>
                                    <td>
                                        <Badge color="danger">
                                            {data?.data?.doctor_examinations?.reduce((acc, val) => {
                                                return Number(acc) + Number(val?.payments_sum_doctor_taken)
                                            }, 0)}
                                        </Badge>
                                    </td>
                                    <td/>
                                    <td/>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </AccordionBody>
                </UncontrolledAccordion>
                <UncontrolledAccordion>
                    <AccordionHeader targetId="doctor" className="bg-light border rounded-1 rounded-top-0">
                        <p className="fw-bold mb-0">Göndərişdən gələn gəlirlər</p>
                    </AccordionHeader>
                    <AccordionBody accordionId="doctor">
                        <div className="table-responsive">
                            <table className="table table-bordered">
                                <thead>
                                <tr>
                                    <th>№</th>
                                    <th>Müştəri</th>
                                    <th>Nümayəndə</th>
                                    <th>Göndərən şəxs</th>
                                    <th>Xidmət</th>
                                    <th>Ödənilən məbləğ</th>
                                    <th>Ödənilməli olan məbləğ</th>
                                    <th>Tarix</th>
                                    <th>Qeyd</th>
                                </tr>
                                </thead>
                                <tbody>
                                {data?.data?.worker_examinations?.map((item, index) => (
                                    <tr key={item.id}>
                                        <td>{index + 1}</td>
                                        <td>{item?.patient}</td>
                                        <td>{item?.doctor}</td>
                                        <td>{item?.worker}</td>
                                        <td>{item?.service} - {item?.payments_sum_amount} AZN</td>
                                        <td>
                                            <Badge color="success">
                                                {item?.payments_sum_worker_paid}
                                            </Badge>
                                        </td>
                                        <td>
                                            <Badge color="danger">
                                                {item?.payments_sum_worker_taken}
                                            </Badge>
                                        </td>
                                        <td>{item?.admission_date && moment(item?.admission_date).format('DD.MM.YYYY')}</td>
                                        <td>{item?.note}</td>
                                    </tr>
                                ))}
                                <tr>
                                    <td/>
                                    <td/>
                                    <td/>
                                    <td/>
                                    <td/>
                                    <td>
                                        <Badge color="success">
                                            {data?.data?.worker_examinations?.reduce((acc, val) => {
                                                return Number(acc) + Number(val?.payments_sum_worker_paid)
                                            }, 0)}
                                        </Badge>
                                    </td>
                                    <td>
                                        <Badge color="danger">
                                            {data?.data?.worker_examinations?.reduce((acc, val) => {
                                                return Number(acc) + Number(val?.payments_sum_worker_taken)
                                            }, 0)}
                                        </Badge>
                                    </td>
                                    <td/>
                                    <td/>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </AccordionBody>
                </UncontrolledAccordion>
            </ModalBody>
            <ModalFooter>
                <div className="d-flex justify-content-end gap-1">
                    <Button outline type="button" onClick={() => setActive({})} color="secondary">Bağla</Button>
                </div>
            </ModalFooter>
        </>
    )
}

export default Detail
