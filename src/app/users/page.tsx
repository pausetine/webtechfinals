"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "@/lib/api";
import Link from "next/link";
import { Spinner, Alert} from "flowbite-react"; // Keep Spinner and Alert if you like them
import '../globals.css'; // Going one level up from 'users' to 'app'


const UsersPage = () => {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  if (isLoading) return <Spinner aria-label="Loading users..." />;
  if (error instanceof Error)
    return <Alert color="failure">Error: {error.message}</Alert>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-pink-700">User List</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users?.map((user = users) => (
          <div
          key={user.id}
           className="relative group user-card bg-pink-200 p-4 shadow-lg overflow-hidden"
>
          {/* Glitter GIF overlay */}
          <img
            src="/flower.gif" // Make sure this file is inside your /public folder
            alt="Glitter"
            className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-50 transition duration-300 pointer-events-none"
          />
        
          {/* Content */}
          <h3 className="text-xl font-semibold text-black relative z-10">{user.name}</h3>
          <p className="text-sm text-pink-600 relative z-10">Username: {user.username}</p>
          <p className="mt-2 text-sm text-gray-800 relative z-10">{user.email}</p>


          <Link href={`/users/${user.id}`} passHref>
      <button className="c-white bg-pink-500 hover:bg-pink-600 font-medium rounded-lg text-sm px-4 py-2 transition">
        View Profile
      </button>
    </Link>

        </div>
        ))}
      </div>
    </div>
  );
};

export default UsersPage;
