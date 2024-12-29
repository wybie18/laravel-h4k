import DangerButton from "@/Components/DangerButton";
import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import { router } from "@inertiajs/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { ThreeDots } from "react-loader-spinner";

export default function DeleteUserForm({modalOpen, closeModal, user}) {
    const [isDeleting, setIsDeleting] = useState(false);
    const deleteCandidate = (user) => {
        setIsDeleting(true);
        router.delete(route("user.destroy", user.id), {
            preserveScroll: true,
            onSuccess: () => {
                closeModal()
                setIsDeleting(false);
            },
            onFailure: () => {
                toast.error(`Failed to delete user "${user.name}"`)
                setIsDeleting(false);
            },
            onFinish: () => {
                closeModal()
                setIsDeleting(false);
            }
        })
    }
    return (
        <Modal show={modalOpen} onClose={closeModal}>
            <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900">
                    Are you sure you want to delete user "{user ? `${user.name}` : ""}"?
                </h2>

                <div className="mt-6 flex justify-end">
                    <SecondaryButton type="button" onClick={closeModal}>Cancel</SecondaryButton>

                    <DangerButton type="button" className="ms-3" onClick={e => deleteCandidate(user)} disabled={isDeleting}>
                        {isDeleting ? <ThreeDots
                            visible={true}
                            height="10"
                            width="40"
                            color="#D1D5DB"
                            radius="9"
                            ariaLabel="three-dots-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                        /> : "Delete"}
                    </DangerButton>
                </div>
            </div>
        </Modal>
    )
}