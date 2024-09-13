import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Vehicle {
  _id: string;
  brand: string;
  model: string;
  rcDocumentUrl: string;
  number: string;
  status: string;
}

interface Driver {
  _id: string;
  name: string;
  email: string;
  vehicles: Vehicle[];
}

const VehicleReviewListPage = () => {
  const [driversList, setDriversList] = useState<Driver[] | []>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const limit = 8; // Number of drivers per page

  useEffect(() => {
    fetchDrivers();
  }, [currentPage, searchQuery]);

  const fetchDrivers = async () => {
    try {
      const response = await axios.get('/admin/getPendingVehicles', {
        params: { page: currentPage, limit, searchQuery },
        withCredentials: true,
      });

      if (response.data.result.driver) {
        setDriversList(response.data.result.driver);
        setTotalPages(response.data.result.driverPage);
      } else {
        console.error('Error fetching drivers: No drivers found in the response.');
      }
    } catch (error) {
      console.error('Error fetching drivers:', error);
    }
  };

  const handleSearch = (e: any) => {
    setSearchQuery(e.target.value.toLowerCase());
    setCurrentPage(1); // Reset to first page on new search
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const approveVehicle = async (driverId: string, vehicleId: string) => {
    try {
      const response = await axios.patch(`/admin/approveVehicle/${driverId}/${vehicleId}`, {}, {
        withCredentials: true,
      });

      if(response.data.result.status === 200){
        const updatedDrivers = driversList.map(driver =>
          driver._id === driverId
            ? {
                ...driver,
                vehicles: driver.vehicles.map(vehicle =>
                  vehicle._id === vehicleId ? { ...vehicle, status: 'approved' } : vehicle
                ),
              }
            : driver
        );
        toast.success(response.data.result.message)
        setDriversList(updatedDrivers);
      }
    } catch (error) {
      console.error('Error approving vehicle:', error);
    }
  };

  const rejectVehicle = async (driverId: string, vehicleId: string) => {
    try {
      const response = await axios.patch(`/admin/rejectVehicle/${driverId}/${vehicleId}`, {}, {
        withCredentials: true,
      });

      if(response.data.result.status === 200){
        const updatedDrivers = driversList.map(driver =>
          driver._id === driverId
            ? {
                ...driver,
                vehicles: driver.vehicles.map(vehicle =>
                  vehicle._id === vehicleId ? { ...vehicle, status: 'rejected' } : vehicle
                ),
              }
            : driver
        );
        toast.success(response.data.result.message)
        setDriversList(updatedDrivers);
      }
    } catch (error) {
      console.error('Error rejecting vehicle:', error);
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
    return driversList.flatMap((driver) =>
      driver.vehicles
        .filter((vehicle) => vehicle.status === 'pending')
        .map((vehicle) => (
          <tr key={vehicle._id}>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm font-medium text-gray-900">
                {driver.name}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-500">{driver.email}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-500">{vehicle.brand}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-500">{vehicle.model}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <a href={vehicle.rcDocumentUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-900">
                View RC Document
              </a>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {vehicle.number}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                Pending Approval
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button
                onClick={() => approveVehicle(driver._id, vehicle._id)}
                className="px-3 py-1 rounded-md text-white bg-green-600 hover:bg-green-700 mr-2"
              >
                Approve
              </button>
              <button
                onClick={() => rejectVehicle(driver._id, vehicle._id)}
                className="px-3 py-1 rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                Reject
              </button>
            </td>
          </tr>
        ))
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gray">
      <div className="flex justify-between items-center mb-4 -mt-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-2xl font-semibold text-gray-800">Vehicle Review</h2>
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
                Driver Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Driver Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Brand
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Model
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                RC Document
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Approval Status
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

export default VehicleReviewListPage;
