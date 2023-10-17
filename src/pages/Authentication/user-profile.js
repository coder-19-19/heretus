import React, {useState} from "react";
import {Button, Card, CardBody, Col, Container, Input, Label, Row, Spinner,} from "reactstrap";
import withRouter from "components/Common/withRouter";
import Breadcrumb from "../../components/Common/Breadcrumb";
import LocalStorageManager from "../../helpers/localStorageManager";
import User from "../../helpers/user";
import {Controller, useForm} from "react-hook-form";
import Form from "../../helpers/form";
import Auth from "../../api/auth";
import {toast} from "react-toastify";

const UserProfile = () => {
    const [file, setFile] = useState(null)
    const [loader, setLoader] = useState(false)
    const user = LocalStorageManager.get('user')
    document.title = `Profile | ${user?.name} ${user?.surname} | Xronika`;

    const {control, handleSubmit, formState: {errors}} = useForm({
        defaultValues: {
            ...user,
            newPassword: ''
        }
    })

    const update = async (values) => {
        setLoader(true)
        const formData = new FormData()
        formData.append('name', values.name)
        formData.append('surname', values.surname)
        formData.append('email', user?.email)
        formData.append('password', values.password)
        if (values.newPassword) {
            formData.append('newPassword', values.newPassword)
        }
        if (file) {
            formData.append('profile_image', file)
        }
        try {
            await Auth.update(formData)
            window.location.reload()
        } catch (e) {
            toast.error(e.response.data.message)
        } finally {
            setLoader(false)
        }
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumb breadcrumbItem="Profile"/>
                    <Row>
                        <Col lg="12">
                            <Card>
                                <CardBody>
                                    <div className="d-flex gap-2">
                                        <label htmlFor="profileImage" className="ms-3 cursor-pointer">
                                            {user?.profile_image || file ? (
                                                <img
                                                    src={file ? URL.createObjectURL(file) : Form.generateFileUrl(user?.profile_image)}
                                                    alt=""
                                                    className="avatar-md rounded-circle img-thumbnail"
                                                />
                                            ) : (
                                                <div className="avatar-md rounded-circle img-thumbnail">
                                                    {User.getFirstChars(user)}
                                                </div>
                                            )}
                                        </label>
                                        <input id="profileImage" onChange={e => setFile(e.target.files[0])} type="file"
                                               accept=".png,.jpeg,.jpg,.jfif" className="d-none"/>
                                        <div className="flex-grow-1 align-self-center">
                                            <div className="text-muted">
                                                <h5>{user?.name} {user?.surname}</h5>
                                                <p className="mb-1">{user?.email}</p>
                                                <p className="mb-0">Id no: #{user?.id}</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                    <h4 className="card-title mb-4">User info</h4>
                    <Card>
                        <CardBody>
                            <form
                                onSubmit={handleSubmit(update)}
                                className="form-horizontal"
                            >
                                <div className="form-group mb-3">
                                    <Label className="name">Name</Label>
                                    <Controller rules={{required: true}} render={({field: {value, onChange}}) => (
                                        <Input
                                            name="name"
                                            value={value}
                                            onChange={onChange}
                                            invalid={errors?.name}
                                        />
                                    )} name="name" control={control}/>
                                    {Form.generateFormFeedback(errors, 'name')}
                                </div>
                                <div className="form-group mb-3">
                                    <Label className="surname">Surname</Label>
                                    <Controller rules={{required: true}} render={({field: {value, onChange}}) => (
                                        <Input
                                            name="surname"
                                            value={value}
                                            onChange={onChange}
                                            invalid={errors?.surname}
                                        />
                                    )} name="surname" control={control}/>
                                    {Form.generateFormFeedback(errors, 'surname')}
                                </div>
                                <div className="form-group mb-3">
                                    <Label className="password">Currnet password</Label>
                                    <Controller rules={{required: true}} render={({field: {value, onChange}}) => (
                                        <Input
                                            name="password"
                                            value={value}
                                            onChange={onChange}
                                            invalid={errors?.password}
                                        />
                                    )} name="password" control={control}/>
                                    {Form.generateFormFeedback(errors, 'password')}
                                </div>
                                <div className="form-group mb-3">
                                    <Label className="newPassword">New password</Label>
                                    <Controller render={({field: {value, onChange}}) => (
                                        <Input
                                            name="newPassword"
                                            value={value}
                                            onChange={onChange}
                                            invalid={errors?.newPassword}
                                        />
                                    )} name="newPassword" control={control}/>
                                    {Form.generateFormFeedback(errors, 'newPassword')}
                                </div>
                                <div className="text-center mt-4">
                                    <Button type="submit" color="danger" disabled={loader}>
                                        {loader ? <Spinner size="sm" color="light"/> : 'Update'}
                                    </Button>
                                </div>
                            </form>
                        </CardBody>
                    </Card>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default withRouter(UserProfile);
