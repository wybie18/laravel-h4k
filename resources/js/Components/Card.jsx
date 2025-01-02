import ReactMarkdown from "react-markdown";

export default function Card({ title, points, children }) {

    return (
        <>
            <div className="max-w-80 bg-white border border-gray-200 rounded-lg shadow hover:cursor-pointer">
                <div className='border-b border-gray-200'>
                    <div className='flex items-center justify-between p-5'>
                        <h3 className="text-xl font-bold text-gray-900">
                            {title}
                        </h3>
                        <span class="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">{points}</span>
                    </div>
                </div>
                <div class="p-5">
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
                        {children}
                    </ReactMarkdown>
                </div>
            </div>
        </>
    );
}