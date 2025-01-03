import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { FaHashtag } from "react-icons/fa";
import { useState } from 'react';
import Card from '@/Components/Card';
import DisplayModal from './Partials/DisplayModal';

export default function Challenges({ problems, success }) {
    const [problemData, setProblemData] = useState(null);
    const [displayModalOpen, setDisplayModalOpen] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);

    const handleDisplay = (problem) => {
        console.log('Problem to display:', problem);
        setProblemData(p => (p = problem));
        setDisplayModalOpen(true);
    };

    const closeDisplayModal = () => {
        setDisplayModalOpen(false);
    };

    return (
        <AuthenticatedLayout
        >
            <Head title="Challenges" />
            <aside className={(showSidebar ? 'translate-x-0' : '-translate-x-full') + " fixed top-20 sm:left-2 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"}>
                <div className="h-full px-3 py-4 overflow-y-auto bg-gray-100">
                    <div className="flex items-center ps-2.5 mb-5">
                        <span className="self-center text-xl font-semibold whitespace-nowrap">Category</span>
                    </div>
                    <ul className="space-y-2 font-medium">
                        {Object.keys(problems).map((category) => (
                            <li key={category}>
                                <a href={`#${category.toLowerCase()}`} className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100">
                                    <FaHashtag className='flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900' />
                                    <span className="flex-1 ml-3 whitespace-nowrap capitalize">{category}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>
            <div className="py-28 pl-6 sm:pl-64">
                <div className="mx-auto max-w-5xl sm:px-6 lg:px-8">
                    {Object.entries(problems).map(([category, challenges]) => (
                        <section
                            key={category}
                            id={category.toLowerCase()}
                            className='mb-12 before:content-[""] before:block before:h-20 before:-mt-20 before:invisible'
                        >
                            <h2 className="text-2xl font-bold capitalize mb-4">{category}</h2>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {challenges.map((challenge) => (
                                    <Card title={challenge.title} key={challenge.id} points={challenge.points} onClick={() => handleDisplay(challenge)}/>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </div>
            
            <DisplayModal modalOpen={displayModalOpen} closeModal={closeDisplayModal} problem={problemData} />

        </AuthenticatedLayout>
    );
}
