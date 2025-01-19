interface Experience {
  title: string;
  company: string;
  startDate: Date;
  endDate: Date;
  description: string;
}

interface Education {
  school: string;
  fieldOfStudy: string;
  startYear: number;
  endYear: number;
}

interface Connection {
  userId: string;
}

export interface UserProfile {
  _id?: string;
  name?: string;
  username?: string;
  email?: string;
  profilePicture?: string;
  coverPicture?: string;
  headline?: string;
  location?: string;
  about?: string;
  skills?: string[];
  experience?: Experience[];
  education?: Education[];
  connections?: Connection[];
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}

export interface Comment {
  content: string;
  user: UserProfile;
  createdAt: Date;
}

export interface PostData {
  author?: UserProfile;
  content?: string;
  image?: string;
  likes?: string[];
  comments?: Comment[];
  createdAt?: Date;
  updatedAt?: Date;
  _id?: string;
}

export interface NotificationData {
  recipient: UserProfile | string;
  type: "like" | "comment" | "connectionAccepted";
  relatedUser?: UserProfile;
  relatedPost: PostData;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
  _id: string;
}
