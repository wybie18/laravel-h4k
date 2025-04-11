import InputError from "@/Components/InputError";
import Modal from "@/Components/Modal";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import { useForm } from "@inertiajs/react";
import toast from "react-hot-toast";
import { ThreeDots } from "react-loader-spinner";
import ReactMarkdown from "react-markdown";
import { FaFontAwesomeFlag, FaGripfire } from "react-icons/fa";
import { useEffect } from "react";

export default function DisplayModal({ modalOpen, closeModal, problem = {} }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        problem_id: problem ? problem.id : "",
        flag: '',
    });

    useEffect(() => {
        if (problem && problem.id) {
            setData('problem_id', problem.id);
        }
    }, [problem, modalOpen]);

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

    const onSubmit = (e, id) => {
        e.preventDefault();
        if (!data.problem_id) {
            toast.error("Problem ID is required");
            return;
        }
        setData('problem_id', problem.id);
        post(route("challenges.submit"), {
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
        <Modal show={modalOpen} onClose={handleOnClose} maxWidth="lg">
            <form onSubmit={(e) => onSubmit(e, problem.id)} className="p-6">
                <div className='flex items-center justify-between'>
                    <h2 className="text-xl font-bold text-gray-900">
                        {problem ? `${problem.title}` : "problem"}
                    </h2>
                    <div className="bg-green-100 text-green-800 text-md font-medium me-2 px-2.5 py-0.5 rounded flex items-center gap-x-1">
                        <FaGripfire />
                        <span>
                            {problem ? `${problem.points}` : "0"}
                        </span>
                    </div>
                </div>
                <>
                    <div className="mt-4">
                        <ReactMarkdown
                            className='whitespace-pre-wrap mb-3 font-normal text-gray-700'
                            components={{
                                a: ({ href, children }) => (
                                    <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                                        {children}
                                    </a>
                                ),
                            }}
                        >
                            {problem?.description || ""}
                        </ReactMarkdown>
                    </div>
                    <div className="mt-4">
                        {problem && problem.file_paths && problem.file_paths.length > 0 && (
                            <>
                                <h3 className="font-semibold text-gray-900 mb-2">Files:</h3>
                                <ul>
                                    {problem.file_paths.map((filePath, index) => (
                                        <li key={index} className="list-none">
                                            <a
                                                href={`${filePath}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500 underline block whitespace-nowrap"
                                                download={true}
                                            >
                                                {filePath.split('/').pop()}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </div>
                    <div className="mt-4 relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                            <FaFontAwesomeFlag className="w-4 h-4 text-gray-500" />
                        </div>
                        <input
                            type="text"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5"
                            placeholder="h4k{FLAG}"
                            id="flag"
                            name="flag"
                            value={data.flag}
                            onChange={(e) => setData('flag', e.target.value)}
                        />
                        <InputError message={errors.flag} className="mt-2" />
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
