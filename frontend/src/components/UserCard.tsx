import { Link } from "react-router-dom";
import { UserProfile } from "../types";
import { Trash } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

function UserCard({
  user,
  isConnection,
}: {
  user: UserProfile;
  isConnection: boolean;
}) {
  const queryClient = useQueryClient();

  const { mutate: removeConnection } = useMutation({
    mutationFn: async () => {
      await axiosInstance.delete(`/connections/${user._id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["connections"] });
      toast.success("Connection removed successfully");
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to remove connection");
    },
  });

  const handleRemoveConnection = () => {
    if (!window.confirm("Are you sure you want to remove this connection?"))
      return;
    removeConnection();
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center transition-all hover:shadow-md">
      <Link
        to={`/profile/${user.username}`}
        className="flex flex-col items-center"
      >
        <img
          src={user.profilePicture || "/avatar.png"}
          alt={user.name}
          className="w-24 h-24 rounded-full object-cover mb-4"
        />
        <h3 className="font-semibold text-lg text-center">{user.name}</h3>
      </Link>
      <p className="text-gray-600 text-center">{user.headline}</p>
      <p className="text-sm text-gray-500 mt-2">
        {user.connections?.length} connections
      </p>

      <div className="flex  items-center w-full mt-4 gap-5 ">
        <button className="mt-4 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors w-full">
          {isConnection ? "Connected" : "Connect"}
        </button>
        <button onClick={handleRemoveConnection} className="mt-3 text-red-500">
          <Trash className=""></Trash>
        </button>
      </div>
    </div>
  );
}

export default UserCard;
