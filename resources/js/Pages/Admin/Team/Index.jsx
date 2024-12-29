import Pagination from '@/Components/Pagination';
import TableHeading from '@/Components/TableHeading';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import CreateTeamForm from './Partials/CreateTeamForm';
import toast from "react-hot-toast";
import DeleteTeamForm from './Partials/DeleteTeamForm';
import EditTeamForm from './Partials/EditTeamForm';
import SearchInput from '@/Components/SearchInput';

export default function Index({ teams, queryParams = null, success }) {
    queryParams = queryParams || {};
    const [teamData, setTeamData] = useState(null);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const handleCreateTeam = () => {
        setCreateModalOpen(true);
    };

    const handleEditTeam = (team) => {
        setTeamData(t => (t = team));
        setEditModalOpen(true);
    };

    const handleDeleteTeam = (team) => {
        setTeamData(t => (t = team));
        setDeleteModalOpen(true);
    };

    const closeCreateModal = () => {
        setCreateModalOpen(false);
    };

    const closeEditModal = () => {
        setEditModalOpen(false);
    };

    const closeDeleteModal = () => {
        setDeleteModalOpen(false);
    };

    const searchFieldChanged = (name, value) => {
        if (!value && !queryParams[name]) {
            return;
        }
        if (value) {
            queryParams[name] = value;
        } else {
            delete queryParams[name];
        }
        router.get(route('team.index'), queryParams, { preserveState: true });
    }

    const onKeyPress = (name, e) => {
        if (e.key != 'Enter') return;
        searchFieldChanged(name, e.target.value)
    }

    const sortChange = (name) => {
        if (name === queryParams.sort_field) {
            if (queryParams.sort_direction === 'asc') {
                queryParams.sort_direction = 'desc';
            }
            else {
                queryParams.sort_direction = 'asc';
            }
        } else {
            queryParams.sort_field = name;
            queryParams.sort_direction = 'asc';
        }
        router.get(route('team.index'), queryParams);
    }

    const handleSuccess = (success) => {
        if (success) {
            toast.success(success);
        }
    };

    useEffect(() => {
        handleSuccess(success);
    }, [success]);

    const handleSearch = (e) => {
        const searchInput = e.target.closest('div').querySelector('input');
        if (searchInput) {
            searchFieldChanged('search', searchInput.value);
        }
    };  

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Teams
                    </h2>
                    <button type="button" onClick={handleCreateTeam} className="bg-green-900 py-1 px-3 me-2 text-white rounded shadow transition-all hover:bg-green-700">
                        Add Team
                    </button>
                </div>
            }
        >
            <Head title="Teams" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className='flex justify-end items-center mb-4'>
                                <SearchInput
                                    placeholder="Search Name, Description..."
                                    onSearch={handleSearch}
                                    onBlur={(e) => searchFieldChanged('search', e.target.value)}
                                    onKeyPress={(e) => onKeyPress('search', e)}
                                    className="w-80"
                                />
                            </div>
                            <div className="overflow-auto">
                                <table className="w-full text-sm text-left rtl:text-right text-gray-600">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b-2 border-gray-500">
                                        <tr className="text-nowrap">
                                            <TableHeading name="id" sort_field={queryParams.sort_field} sort_direction={queryParams.sort_direction} sortChange={sortChange}>
                                                ID
                                            </TableHeading>
                                            <TableHeading name="name" sort_field={queryParams.sort_field} sort_direction={queryParams.sort_direction} sortChange={sortChange}>
                                                Name
                                            </TableHeading>
                                            <TableHeading name="description" sort_field={queryParams.sort_field} sort_direction={queryParams.sort_direction} sortChange={sortChange}>
                                                Description
                                            </TableHeading>
                                            <TableHeading name="score" sort_field={queryParams.sort_field} sort_direction={queryParams.sort_direction} sortChange={sortChange}>
                                                Score
                                            </TableHeading>
                                            <TableHeading name="created_at" sort_field={queryParams.sort_field} sort_direction={queryParams.sort_direction} sortChange={sortChange}>
                                                Created Date
                                            </TableHeading>
                                            <TableHeading name="updated_at" sort_field={queryParams.sort_field} sort_direction={queryParams.sort_direction} sortChange={sortChange}>
                                                Updated Date
                                            </TableHeading>
                                            <th className="px-3 py-2 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {teams.data.length > 0 ? (
                                            teams.data.map(team => (
                                                <tr className="bg-white border-b" key={team.id}>
                                                    <td className="px-3 py-2">{team.id}</td>
                                                    <td className="px-3 py-2 text-nowrap">{team.name}</td>
                                                    <td className="px-3 py-2">{team.description}</td>
                                                    <td className="px-3 py-2">{team.score}</td>
                                                    <td className="px-3 py-2 text-nowrap">{team.created_at}</td>
                                                    <td className="px-3 py-2 text-nowrap">{team.updated_at}</td>
                                                    <td className="px-3 py-2 text-right">
                                                        <span className="font-medium text-blue-600 hover:underline mx-1 cursor-pointer" onClick={() => handleEditTeam(team)}>
                                                            Edit
                                                        </span>
                                                        <span className="font-medium text-red-600 hover:underline mx-1 cursor-pointer" onClick={() => handleDeleteTeam(team)}>
                                                            Delete
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="px-3 py-2 text-center">No data available</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {teams.data.length > 0 ? (
                                <Pagination links={teams.meta.links} />
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
            <CreateTeamForm modalOpen={createModalOpen} closeModal={closeCreateModal} />
            <EditTeamForm modalOpen={editModalOpen} closeModal={closeEditModal} team={teamData} />
            <DeleteTeamForm modalOpen={deleteModalOpen} closeModal={closeDeleteModal} team={teamData} />
        </AuthenticatedLayout>
    );
}
