import ApplicationLogo from '@/Components/ApplicationLogo';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="border-b border-gray-100 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <div>
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                                </div>
                                <span className='text-lg font-extrabold ml-4'>Hack4Knight</span>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            <div className="flex flex-col items-center bg-gray-100 pt-6 sm:justify-center sm:pt-0 mt-6">
                <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-sm sm:rounded-lg">
                    {children}
                </div>
            </div>
        </div>
    );
}
