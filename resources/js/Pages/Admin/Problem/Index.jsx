import Pagination from '@/Components/Pagination';
import TableHeading from '@/Components/TableHeading';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import toast from "react-hot-toast";
import SearchInput from '@/Components/SearchInput';
import CreateProblemForm from './Partials/CreateProblemForm';
import EditProblemForm from './Partials/EditProblemForm';
import DeleteProblemForm from './Partials/DeleteProblemForm';

export default function Index({ problems, queryParams = null, success }) {
    queryParams = queryParams || {};
    const [problemData, setProblemData] = useState(null);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const handleCreateProblem = () => {
        setCreateModalOpen(true);
    };

    const handleEditProblem = (problem) => {
        setProblemData(p => (p = problem));
        setEditModalOpen(true);
    };

    const handleDeleteProblem = (problem) => {
        setProblemData(p => (p = problem));
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
        router.get(route('problem.index'), queryParams, { preserveState: true });
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
        router.get(route('problem.index'), queryParams);
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
                        Problems
                    </h2>
                    <button type="button" onClick={handleCreateProblem} className="bg-green-900 py-1 px-3 me-2 text-white rounded shadow transition-all hover:bg-green-700">
                        Add Problem
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
                                    placeholder="Search Title, Description..."
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
                                            <TableHeading name="title" sort_field={queryParams.sort_field} sort_direction={queryParams.sort_direction} sortChange={sortChange}>
                                                Title
                                            </TableHeading>
                                            <TableHeading name="description" sort_field={queryParams.sort_field} sort_direction={queryParams.sort_direction} sortChange={sortChange}>
                                                Description
                                            </TableHeading>
                                            <TableHeading name="flag" sort_field={queryParams.sort_field} sort_direction={queryParams.sort_direction} sortChange={sortChange}>
                                                Flag
                                            </TableHeading>
                                            <TableHeading name="points" sort_field={queryParams.sort_field} sort_direction={queryParams.sort_direction} sortChange={sortChange}>
                                                Points
                                            </TableHeading>
                                            <TableHeading name="category" sort_field={queryParams.sort_field} sort_direction={queryParams.sort_direction} sortChange={sortChange}>
                                                Category
                                            </TableHeading>
                                            <TableHeading name="" sortable={false} sort_field={queryParams.sort_field} sort_direction={queryParams.sort_direction} sortChange={sortChange}>
                                                File
                                            </TableHeading>
                                            <TableHeading name="created_at" sort_field={queryParams.sort_field} sort_direction={queryParams.sort_direction} sortChange={sortChange}>
                                                Created Date
                                            </TableHeading>
                                            <th className="px-3 py-2 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {problems.data.length > 0 ? (
                                            problems.data.map(problem => (
                                                <tr className="bg-white border-b" key={problem.id}>
                                                    <td className="px-3 py-2">{problem.id}</td>
                                                    <td className="px-3 py-2 text-nowrap">{problem.title}</td>
                                                    <td className="px-3 py-2">{problem.description}</td>
                                                    <td className="px-3 py-2">{problem.flag}</td>
                                                    <td className="px-3 py-2">{problem.points}</td>
                                                    <td className="px-3 py-2">{problem.category}</td>
                                                    <td className="px-3 py-2">
                                                        {problem.file_paths && problem.file_paths.length > 0 ?
                                                            problem.file_paths.map((filePath, index) => (
                                                                <li key={index} className="truncate list-none">
                                                                    <a
                                                                        href={`${filePath}`}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-blue-500 underline truncate block max-w-20 overflow-hidden whitespace-nowrap text-ellipsis"
                                                                    >
                                                                        {filePath.split('/').pop()}
                                                                    </a>
                                                                </li>
                                                            ))
                                                            : 'No file'
                                                        }
                                                    </td>

                                                    <td className="px-3 py-2 text-nowrap">{problem.created_at}</td>
                                                    <td className="px-3 py-2 text-right">
                                                        <span className="font-medium text-blue-600 hover:underline mx-1 cursor-pointer" onClick={() => handleEditProblem(problem)}>
                                                            Edit
                                                        </span>
                                                        <span className="font-medium text-red-600 hover:underline mx-1 cursor-pointer" onClick={() => handleDeleteProblem(problem)}>
                                                            Delete
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="9" className="px-3 py-2 text-center">No data available</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {problems.data.length > 0 ? (
                                <Pagination links={problems.meta.links} />
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>

            <CreateProblemForm modalOpen={createModalOpen} closeModal={closeCreateModal} />
            <EditProblemForm modalOpen={editModalOpen} closeModal={closeEditModal} problem={problemData} />
            <DeleteProblemForm modalOpen={deleteModalOpen} closeModal={closeDeleteModal} problem={problemData} />

        </AuthenticatedLayout>
    );
}
