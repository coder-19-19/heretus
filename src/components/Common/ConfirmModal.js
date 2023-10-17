import {Button, Modal, ModalBody, ModalFooter, ModalHeader, Spinner} from "reactstrap";
import {useState} from "react";
import {toast} from "react-toastify";

const ConfirmModal = ({active, setActive, callback}) => {
    const [loader, setLoader] = useState(false)

    const handleClick = async () => {
        setLoader(true)
        try {
            await callback()
            setActive(false)
        } catch (e) {
            setLoader(false)
            toast.error('Xəta baş verdi')
        }
        setLoader(false)
    }

    return (
        <Modal isOpen={active} toggle={() => setActive(false)}>
            <ModalHeader toggle={() => setActive(false)}>Əminsiniz?</ModalHeader>
            <ModalBody>
                <p>Seçilmiş məlumat bir dəfəlik silinəcək</p>
            </ModalBody>
            <ModalFooter>
                <div className="d-flex justify-content-end gap-1">
                    <Button type="button" onClick={() => setActive(false)} color="secondary">Bağla</Button>
                    <Button onClick={handleClick} disabled={loader} type="submit" color="danger">
                        {loader ? <Spinner color="light" size="sm"/> : 'Sil'}
                    </Button>
                </div>
            </ModalFooter>
        </Modal>
    )
}

export default ConfirmModal
