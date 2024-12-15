/* eslint-disable @typescript-eslint/no-explicit-any */
import { FaEdit, FaTrash } from "react-icons/fa";

const AddressCard = ({
  address,
  onEdit,
  onDelete,
}: {
  address: any;
  onEdit: (id: any) => void;
  onDelete: (id: any) => void;
}) => {
  return (
    <div className="address-card border rounded-md p-4 shadow-sm bg-white flex flex-col space-y-2 my-4 ">
      <div className="address-details text-gray-700">
        <p className="font-semibold text-lg">{address.street}</p>
        <p>
          {address.city}, {address.state}, {address.postalCode}
        </p>
        <p>{address.country}</p>
      </div>

      <div className="actions flex justify-end space-x-3 mt-3">
        <button
          onClick={() => onEdit(address.id)}
          className="text-blue-500 hover:text-blue-700 flex items-center space-x-1"
        >
          <FaEdit className="text-lg" />
          <span>Edit</span>
        </button>
        <button
          onClick={() => onDelete(address.id)}
          className="text-red-500 hover:text-red-700 flex items-center space-x-1"
        >
          <FaTrash className="text-lg" />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
};

export default AddressCard;
