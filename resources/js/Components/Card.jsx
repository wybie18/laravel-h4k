import { FaGripfire } from "react-icons/fa";

export default function Card({ title, points, onClick, children }) {

    return (
        <>
            <div className="max-w-80 bg-white border border-gray-200 rounded-lg shadow hover:cursor-pointer" onClick={onClick}>
                <div className='border-b border-gray-200'>
                    <div className='flex items-center justify-between p-5'>
                        <h3 className="text-xl font-bold text-gray-900">
                            {title}
                        </h3>
                        <div className="bg-green-100 text-green-800 text-md font-medium me-2 px-2.5 py-0.5 rounded flex items-center gap-x-1">
                            <FaGripfire />
                            <span>
                                {points}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}