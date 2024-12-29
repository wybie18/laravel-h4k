import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import SelectInput from "@/Components/SelectInput";
import Textarea from "@/Components/Textarea";
import TextInput from "@/Components/TextInput";
import { useForm, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ThreeDots } from "react-loader-spinner";

export default function EditProblemForm({ modalOpen, closeModal, problem }) {
    const [existingFiles, setExistingFiles] = useState([])
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
        flag: '',
        points: '',
        category: '',
        files: null,
        remove_files: [],
    });

    useEffect(() => {
        if (problem) {
            setData({
                title: problem.title,
                description: problem.description,
                flag: problem.flag,
                points: problem.points,
                category: problem.category,
            });
            setExistingFiles(problem.file_paths || []);
        }
    }, [problem])

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

    const removeFile = (filePath) => {
        setExistingFiles(existingFiles.filter((file) => file!== filePath));
        setData('remove_files', [...(data.remove_files || []), filePath]);
    };

    const onSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('flag', data.flag);
        formData.append('points', data.points);
        formData.append('category', data.category);

        if (data.files) {
            Array.from(data.files).forEach((file) => {
                formData.append('files[]', file);
            });
        }

        data.remove_files.forEach((file) => {
            formData.append('remove_files[]', file);
        });
        router.post(route("problem.update", problem.id), formData, {
            preserveScroll: true,
            headers: { 'Content-Type': 'multipart/form-data' },
            onSuccess: () => {
                reset();
                closeModal();
            },
            onError: (errors) => {
                handleErrors(errors);
            }
        });
    };

    const handleOnClose = () => {
        reset();
        closeModal();
    };

    return (
        <Modal show={modalOpen} onClose={handleOnClose}>
            <form onSubmit={onSubmit} className="p-6">
                <h2 className="text-lg font-medium text-gray-900">
                    Edit Problem
                </h2>
                <>
                    <div className="mt-4">
                        <InputLabel htmlFor="title" value="Title" />
                        <TextInput
                            type="text"
                            className="mt-1 block w-full"
                            id="title"
                            name="title"
                            value={data.title}
                            isFocused={true}
                            onChange={(e) => setData('title', e.target.value)}
                        />
                        <InputError message={errors.title} className="mt-2" />
                    </div>
                    <div className="mt-4">
                        <InputLabel htmlFor="description" value="Description" />
                        <Textarea
                            className="mt-1 block w-full"
                            id="description"
                            name="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                        ></Textarea>
                        <InputError message={errors.description} className="mt-2" />
                    </div>
                    <div className="mt-4">
                        <InputLabel htmlFor="flag" value="Flag" />
                        <TextInput
                            type="text"
                            className="mt-1 block w-full"
                            id="flag"
                            name="flag"
                            value={data.flag}
                            onChange={(e) => setData('flag', e.target.value)}
                        />
                        <InputError message={errors.flag} className="mt-2" />
                    </div>
                    <div className="mt-4">
                        <InputLabel htmlFor="points" value="Points" />
                        <TextInput
                            type="text"
                            className="mt-1 block w-full"
                            id="points"
                            name="points"
                            value={data.points}
                            onChange={(e) => setData('points', e.target.value)}
                        />
                        <InputError message={errors.points} className="mt-2" />
                    </div>
                    <div className="mt-4">
                        <InputLabel htmlFor="category" value="Category" />
                        <SelectInput
                            className="mt-1 block w-full"
                            id="category"
                            name="category"
                            value={data.category}
                            onChange={(e) => setData('category', e.target.value)}
                        >
                            <option value="" hidden>Choose Category</option>
                            <option value="cryptography">Cryptography</option>
                            <option value="forensics">Forensics</option>
                        </SelectInput>
                        <InputError message={errors.category} className="mt-2" />
                    </div>
                    <div className="mt-4">
                        <InputLabel value="Existing Files" />
                        {existingFiles.length > 0 ? (
                            <ul className="list-disc list-inside">
                                {existingFiles.map((file, index) => (
                                    <li key={index} className="flex items-center gap-2">
                                        <a href={file} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline truncate max-w-xs">
                                            {file.split('/').pop()}
                                        </a>
                                        <button
                                            type="button"
                                            className="text-red-500 underline"
                                            onClick={() => removeFile(file)}
                                        >
                                            Remove
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No files</p>
                        )}
                    </div>
                    <div className="mt-4">
                        <InputLabel htmlFor="files" value="Add New Files" />
                        <TextInput
                            type="file"
                            className="mt-1 block w-full"
                            id="files"
                            name="files[]"
                            multiple
                            onChange={(e) => setData('files', e.target.files)}
                        />
                        <InputError message={errors.files} className="mt-2" />
                    </div>
                </>
                <div className="mt-6 flex justify-end">
                    <SecondaryButton type="button" onClick={handleOnClose}>
                        Cancel
                    </SecondaryButton>

                    <PrimaryButton type="submit" className="ms-3" disabled={processing}>
                        {processing ? (
                            <ThreeDots
                                visible={true}
                                height="10"
                                width="40"
                                color="#D1D5DB"
                                radius="9"
                                ariaLabel="three-dots-loading"
                                wrapperStyle={{}}
                                wrapperClass=""
                            />
                        ) : (
                            "Update"
                        )}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
