import {Card, CardBody, Col, Row} from "reactstrap";
import Logo from '../../assets/images/sidebar/threesteps.jpg'
import Medilife from '../../assets/images/sidebar/logo.png'

const Dashboard = () => {
    return (
        <div className="page-content">
            <div className="container-fluid">
                <Row>
                    <Col sm={12} md={6}>
                        <Card>
                            <CardBody>
                                <a target="_blank" href="https://threesteps.az">
                                    <img width="100%" style={{objectFit: 'contain'}} height="200px" src={Logo}
                                         alt="Three Steps"/>
                                </a>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col sm={12} md={6}>
                        <Card>
                            <CardBody>
                                <a href="#" style={{fontSize:'36px'}} className="d-flex justify-content-center">
                                    {process.env.REACT_APP_COMPANY_NAME}
                                </a>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default Dashboard
