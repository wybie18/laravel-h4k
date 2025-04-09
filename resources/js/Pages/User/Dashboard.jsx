import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    ArcElement,
    Legend,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { useState } from 'react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    ArcElement,
    Legend
);

export const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom',
            labels: {
                boxWidth: 12,
                padding: 15,
                font: {
                    size: 12
                }
            }
        },
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleFont: {
                size: 14,
                weight: 'bold'
            },
            bodyFont: {
                size: 13
            },
            padding: 12,
            cornerRadius: 6
        }
    },
    scales: {
        y: {
            beginAtZero: true,
            grid: {
                color: 'rgba(0, 0, 0, 0.05)'
            },
            ticks: {
                font: {
                    size: 11
                }
            }
        },
        x: {
            grid: {
                display: false
            },
            ticks: {
                font: {
                    size: 11
                }
            }
        }
    }
};

export const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
        legend: {
            position: 'bottom',
            labels: {
                boxWidth: 12,
                padding: 15,
                font: {
                    size: 12
                }
            }
        },
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleFont: {
                size: 14,
                weight: 'bold'
            },
            bodyFont: {
                size: 13
            },
            padding: 12,
            cornerRadius: 6
        }
    }
};

export default function Dashboard({ teamName, teamData, usersTeamData, submissionStats, progressStats }) {
    const [activeTab, setActiveTab] = useState('overview');

    // Check if usersTeamData has any entries before trying to access them
    const hasUserData = usersTeamData && Object.keys(usersTeamData).length > 0;

    // Only extract labels if we have user data
    const labels = hasUserData
        ? usersTeamData[Object.keys(usersTeamData)[0]].times.map((time) => time.slice(11, 16))
        : [];

    // Updated color palette - more professional colors
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#6366f1', '#ec4899', '#a855f7'];

    // Only create datasets if we have user data
    const datasets = hasUserData
        ? Object.keys(usersTeamData).map((username, index) => ({
            label: username,
            data: usersTeamData[username].scores.map((score) => parseInt(score, 10)),
            borderColor: colors[index % colors.length],
            backgroundColor: `${colors[index % colors.length]}20`,
            borderWidth: 2,
            pointBackgroundColor: colors[index % colors.length],
            pointRadius: 3,
            pointHoverRadius: 5,
            tension: 0.3,
        }))
        : [];

    const data = {
        labels: labels,
        datasets: datasets,
    }

    const submissionData = {
        labels: ["Correct", "Incorrect"],
        datasets: [
            {
                data: [submissionStats.correct, submissionStats.incorrect],
                backgroundColor: ["#10b981", "#ef4444"],
                hoverBackgroundColor: ["#059669", "#dc2626"],
                borderWidth: 0,
            },
        ],
    };

    const progressData = {
        labels: ["Solved", "Unsolved"],
        datasets: [
            {
                data: [progressStats.solved, progressStats.unsolved],
                backgroundColor: ["#3b82f6", "#e5e7eb"],
                hoverBackgroundColor: ["#2563eb", "#d1d5db"],
                borderWidth: 0,
            },
        ],
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Team Dashboard
                    </h2>
                    <div className="text-sm text-gray-500">
                        Last updated: {new Date().toLocaleString()}
                    </div>
                </div>
            }
        >
            <Head title="Team Dashboard" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Welcome Card */}
                    <div className="mb-6 overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg sm:rounded-lg">
                        <div className="p-6 md:p-8">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">
                                        {getGreeting()}, <span className="text-blue-200">{teamName}</span> Team!
                                    </h2>
                                </div>
                                {progressStats.solved > 0 && (
                                    <div className="mt-4 md:mt-0 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg">
                                        {progressStats.solved === 100 ? (
                                            <p className="text-lg text-white font-bold">
                                                🏆 Your team has solved all problems!
                                            </p>
                                        ) : (
                                            <p className="text-lg text-white font-bold">
                                                🚀 {Math.round(progressStats.solved)}% problems solved
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="mb-6 bg-white shadow sm:rounded-lg">
                        <div className="border-b border-gray-200">
                            <nav className="flex -mb-px">
                                <button
                                    onClick={() => setActiveTab('overview')}
                                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'overview'
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    Overview
                                </button>
                                <button
                                    onClick={() => setActiveTab('team')}
                                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'team'
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    Team Stats
                                </button>
                                <button
                                    onClick={() => setActiveTab('progress')}
                                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'progress'
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    Progress
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'overview' && (
                        <>
                            {/* Key Stats */}
                            <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                <div className="overflow-hidden bg-white shadow sm:rounded-lg">
                                    <div className="px-4 py-5 sm:p-6">
                                        <div className="flex items-center">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-100 text-blue-600">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                                                </svg>
                                            </div>
                                            <div className="ml-5">
                                                <dl>
                                                    <dt className="text-sm font-medium text-gray-500 truncate">Team Members</dt>
                                                    <dd className="mt-1 text-3xl font-semibold text-gray-900">{teamData.length}</dd>
                                                </dl>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="overflow-hidden bg-white shadow sm:rounded-lg">
                                    <div className="px-4 py-5 sm:p-6">
                                        <div className="flex items-center">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-green-100 text-green-600">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                                                </svg>
                                            </div>
                                            <div className="ml-5">
                                                <dl>
                                                    <dt className="text-sm font-medium text-gray-500 truncate">Total Problems Solved</dt>
                                                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                                                        {teamData.reduce((sum, player) => sum + parseInt(player.problems_solved || 0), 0)}
                                                    </dd>
                                                </dl>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="overflow-hidden bg-white shadow sm:rounded-lg">
                                    <div className="px-4 py-5 sm:p-6">
                                        <div className="flex items-center">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-purple-100 text-purple-600">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
                                                </svg>
                                            </div>
                                            <div className="ml-5">
                                                <dl>
                                                    <dt className="text-sm font-medium text-gray-500 truncate">Total Score</dt>
                                                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                                                        {teamData.reduce((sum, player) => sum + parseInt(player.total_score || 0), 0)}
                                                    </dd>
                                                </dl>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Score Chart */}
                            <div className="mb-6 overflow-hidden bg-white shadow sm:rounded-lg">
                                <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
                                    <h3 className="text-lg font-medium leading-6 text-gray-900">Score Progression</h3>
                                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                        Track how your team's scores have improved over time.
                                    </p>
                                </div>
                                <div className="bg-white px-4 py-5 sm:p-6">
                                    {hasUserData ? (
                                        <div className="h-80">
                                            <Line options={options} data={data} />
                                        </div>
                                    ) : (
                                        <div className="flex h-64 items-center justify-center bg-gray-50 rounded-lg">
                                            <div className="text-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mx-auto h-12 w-12 text-gray-400">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />
                                                </svg>
                                                <h3 className="mt-2 text-sm font-medium text-gray-900">No data available</h3>
                                                <p className="mt-1 text-sm text-gray-500">
                                                    Start solving problems to see your progress.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'team' && (
                        <div className="overflow-hidden bg-white shadow sm:rounded-lg">
                            <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">{teamName} Team Stats</h3>
                                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                    Detailed view of individual performance within the team.
                                </p>
                            </div>
                            <div className="bg-white px-4 py-5 sm:p-6">
                                <div className="overflow-hidden rounded-lg border border-gray-200">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    Username
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    Problems Solved
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    Total Score
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {teamData.map((player, index) => (
                                                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                                        {player.username}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                        <div className="flex items-center">
                                                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                                                {player.problems_solved}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-gray-900">
                                                        {player.total_score}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot className="bg-gray-50">
                                            <tr>
                                                <th scope="row" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    Total
                                                </th>
                                                <td className="whitespace-nowrap px-6 py-3 text-sm font-medium text-gray-900">
                                                    <span className='px-2.5'>{teamData.reduce((sum, player) => sum + player.problems_solved, 0)}</span>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-3 text-right text-sm font-medium text-gray-900">
                                                    {teamData.reduce((sum, player) => sum + parseInt(player.total_score || 0), 0)}
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'progress' && (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="overflow-hidden bg-white shadow sm:rounded-lg">
                                <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
                                    <h3 className="text-lg font-medium leading-6 text-gray-900">Submission Accuracy</h3>
                                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                        The ratio of correct to incorrect submissions.
                                    </p>
                                </div>
                                <div className="bg-white px-4 py-5 sm:p-6">
                                    <div className="h-64">
                                        <Doughnut options={doughnutOptions} data={submissionData} />
                                    </div>
                                    <div className="mt-6 grid grid-cols-2 gap-4">
                                        <div className="rounded-md bg-green-50 p-4">
                                            <div className="flex">
                                                <div className="flex-shrink-0">
                                                    <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div className="ml-3">
                                                    <h3 className="text-sm font-medium text-green-800">Correct</h3>
                                                    <div className="mt-2 text-sm text-green-700">
                                                        <p>{Math.round(submissionStats.correct)}%</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="rounded-md bg-red-50 p-4">
                                            <div className="flex">
                                                <div className="flex-shrink-0">
                                                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div className="ml-3">
                                                    <h3 className="text-sm font-medium text-red-800">Incorrect</h3>
                                                    <div className="mt-2 text-sm text-red-700">
                                                        <p>{Math.round(submissionStats.incorrect)}%</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-hidden bg-white shadow sm:rounded-lg">
                                <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
                                    <h3 className="text-lg font-medium leading-6 text-gray-900">Problem Completion</h3>
                                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                        Your team's overall progress toward completing all problems.
                                    </p>
                                </div>
                                <div className="bg-white px-4 py-5 sm:p-6">
                                    <div className="h-64">
                                        <Doughnut options={doughnutOptions} data={progressData} />
                                    </div>
                                    <div className="mt-6">
                                        <div className="relative pt-1">
                                            <div className="mb-2 flex items-center justify-between">
                                                <div>
                                                    <span className="inline-block rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-600">
                                                        Progress
                                                    </span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-xs font-semibold text-blue-600">
                                                        {Math.round(progressStats.solved)}%
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="mb-4 flex h-2 overflow-hidden rounded bg-blue-100">
                                                <div
                                                    style={{ width: `${progressStats.solved}%` }}
                                                    className="flex flex-col justify-center overflow-hidden whitespace-nowrap rounded bg-blue-500 text-center text-white shadow-none"
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}