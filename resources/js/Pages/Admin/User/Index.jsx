import Pagination from '@/Components/Pagination';
import TableHeading from '@/Components/TableHeading';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import toast from "react-hot-toast";
import CreateUserForm from './Partials/CreateUserForm';
import DeleteUserForm from './Partials/DeleteUserForm';
import EditUserForm from './Partials/EditUserForm';
import SearchInput from '@/Components/SearchInput';

export default function Index({ users, teams, queryParams = null, success }) {
    queryParams = queryParams || {};
    const [userData, setUserData] = useState(null);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const handleCreateUser = () => {
        setCreateModalOpen(true);
    };

    const handleEditUser = (user) => {
        setUserData(u => (u = user));
        setEditModalOpen(true);
    };

    const handleDeleteUser = (user) => {
        setUserData(u => (u = user));
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
        router.get(route('user.index'), queryParams, { preserveState: true });
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
        router.get(route('user.index'), queryParams);
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
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Users</h2>
                    <button type="button" onClick={handleCreateUser} className="bg-green-900 py-1 px-3 me-2 text-white rounded shadow transition-all hover:bg-green-700">
                        Add User
                    </button>

                </div>
            }
        >
            <Head title="Users" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className='flex justify-end items-center mb-4'>
                                <SearchInput
                                    placeholder="Search Name, Team..."
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
                                            <TableHeading name="username" sort_field={queryParams.sort_field} sort_direction={queryParams.sort_direction} sortChange={sortChange}>
                                                Username
                                            </TableHeading>
                                            <TableHeading name="" sortable={false} sort_field={queryParams.sort_field} sort_direction={queryParams.sort_direction} sortChange={sortChange}>
                                                Team
                                            </TableHeading>
                                            <TableHeading name="role" sort_field={queryParams.sort_field} sort_direction={queryParams.sort_direction} sortChange={sortChange}>
                                                Role
                                            </TableHeading>
                                            <TableHeading name="created_at" sort_field={queryParams.sort_field} sort_direction={queryParams.sort_direction} sortChange={sortChange}>
                                                Created Date
                                            </TableHeading>
                                            <th className="px-3 py-2 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.data.length > 0 ? (
                                            users.data.map(user => (
                                                <tr className="bg-white border-b" key={user.id}>
                                                    <td className="px-3 py-2">{user.id}</td>
                                                    <td className="px-3 py-2 text-nowrap">{user.name}</td>
                                                    <td className="px-3 py-2">{user.username}</td>
                                                    <td className="px-3 py-2">{user.team ? user.team.name : " -- "}</td>
                                                    <td className="px-3 py-2 text-nowrap">{user.role}</td>
                                                    <td className="px-3 py-2 text-nowrap">{user.created_at}</td>
                                                    <td className="px-3 py-2 text-right">
                                                        <span className="font-medium text-blue-600 hover:underline mx-1 cursor-pointer" onClick={() => handleEditUser(user)}>
                                                            Edit
                                                        </span>
                                                        <span className="font-medium text-red-600 hover:underline mx-1 cursor-pointer" onClick={() => handleDeleteUser(user)}>
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
                            {users.data.length > 0 ? (
                                <Pagination links={users.meta.links} />
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>

            <CreateUserForm modalOpen={createModalOpen} closeModal={closeCreateModal} teams={teams} />
            <EditUserForm modalOpen={editModalOpen} closeModal={closeEditModal} user={userData} teams={teams} />
            <DeleteUserForm modalOpen={deleteModalOpen} closeModal={closeDeleteModal} user={userData} />

        </AuthenticatedLayout>
    );
}
