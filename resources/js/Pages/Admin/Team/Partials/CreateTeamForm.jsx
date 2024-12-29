import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import TextInput from "@/Components/TextInput";
import { useForm } from "@inertiajs/react";
import toast from "react-hot-toast";
import { ThreeDots } from "react-loader-spinner";

export default function CreateTeamForm({ modalOpen, closeModal }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        description: '',
    });

    const handleErrors = (errors) => {
        if (errors) {
            let delay = 0;
            for (const key in errors) {
                if (errors.hasOwnProperty(key)) {
                    setTimeout(() => {
                        toast.error(errors[key]);
                    }, delay);
                }
                delay += 150;
            }
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();
        post(route("team.store"), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                closeModal();
            },
            onError: (errors) => handleErrors(errors),
        });
    };

    const handleOnClose = () => {
        reset();
        closeModal();
    }

    return (
        <Modal show={modalOpen} onClose={handleOnClose}>
            <form onSubmit={onSubmit} className="p-6">
                <h2 className="text-lg font-medium text-gray-900">
                    Add new team
                </h2>
                <>
                    <div className="mt-4">
                        <InputLabel htmlFor="team_name" value="Name" />
                        <TextInput
                            type="text"
                            className="mt-1 block w-full"
                            id="team_name"
                            name="name"
                            value={data.name}
                            isFocused={true}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>
                    <div className="mt-4">
                        <InputLabel htmlFor="team_desc" value="Description" />
                        <TextInput
                            type="text"
                            className="mt-1 block w-full"
                            id="team_desc"
                            name="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                        />
                        <InputError message={errors.description} className="mt-2" />
                    </div>
                </>
                <div className="mt-6 flex justify-end">
                    <SecondaryButton type="button" onClick={handleOnClose}>
                        Cancel
                    </SecondaryButton>

                    <PrimaryButton type="submit" className="ms-3" disabled={processing}>
                        {processing ? <ThreeDots
                            visible={true}
                            height="10"
                            width="40"
                            color="#D1D5DB"
                            radius="9"
                            ariaLabel="three-dots-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                        /> : "Submit"}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}