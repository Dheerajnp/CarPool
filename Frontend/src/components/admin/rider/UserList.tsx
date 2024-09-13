import axios from 'axios';
import { useEffect, useState } from 'react';
import { axiosActionsUser } from '../../../functions/services/adminApi';
import { Link } from 'react-router-dom';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../ui/tabs";
import { User } from '../../../redux/userStore/Authentication/interfaces';
import { Driver } from '../../../redux/driverStore/interfaces';

const UserList = () => {
  const [usersList, setUsersList] = useState<User[]>([]);
  const [driversList, setDriversList] = useState<Driver[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPageUser, setCurrentPageUser] = useState(1);
  const [totalPagesUser, setTotalPagesUser] = useState(1);
  const [currentPageDriver, setCurrentPageDriver] = useState(1);
  const [totalPagesDriver, setTotalPagesDriver] = useState(1);
  const [currentTab, setCurrentTab] = useState('users'); // Manage current tab state
  const limit = 8; // Number of users/drivers per page

  // const { dispatch, navigate } = useEssentials();

  useEffect(() => {
   
      fetchUsers();
    
      // fetchDrivers();
    
  }, [currentPageUser, currentPageDriver, searchQuery, currentTab]);

  const fetchUsers = async () => {  
    try {
      const response = await axios.get('/admin/getUsers', {
        params: { page: currentPageUser, limit, searchQuery },
        withCredentials: true,
      });
      setUsersList(response.data.users);
      setDriversList(response.data.drivers);
      setTotalPagesUser(response.data.pagesUser);
      setTotalPagesDriver(response.data.pagesDriver); 
    } catch (error) {
      console.error(error);
    }
  };

 
  const handleSearch = (e: any) => {
    setSearchQuery(e.target.value.toLowerCase());
    if (currentTab === 'users') {
      setCurrentPageUser(1); // Reset to first page on new search
    } else {
      setCurrentPageDriver(1); // Reset to first page on new search
    }
  };

  const blockUser = (id: string, block: boolean, role: string) => {
    axiosActionsUser(id, block, role);
  
    if (role === 'driver') {
      setDriversList((prevDrivers) =>
        prevDrivers.map((driver) =>
          driver._id === id ? { ...driver, blocked: !driver.blocked } : driver
        )
      );
    } else {
      setUsersList((prevUsers) =>
        prevUsers.map((user) =>
          user._id === id ? { ...user, blocked: !user.blocked } : user
        )
      );
    }
  };
  

  const handlePageChangeUser = (page: number) => {
    if (page > 0 && page <= totalPagesUser) {
      setCurrentPageUser(page);
    }
  };

  const handlePageChangeDriver = (page: number) => {
    if (page > 0 && page <= totalPagesDriver) {
      setCurrentPageDriver(page);
    }
  };

  const renderPaginationUser = () => {
    const pages = [];
    for (let i = 1; i <= totalPagesUser; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChangeUser(i)}
          className={`px-3 py-1 mx-1 text-sm font-medium rounded-md ${
            currentPageUser === i
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

  const renderPaginationDriver = () => {
    const pages = [];
    for (let i = 1; i <= totalPagesDriver; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChangeDriver(i)}
          className={`px-3 py-1 mx-1 text-sm font-medium rounded-md ${
            currentPageDriver === i
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

  const renderTableRows = (list: any) => {
    return list.map((user: User, index: any) => (
      <tr key={index}>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10">
              <img
                className="h-10 w-10 rounded-full"
                src="https://i.pravatar.cc/200?img=2"
                alt=""
              />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-900">
                <Link to={`/admin/license-review/${user._id}`} className="text-indigo-600 hover:text-indigo-900">{user.name}</Link>
              </div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-500">{user.email}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {user.role}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              user.verified
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {user.verified ? 'Verified' : 'Not Verified'}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <Link
            to={`/admin/license-review/${user._id}`}
            className="text-blue-600 hover:text-blue-900"
          >
            Details
          </Link>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <button
            onClick={() => blockUser(user._id, user.blocked ?? false,user.role as string)}
            className={`px-3 py-1 rounded-md text-white ${
              user.blocked
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {user.blocked ? 'Unblock' : 'Block'}
          </button>
        </td>
      </tr>
    ));
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gray">
      <div className="flex justify-between items-center mb-4 -mt-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-2xl font-semibold text-gray-800">Users and Drivers List</h2>
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

      <Tabs defaultValue="users" className="w-full" onValueChange={setCurrentTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="drivers">Drivers</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
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
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Verified
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {renderTableRows(usersList)}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-4 space-x-2">
            {renderPaginationUser()}
          </div>
        </TabsContent>
        <TabsContent value="drivers">
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
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Verified
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {renderTableRows(driversList)}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-4 space-x-2">
            {renderPaginationDriver()}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserList;
