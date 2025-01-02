import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import ReactMarkdown from "react-markdown";
import { FaHashtag } from "react-icons/fa";
import { useState } from 'react';
import Card from '@/Components/Card';

export default function Challenges() {
    const [showSidebar, setShowSidebar] = useState(false);
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
                        <li>
                            <a href="#cyptography" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group">
                                <FaHashtag className='flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900' />
                                <span className="flex-1 ms-3">Cyptography</span>
                            </a>
                        </li>
                        <li>
                            <a href="#forensics" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group">
                                <FaHashtag className='flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900' />
                                <span className="flex-1 ms-3 whitespace-nowrap">Forensics</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group">
                                <FaHashtag className='flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900' />
                                <span className="flex-1 ms-3 whitespace-nowrap">Programming</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group">
                                <FaHashtag className='flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900' />
                                <span className="flex-1 ms-3 whitespace-nowrap">Web Exploitation</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group">
                                <FaHashtag className='flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900' />
                                <span className="flex-1 ms-3 whitespace-nowrap">Miscellaneous</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </aside>
            <div className="py-28 sm:pl-64">
                <div className="mx-auto max-w-5xl sm:px-6 lg:px-8">
                    <section id='cyptography' className='mb-12 before:content-[""] before:block before:h-20 before:-mt-20 before:invisible'>
                        <h2 className='font-bold text-2xl capitalize mb-4'>
                            Cyptography
                        </h2>
                        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                            <Card title="Substitution Cipher" points={50}>
                                Someone gave me this, but I haven't the slightest idea as to what it says! [File](https://mega.nz/#!iCBz2IIL!B7292dJSx1PGXoWhd9oFLk2g0NFqGApBaItI_2Gsp9w) Figure it out for me, will ya?
                            </Card>
                            <Card title="Substitution Cipher" points={50}>
                                Someone gave me this, but I haven't the slightest idea as to what it says! [File](https://mega.nz/#!iCBz2IIL!B7292dJSx1PGXoWhd9oFLk2g0NFqGApBaItI_2Gsp9w) Figure it out for me, will ya?
                            </Card>
                            <Card title="Substitution Cipher" points={50}>
                                Someone gave me this, but I haven't the slightest idea as to what it says! [File](https://mega.nz/#!iCBz2IIL!B7292dJSx1PGXoWhd9oFLk2g0NFqGApBaItI_2Gsp9w) Figure it out for me, will ya?
                            </Card>
                            <Card title="Substitution Cipher" points={50}>
                                Someone gave me this, but I haven't the slightest idea as to what it says! [File](https://mega.nz/#!iCBz2IIL!B7292dJSx1PGXoWhd9oFLk2g0NFqGApBaItI_2Gsp9w) Figure it out for me, will ya?
                            </Card>
                            <Card title="Substitution Cipher" points={50}>
                                Someone gave me this, but I haven't the slightest idea as to what it says! [File](https://mega.nz/#!iCBz2IIL!B7292dJSx1PGXoWhd9oFLk2g0NFqGApBaItI_2Gsp9w) Figure it out for me, will ya?
                            </Card>
                            <Card title="Substitution Cipher" points={50}>
                                Someone gave me this, but I haven't the slightest idea as to what it says! [File](https://mega.nz/#!iCBz2IIL!B7292dJSx1PGXoWhd9oFLk2g0NFqGApBaItI_2Gsp9w) Figure it out for me, will ya?
                            </Card>
                            <Card title="Substitution Cipher" points={50}>
                                Someone gave me this, but I haven't the slightest idea as to what it says! [File](https://mega.nz/#!iCBz2IIL!B7292dJSx1PGXoWhd9oFLk2g0NFqGApBaItI_2Gsp9w) Figure it out for me, will ya?
                            </Card>
                            <Card title="Substitution Cipher" points={50}>
                                Someone gave me this, but I haven't the slightest idea as to what it says! [File](https://mega.nz/#!iCBz2IIL!B7292dJSx1PGXoWhd9oFLk2g0NFqGApBaItI_2Gsp9w) Figure it out for me, will ya?
                            </Card>
                        </div>
                        
                    </section>

                    <section id='forensics' className="before:content-[''] before:block before:h-20 before:-mt-20 before:invisible">
                        <h2 className='font-bold text-2xl capitalize mb-4'>
                            Forensics
                        </h2>
                        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                            <Card title="Substitution Cipher" points={50}>
                                Someone gave me this, but I haven't the slightest idea as to what it says! [File](https://mega.nz/#!iCBz2IIL!B7292dJSx1PGXoWhd9oFLk2g0NFqGApBaItI_2Gsp9w) Figure it out for me, will ya?
                            </Card>
                            <Card title="Substitution Cipher" points={50}>
                                Someone gave me this, but I haven't the slightest idea as to what it says! [File](https://mega.nz/#!iCBz2IIL!B7292dJSx1PGXoWhd9oFLk2g0NFqGApBaItI_2Gsp9w) Figure it out for me, will ya?
                            </Card>
                            <Card title="Substitution Cipher" points={50}>
                                Someone gave me this, but I haven't the slightest idea as to what it says! [File](https://mega.nz/#!iCBz2IIL!B7292dJSx1PGXoWhd9oFLk2g0NFqGApBaItI_2Gsp9w) Figure it out for me, will ya?
                            </Card>
                            <Card title="Substitution Cipher" points={50}>
                                Someone gave me this, but I haven't the slightest idea as to what it says! [File](https://mega.nz/#!iCBz2IIL!B7292dJSx1PGXoWhd9oFLk2g0NFqGApBaItI_2Gsp9w) Figure it out for me, will ya?
                            </Card>
                            <Card title="Substitution Cipher" points={50}>
                                Someone gave me this, but I haven't the slightest idea as to what it says! [File](https://mega.nz/#!iCBz2IIL!B7292dJSx1PGXoWhd9oFLk2g0NFqGApBaItI_2Gsp9w) Figure it out for me, will ya?
                            </Card>
                            <Card title="Substitution Cipher" points={50}>
                                Someone gave me this, but I haven't the slightest idea as to what it says! [File](https://mega.nz/#!iCBz2IIL!B7292dJSx1PGXoWhd9oFLk2g0NFqGApBaItI_2Gsp9w) Figure it out for me, will ya?
                            </Card>
                            <Card title="Substitution Cipher" points={50}>
                                Someone gave me this, but I haven't the slightest idea as to what it says! [File](https://mega.nz/#!iCBz2IIL!B7292dJSx1PGXoWhd9oFLk2g0NFqGApBaItI_2Gsp9w) Figure it out for me, will ya?
                            </Card>
                            <Card title="Substitution Cipher" points={50}>
                                Someone gave me this, but I haven't the slightest idea as to what it says! [File](https://mega.nz/#!iCBz2IIL!B7292dJSx1PGXoWhd9oFLk2g0NFqGApBaItI_2Gsp9w) Figure it out for me, will ya?
                            </Card>
                        </div>
                        
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
