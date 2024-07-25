import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { User } from '../../../redux/userStore/Authentication/interfaces';

const UserDocumentReviewListPage = () => {
  const [usersList, setUsersList] = useState<User[]|[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const limit = 8; // Number of users per page

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchQuery]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/admin/getUsersPendingApproval', {
        params: { page: currentPage, limit, searchQuery },
        withCredentials: true,
      });

      if (response.data.user) { // Check if 'users' exists in the response
        setUsersList(response.data.user);
        setTotalPages(response.data.userPage);
      } else {
        console.error('Error fetching users: No users found in the response.');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  console.log("total pages")
  console.log(totalPages);

  const handleSearch = (e: any) => {
    setSearchQuery(e.target.value.toLowerCase());
    setCurrentPage(1); // Reset to first page on new search
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const approveDocument = async (userId: string) => {
    try {
      const response = await axios.patch(`/admin/approveDocument/${userId}`, {}, {
        withCredentials: true,
      });
      // Assuming the response contains updated user data
      const updatedUsers = usersList.map(user =>
        user._id === userId ? { ...user, documents: { ...user.documents, status: 'verified' } } : user
      );
      setUsersList(updatedUsers);
    } catch (error) {
      console.error('Error approving document:', error);
    }
  };

  const rejectDocument = async (userId: string) => {
    try {
      const response = await axios.patch(`/admin/rejectDocument/${userId}`, {}, {
        withCredentials: true,
      });
      // Assuming the response contains updated user data
      const updatedUsers = usersList.map(user =>
        user._id === userId ? { ...user, documents: { ...user.documents, status: 'rejected' } } : user
      );
      setUsersList(updatedUsers);
    } catch (error) {
      console.error('Error rejecting document:', error);
    }
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 mx-1 text-sm font-medium rounded-md ${
            currentPage === i
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  const renderTableRows = () => {
    return usersList.map((user) => (
      <tr key={user._id}>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10">
              <img
                className="h-10 w-10 rounded-full"
                src={`https://i.pravatar.cc/200?u=${user._id}`} // Example avatar URL
                alt=""
              />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-900">
                <Link to={`/admin/document-review/${user._id}`} className="text-indigo-600 hover:text-indigo-900">
                  {user.name}
                </Link>
              </div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-500">{user.email}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              user.documents && user.documents.status === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : user.documents?.status === 'verified'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {user.documents && user.documents.status === 'pending'
              ? 'Pending Approval'
              : user.documents?.status === 'verified'
              ? 'Approved'
              : 'Rejected'}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {user.documents?.type}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {user.documents?.url && (
            <a href={user.documents.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
              View Document
            </a>
          )}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <button
            onClick={() => approveDocument(user._id)}
            className="px-3 py-1 rounded-md text-white bg-green-600 hover:bg-green-700 mr-2"
            disabled={user.documents && user.documents.status !== 'pending'}
          >
            Approve
          </button>
          <button
            onClick={() => rejectDocument(user._id)}
            className="px-3 py-1 rounded-md text-white bg-red-600 hover:bg-red-700"
            disabled={user.documents && user.documents.status !== 'pending'}
          >
            Reject
          </button>
        </td>
      </tr>
    ));
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gray">
      <div className="flex justify-between items-center mb-4 -mt-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-2xl font-semibold text-gray-800">User Document Review</h2>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search.."
            value={searchQuery}
            onChange={handleSearch}
            className="pl-10 pr-4 py-2 w-64 text-sm text-gray-900 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white border border-gray-200"
          />
          <svg
            className="absolute left-3 top-[8px] h-[18px] w-[18px] text-gray-400 "
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Approval Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Document Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Document URL
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {renderTableRows()}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4 space-x-2">
        {renderPagination()}
      </div>
    </div>
  );
};

export default UserDocumentReviewListPage;
