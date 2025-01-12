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
    plugins: {
        legend: {
            position: 'bottom',
        },
    },
};

export default function Dashboard({ teamName, teamData, usersTeamData, submissionStats, progressStats }) {
    const labels = usersTeamData[Object.keys(usersTeamData)[0]].times.map((time) => {
        return time.slice(11, 16);
    });

    const colors = ['#FF5733', '#33FF57', '#3357FF', '#F3FF33'];

    const datasets = Object.keys(usersTeamData).map((username, index) => ({
        label: username,
        data: usersTeamData[username].scores.map((score) => parseInt(score, 10)),
        borderColor: colors[index % colors.length],
        backgroundColor: `${colors[index % colors.length]}33`,
        tension: 0.4, // Smooth lines
    }));

    const data = {
        labels: labels,
        datasets: datasets,
    }

    const submissionData = {
        labels: ["Correct", "Incorrect"],
        datasets: [
            {
                data: [submissionStats.correct, submissionStats.incorrect],
                backgroundColor: ["#4caf50", "#f44336"],
                hoverBackgroundColor: ["#66bb6a", "#e57373"],
            },
        ],
    };

    const progressData = {
        labels: ["Solved", "Unsolved"],
        datasets: [
            {
                data: [progressStats.solved, progressStats.unsolved],
                backgroundColor: ["#2196f3", "#9e9e9e"],
                hoverBackgroundColor: ["#42a5f5", "#bdbdbd"],
            },
        ],
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className='mb-4'>
                                <h2 className="text-xl font-semibold text-gray-800">
                                    Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, {teamName} Team!
                                </h2>
                                <p className="text-sm text-gray-600">
                                    Keep up the great work! Here's an overview of your progress so far.
                                </p>
                                {progressStats.solved !== 0 && (
                                    progressStats.solved === 100 ? (
                                        <p className="mt-4 text-lg text-green-600 font-bold">
                                            🎉 Congratulations! Your team has solved all the problems!
                                        </p>
                                    ) : (
                                        <p className="mt-4 text-lg text-green-600 font-bold">
                                            🎉 Congratulations! Your team has solved {progressStats.solved}% of the problems!
                                        </p>
                                    )
                                )}
                            </div>

                            <div className='px-2 md:px-6 mb-4 overflow-auto'>
                                <table className="w-full text-sm text-left rtl:text-right text-gray-600">
                                    <thead className="text-md text-gray-700 font-medium bg-gray-50 border-b-2 border-gray-500">
                                        <tr>
                                            <th className="px-3 py-2 text-center" colSpan={3}>{teamName}</th> {/* Team name */}
                                        </tr>
                                    </thead>
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b-2 border-gray-500">
                                        <tr className="text-nowrap">
                                            <th className="px-3 py-2 text-left">Username</th>
                                            <th className="px-3 py-2 text-left">Problem solved</th>
                                            <th className="px-3 py-2 text-right">Total Scores</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {teamData.map((player, index) => (
                                            <tr
                                                key={index}
                                                className={`bg-white border-b ${index % 2 === 0 ? "bg-gray-50" : ""}`}
                                            >
                                                <td className="px-3 py-2 text-left">{player.username}</td>
                                                <td className="px-3 py-2 text-center">{player.problems_solved}</td>
                                                <td className="px-3 py-2 text-right">{player.total_score}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className='px-2 py-2 md:px-8 md:py-6 mb-4'>
                                <h3 className="mb-4 text-lg font-bold">Scores Over Time</h3>
                                <p className="mb-4 text-sm text-gray-600">
                                    This graph shows how your scores have improved over time. Keep up the momentum!
                                </p>
                                <Line options={options} data={data} />
                            </div>
                            <div className='mt-6 p-2 md:p-6 flex flex-col md:flex-row items-center justify-center gap-6'>
                                <div className='max-w-sm bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100'>
                                    <div className='border-b border-gray-200'>
                                        <div className='p-6'>
                                            <h3 className="mb-4 text-lg font-bold">Submission Accuracy</h3>
                                            <p className="text-sm text-gray-600 mb-2 text-pretty">
                                                This chart shows the accuracy of your submissions. The green slice represents the percentage of correct answers, while the red slice shows incorrect attempts.
                                            </p>
                                        </div>
                                    </div>
                                    <div className='p-6'>
                                        <Doughnut data={submissionData} />
                                    </div>
                                </div>
                                <div className='max-w-sm bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100'>
                                    <div className='border-b border-gray-200'>
                                        <div className='p-6'>
                                            <h3 className="mb-4 text-lg font-bold">Progress</h3>
                                            <p className="text-sm text-gray-600 mb-2 text-pretty">
                                                This chart highlights your team's overall progress. The blue slice indicates solved problems, while the gray slice shows unsolved ones. Keep up the momentum and strive for 100% completion!
                                            </p>
                                        </div>
                                    </div>
                                    <div className='p-6'>
                                        <Doughnut data={progressData} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout >
    );
}
