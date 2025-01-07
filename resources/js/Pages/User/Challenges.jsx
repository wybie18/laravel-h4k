import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { FaHashtag } from "react-icons/fa";
import { useEffect, useState } from 'react';
import toast from "react-hot-toast";
import Card from '@/Components/Card';
import DisplayModal from './Partials/DisplayModal';
import { useEventBus } from '@/EventBus';

const Challenges = ({ problems: initialProblems, status_message }) => {
    const [problems, setProblems] = useState(initialProblems);
    const [problemData, setProblemData] = useState(null);
    const [displayModalOpen, setDisplayModalOpen] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);
    const { subscribe } = useEventBus();
    
    const handleDisplay = (problem) => {
        console.log('Problem to display:', problem);
        setProblemData(p => (p = problem));
        setDisplayModalOpen(true);
    };

    const closeDisplayModal = () => {
        setDisplayModalOpen(false);
    };
    
    useEffect(() => {
        if (status_message) {
            const { type, message } = status_message;
            type === "success" ? toast.success(message) : toast.error(message);
        }
    }, [status_message]);

    useEffect(() => {
        const unsubscribe = subscribe('problemSolved', (data) =>{
            setProblems((prevProblems) => {
                const updatedProblems = {...prevProblems };
                for (let category in updatedProblems) {
                    updatedProblems[category] = updatedProblems[category].map((problem) => {
                        if (problem.id === data.problemId) {
                            return {...problem, is_solved: true };
                        }
                        return problem;
                    });
                }
                return updatedProblems;
            });
        });
        return () => {
            unsubscribe();
        }
    }, [subscribe])

    return (
        <>
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
                                    <Card 
                                        title={challenge.title} 
                                        key={challenge.id} 
                                        points={challenge.points} 
                                        isSolved={challenge.is_solved}
                                        onClick={() => handleDisplay(challenge)}        
                                    />
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </div>
            
            <DisplayModal modalOpen={displayModalOpen} closeModal={closeDisplayModal} problem={problemData} />

        </>
    );
}


Challenges.layout = page => <AuthenticatedLayout children={page} />

export default Challenges