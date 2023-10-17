import PropTypes from "prop-types";
import React, {useState} from "react";
import {Card, CardBody, Col, Container, Form, Input, Label, Row, Spinner} from "reactstrap";
import {Link} from "react-router-dom";
import withRouter from "components/Common/withRouter";
import profile from "assets/images/profile-img.png";
import logo from "assets/images/logo.svg";
import {Controller, useForm} from "react-hook-form";
import FormHelper from "helpers/form"
import LocalStorageManager from "helpers/localStorageManager";
import Auth from "api/auth";
import ThreeSteps from '../../assets/images/sidebar/threesteps.jpg'

const Login = props => {
    const [loader, setLoader] = useState(false)
    document.title = "Giriş et";
    const {control, handleSubmit, setError, formState: {errors}} = useForm()
    const login = async (values) => {
        setLoader(true)
        try {
            const {data} = await Auth.login(values)
            localStorage.setItem('token', data?.token)
            LocalStorageManager.set('user', data?.user)
            props.router.navigate('/dashboard')
        } catch (e) {
            FormHelper.setApiErrors(e.response.data, setError)
        } finally {
            setLoader(false)
        }
    }

    return (
        <React.Fragment>
            <div className="account-pages my-5 pt-sm-5">
                <Container>
                    <Row className="justify-content-center">
                        <Col md={8} lg={6} xl={5}>
                            <Card className="overflow-hidden">
                                <img height="250px" style={{objectFit: 'cover'}} src={ThreeSteps} alt="ThreeSteps"/>
                                <CardBody className="pt-0">
                                    <div>
                                        <Link to="/" className="logo-light-element">
                                            <div className="avatar-md profile-user-wid mb-4">
                        <span className="avatar-title rounded-circle bg-light">
                        <img
                            src={logo}
                            alt=""
                            className="rounded-circle"
                            height="34"
                        />
                        </span>
                                            </div>
                                        </Link>
                                    </div>
                                    <div className="p-2">
                                        <Form
                                            autoComplete="off"
                                            className="form-horizontal"
                                            onSubmit={handleSubmit(login)}
                                        >
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
                                                        type="password"
                                                        autoComplete="off"
                                                        placeholder="Daxil edin"
                                                        onChange={onChange}
                                                        invalid={errors?.code}
                                                    />
                                                )} name="code" control={control}/>
                                                {FormHelper.generateFormFeedback(errors, 'code', errors?.code?.message)}
                                            </div>
                                            <div className="mt-3 d-grid">
                                                <button
                                                    disabled={loader}
                                                    className="btn btn-primary btn-block"
                                                    type="submit"
                                                >
                                                    {!loader ? 'Giriş et' : <Spinner size="sm" color="light"/>}
                                                </button>
                                            </div>
                                            {/*<div className="mt-4 text-center">*/}
                                            {/*  <Link to="/forgot-code" className="text-muted">*/}
                                            {/*    <i className="mdi mdi-lock me-1" />*/}
                                            {/*    Forgot your code?*/}
                                            {/*  </Link>*/}
                                            {/*</div>*/}
                                        </Form>
                                    </div>
                                </CardBody>
                                <div className="bg-primary bg-soft">
                                    <Row>
                                        <Col xs={7}>
                                            <div className="text-primary p-4">
                                                <h5 className="text-primary">Xoş gəlmisən !</h5>
                                                <p>Daxil ol</p>
                                            </div>
                                        </Col>
                                        <Col className="col-5 align-self-end">
                                            <img src={profile} alt="" className="img-fluid"/>
                                        </Col>
                                    </Row>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default withRouter(Login);

Login.propTypes = {
    history: PropTypes.object,
};
