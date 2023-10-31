import React, {useState} from "react";
import {Card, CardBody, Col, Container, Form, Input, Label, Row, Spinner} from "reactstrap";
import {Link, useNavigate} from "react-router-dom";
import profileImg from "../../assets/images/profile-img.png";
import logoImg from "../../assets/images/logo.svg";
import {Controller, useForm} from "react-hook-form";
import FormHelper from "helpers/form"
import Auth from "api/auth";

const Register = () => {
    const [loader, setLoader] = useState(false)
    const navigate = useNavigate()
    document.title = "Register | Xronika";
    const {control, handleSubmit, setError, formState: {errors}} = useForm()
    const register = async (values) => {
        setLoader(true)
        try {
            await Auth.register(values)
            navigate('/login')
        } catch (e) {
            FormHelper.setApiErrors(e.response.data, setError)
        } finally {
            setLoader(false)
        }
    }

    return (
        <React.Fragment>
            <div className="home-btn d-none d-sm-block">
                <Link to="/" className="text-dark">
                    <i className="bx bx-home h2"/>
                </Link>
            </div>
            <div className="account-pages my-5 pt-sm-5">
                <Container>
                    <Row className="justify-content-center">
                        <Col md={8} lg={6} xl={5}>
                            <Card className="overflow-hidden">
                                <div className="bg-primary bg-soft">
                                    <Row>
                                        <Col className="col-7">
                                            <div className="text-primary p-4">
                                                <h5 className="text-primary">Register</h5>
                                                <p>Get your Xronika account now.</p>
                                            </div>
                                        </Col>
                                        <Col className="col-5 align-self-end">
                                            <img src={profileImg} alt="" className="img-fluid"/>
                                        </Col>
                                    </Row>
                                </div>
                                <CardBody className="pt-0">
                                    <div>
                                        <Link to="/">
                                            <div className="avatar-md profile-user-wid mb-4">
                        <span className="avatar-title rounded-circle bg-light">
                          <img
                              src={logoImg}
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
                                            className="form-horizontal"
                                            onSubmit={handleSubmit(register)}
                                        >
                                            <div className="mb-3">
                                                <Label className="form-label">Name</Label>
                                                <Controller rules={{
                                                    required: true
                                                }} render={({field: {value, onChange}}) => (
                                                    <Input
                                                        name="name"
                                                        className="form-control"
                                                        placeholder="Enter name"
                                                        type="text"
                                                        onChange={onChange}
                                                        value={value}
                                                        invalid={errors?.name}
                                                    />
                                                )} name="name" control={control}/>
                                                {FormHelper.generateFormFeedback(errors, 'name', errors?.name?.message)}
                                            </div>
                                            <div className="mb-3">
                                                <Label className="form-label">Surname</Label>
                                                <Controller rules={{
                                                    required: true
                                                }} render={({field: {value, onChange}}) => (
                                                    <Input
                                                        name="surname"
                                                        className="form-control"
                                                        placeholder="Enter surname"
                                                        type="text"
                                                        onChange={onChange}
                                                        value={value}
                                                        invalid={errors?.surname}
                                                    />
                                                )} name="surname" control={control}/>
                                                {FormHelper.generateFormFeedback(errors, 'surname', errors?.surname?.message)}
                                            </div>
                                            <div className="mb-3">
                                                <Label className="form-label">Email</Label>
                                                <Controller rules={{
                                                    required: true
                                                }} render={({field: {value, onChange}}) => (
                                                    <Input
                                                        name="email"
                                                        className="form-control"
                                                        placeholder="Enter email"
                                                        type="email"
                                                        onChange={onChange}
                                                        value={value}
                                                        invalid={errors?.email}
                                                    />
                                                )} name="email" control={control}/>
                                                {FormHelper.generateFormFeedback(errors, 'email', errors?.email?.message)}
                                            </div>
                                            <div className="mb-3">
                                                <Label className="form-label">Password</Label>
                                                <Controller rules={{
                                                    required: true
                                                }} render={({field: {value, onChange}}) => (
                                                    <Input
                                                        name="password"
                                                        className="form-control"
                                                        placeholder="Enter password"
                                                        type="password"
                                                        onChange={onChange}
                                                        value={value}
                                                        invalid={errors?.password}
                                                    />
                                                )} name="password" control={control}/>
                                                {FormHelper.generateFormFeedback(errors, 'password', errors?.password?.message)}
                                            </div>
                                            <div className="mt-3 d-grid">
                                                <button
                                                    disabled={loader}
                                                    className="btn btn-primary btn-block"
                                                    type="submit"
                                                >
                                                    {!loader ? 'Register' : <Spinner size="sm" color="light"/>}
                                                </button>
                                            </div>
                                        </Form>
                                    </div>
                                </CardBody>
                            </Card>
                            <div className="mt-5 text-center">
                                <p>
                                    Already have an account ?{" "}
                                    <Link to="/login" className="font-weight-medium text-primary">
                                        {" "}
                                        Login
                                    </Link>{" "}
                                </p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default Register;
