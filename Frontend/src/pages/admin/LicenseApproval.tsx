import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import { Driver } from '../../redux/driverStore/interfaces';

const LicenseApprovalTable = () => {
  const [userslist, setUsersList] = useState<Driver[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeUserId, setActiveUserId] = useState<string | null>(null); // State to manage active user ID
  const limit = 10; // Number of users per page
  const location = useLocation();
  const userIdFromURL = location.pathname.split('/').pop() || '';

  // const { dispatch, navigate } = useEssentials();


  useEffect(() => {
    if (userIdFromURL) {
      setActiveUserId(userIdFromURL);
      setTimeout(() => setActiveUserId(null), 3000);
    }
    fetchUsers();
  }, [userIdFromURL]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/admin/pendingDrivers', {
        params: { page: currentPage, limit, searchQuery },
        withCredentials: true,
      });
      setUsersList(response.data.drivers);
      setTotalPages(response.data.pagesDriver);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase());
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleApproval = async (userId: string, status: string) => {
    try {
      await axios.put(`/admin/license-approval/${userId}`, { licenseStatus: status }, {
        withCredentials: true,
      });
      fetchUsers();
      toast.success(`License ${status} successfully!`);
    } catch (error) {
      console.error('Failed to update license status:', error);
      toast.error('Failed to update license status. Please try again.');
    }
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
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

  return (
    <div className="container mx-auto px-4 py-10 bg-gray rounded-sm -mt-2">
     <div className="flex justify-between items-center mb-4 -mt-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-2xl font-semibold text-gray-800">Approval</h2>
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
      <table className="min-w-full divide-y divide-gray-200 bg-white text-sm rounded-lg shadow-lg">
        <thead className="bg-gray-50">
          <tr className=''>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-lg">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Front License</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Back License</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ">Status</th>
            <th className="px-6 py-3 rounded-lg"></th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {userslist.map((user) => (
            <tr key={user._id} className={user._id === activeUserId ? 'blink' : ''}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.email}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:underline">
                <a href={user.licenseFrontUrl} target="_blank" rel="noopener noreferrer">View</a>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:underline">
                <a href={user.licenseBackUrl} target="_blank" rel="noopener noreferrer">View</a>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                <span className={`px-3 py-1.5 rounded-full text-black ${
                  user.licenseStatus === 'approved'
                    ? 'bg-green-500'
                    : user.licenseStatus === 'rejected'
                    ? 'bg-red-600'
                    : 'bg-yellow-300'
                }`}>
                  {user.licenseStatus}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {user.licenseStatus === 'pending' && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleApproval(user._id, 'approved')}
                      className="inline-block rounded bg-green-600 px-4 py-2 text-xs font-medium text-white hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleApproval(user._id, 'rejected')}
                      className="inline-block rounded bg-red-600 px-4 py-2 text-xs font-medium text-white hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing page {currentPage} of {totalPages}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 text-sm font-medium rounded-md ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Previous
          </button>
          {renderPagination()}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 text-sm font-medium rounded-md ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default LicenseApprovalTable;
