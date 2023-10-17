import React from "react"
import {Col, Container, Row} from "reactstrap"

const Footer = () => {
    return (
        <React.Fragment>
            <footer className="footer">
                <Container fluid={true}>
                    <Row>
                        <Col md={12}>{new Date().getFullYear()} © <a target="_blank"
                                                                     href="https://threesteps.az">ThreeSteps
                            MMC</a></Col>
                    </Row>
                </Container>
            </footer>
        </React.Fragment>
    )
}

export default Footer
