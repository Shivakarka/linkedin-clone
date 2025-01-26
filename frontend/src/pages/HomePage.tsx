import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import Sidebar from "../components/Sidebar";
import { UserProfile, PostData } from "../types";
import PostCreation from "../components/PostCreation";
import { Users } from "lucide-react";
import RecommendedUser from "../components/RecommendedUser";
import Post from "../components/Post";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const { data: authUser } = useQuery<UserProfile>({ queryKey: ["authUser"] });

  const navigate = useNavigate();

  const { data: recommendedUsers, isPending: isRecommendationsPending } =
    useQuery({
      queryKey: ["recommendedUsers"],
      queryFn: async () => {
        const res = await axiosInstance.get("/users/suggestions");
        return res.data;
      },
    });

  const { data: posts, isPending: isPostPending } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await axiosInstance.get("/posts");
      return res.data;
    },
  });

  return authUser ? (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="hidden lg:block lg:col-span-1">
        <Sidebar user={authUser ?? ({} as UserProfile)} />
      </div>
      <div className="col-span-1 lg:col-span-2 order-first lg:order-none">
        <PostCreation user={authUser ?? ({} as UserProfile)} />
        {isPostPending ? (
          <span className="loading loading-bars loading-lg mx-[50%] my-[50%]"></span>
        ) : (
          posts?.map((post: PostData) => <Post key={post._id} post={post} />)
        )}
        {posts?.length === 0 && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="mb-6">
              <Users size={64} className="mx-auto text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              No Posts Yet
            </h2>
            <p className="text-gray-600 mb-6">
              Connect with others to start seeing posts in your feed!
            </p>
          </div>
        )}
      </div>
      {isRecommendationsPending && (
        <div className="col-span-1 lg:col-span-1 hidden lg:block">
          <span className="loading loading-bars loading-lg mx-[50%] my-[50%]"></span>
        </div>
      )}
      {recommendedUsers?.length > 0 && (
        <div className="col-span-1 lg:col-span-1 hidden lg:block">
          <div className="bg-secondary rounded-lg shadow p-4">
            <h2 className="font-semibold mb-4">People you may know</h2>
            {recommendedUsers?.map((user: UserProfile) => (
              <RecommendedUser key={user._id} user={user} />
            ))}
          </div>
        </div>
      )}
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center space-y-4 min-h-[70vh]">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to LinkedIn</h1>
        <p className="text-gray-600 mb-4">
          Connect with your friends and colleagues.
        </p>
      </div>
      <button
        onClick={() => navigate("/login")}
        className="bg-primary text-white px-4 py-2 rounded-lg"
      >
        Proceed to Login
      </button>
    </div>
  );
};

export default HomePage;
