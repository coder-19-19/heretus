import React from "react"
import {Col, Container, Row} from "reactstrap"

const Footer = () => {
    return (
        <React.Fragment>
            <footer className="footer">
                <Container fluid={true}>
                    <Row>
                        <Col md={12}>{new Date().getFullYear()} © <a href="https://3steps.az">ThreeSteps</a>.</Col>
                    </Row>
                </Container>
            </footer>
        </React.Fragment>
    )
}

export default Footer
