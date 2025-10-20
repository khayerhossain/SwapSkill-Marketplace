// "use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import axiosInstance from "@/lib/axiosInstance";
import {
  MoreHorizontal,
  ThumbsUp,
  MessageCircle,
  Image as ImageIcon,
  Video,
  Smile,
  Trash2,
  Send,
  Heart,
  Angry,
  Frown,
  Meh,
  Zap,
} from "lucide-react";

const FEELINGS = [
  { icon: Smile, label: "Happy", color: "text-yellow-400" },
  { icon: Heart, label: "Loved", color: "text-red-400" },
  { icon: Zap, label: "Excited", color: "text-orange-400" },
  { icon: Frown, label: "Sad", color: "text-blue-400" },
  { icon: Angry, label: "Angry", color: "text-red-600" },
  { icon: Meh, label: "Thoughtful", color: "text-gray-400" },
];

export default function CommunityFeed() {
  const { data: session } = useSession();
  const currentUser = {
    id: session?.user?.email || "guest",
    name: session?.user?.name || "Guest User",
    avatar: session?.user?.image || "https://i.pravatar.cc/40?img=10",
  };

  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [media, setMedia] = useState(null);
  const [feeling, setFeeling] = useState(null);
  const [showFeeling, setShowFeeling] = useState(false);
  const [comments, setComments] = useState({});
  const [showAllComments, setShowAllComments] = useState({});
  const [menuOpen, setMenuOpen] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axiosInstance.get("/posts");
        const sortedPosts = res.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setPosts(sortedPosts);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPosts();
  }, []);

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setMedia({
      url: URL.createObjectURL(f),
      type: f.type.startsWith("video") ? "video" : "image",
    });
  };

  const removeMedia = () => {
    if (media?.url) URL.revokeObjectURL(media.url);
    setMedia(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handlePost = async () => {
    if (!content.trim() && !media && !feeling) return;
    const newPost = {
      user: currentUser,
      text: content,
      media,
      feeling,
      likes: [],
      comments: [],
      createdAt: new Date(),
    };
    try {
      const { data } = await axiosInstance.post("/posts", newPost);
      setPosts((prev) => [data, ...prev]);
      setContent("");
      setMedia(null);
      setFeeling(null);
    } catch (err) {
      console.error(err);
    }
  };

  const deletePost = async (id, postUserId) => {
    if (postUserId !== currentUser.id) return;
    const result = await Swal.fire({
      title: "Delete Post?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/posts?id=${id}&userId=${currentUser.id}`);
        setPosts((prev) => prev.filter((p) => p._id !== id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const toggleLike = async (postId) => {
    setPosts((prev) =>
      prev.map((p) =>
        p._id === postId
          ? {
              ...p,
              likes: p.likes.includes(currentUser.id)
                ? p.likes.filter((l) => l !== currentUser.id)
                : [...p.likes, currentUser.id],
            }
          : p
      )
    );
    try {
      const post = posts.find((p) => p._id === postId);
      const liked = post.likes.includes(currentUser.id);
      const updatedLikes = liked
        ? post.likes.filter((l) => l !== currentUser.id)
        : [...post.likes, currentUser.id];
      await axiosInstance.patch(`/posts?id=${postId}`, { likes: updatedLikes });
    } catch (err) {
      console.error(err);
    }
  };

  const addComment = async (postId) => {
    const txt = comments[postId]?.trim();
    if (!txt) return;
    const newComment = {
      id: Date.now(),
      user: currentUser,
      text: txt,
      time: new Date(),
    };
    setPosts((prev) =>
      prev.map((p) =>
        p._id === postId ? { ...p, comments: [...p.comments, newComment] } : p
      )
    );
    setComments((prev) => ({ ...prev, [postId]: "" }));
    try {
      await axiosInstance.patch(`/posts?id=${postId}`, { comment: newComment });
    } catch (err) {
      console.error(err);
    }
  };

  const timeAgo = (time) => {
    const diff = Math.floor((new Date() - new Date(time)) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black  md:p-8 text-white space-y-6">
      {/* Create Post */}
      <div className="bg-black/50 backdrop-blur-md rounded-xl p-4 border border-gray-700 space-y-3">
        <div className="flex items-center gap-3">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="text-sm font-semibold">{currentUser.name}</p>
            <p className="text-xs text-gray-300">
              Share something with the community
            </p>
          </div>
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full resize-none bg-black/30 text-white rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-400 border border-gray-700"
          rows={2}
        />

        {feeling && (
          <div className="flex items-center gap-2 bg-gray-800/50 p-2 rounded">
            <feeling.icon className={`w-5 h-5 ${feeling.color}`} /> Feeling{" "}
            {feeling.label}
            <button onClick={() => setFeeling(null)} className="ml-auto">
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          </div>
        )}

        {media && (
          <div className="relative mt-2">
            {media.type === "video" ? (
              <video src={media.url} controls className="w-full rounded-lg" />
            ) : (
              <img src={media.url} className="w-full rounded-lg" />
            )}
            <button
              onClick={removeMedia}
              className="absolute top-2 right-2 bg-black/70 p-1 rounded-full"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          </div>
        )}

        <div className="flex justify-between items-center mt-2">
          <div className="flex gap-4 text-gray-300 text-sm">
            <label className="flex items-center gap-1 cursor-pointer">
              <ImageIcon className="w-5 h-5" /> Photo
              <input
                ref={fileRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleFile}
                className="hidden"
              />
            </label>
            <button
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-1"
            >
              <Video className="w-5 h-5" /> Video
            </button>
            <div className="relative">
              <button
                onClick={() => setShowFeeling(!showFeeling)}
                className="flex items-center gap-1"
              >
                <Smile className="w-5 h-5" /> Feeling
              </button>
              {showFeeling && (
                <div className="absolute mt-2 bg-black/80 text-white shadow rounded p-2 z-10 w-36">
                  {FEELINGS.map((f) => (
                    <button
                      key={f.label}
                      onClick={() => {
                        setFeeling(f);
                        setShowFeeling(false);
                      }}
                      className="flex items-center gap-2 p-1 hover:bg-gray-700 w-full text-sm rounded"
                    >
                      <f.icon className={`w-5 h-5 ${f.color}`} /> {f.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handlePost}
            disabled={!content.trim() && !media && !feeling}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg text-sm"
          >
            Post
          </button>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.map((p) => {
          const liked = p.likes.includes(currentUser.id);
          const visibleComments = showAllComments[p._id]
            ? p.comments
            : p.comments.slice(0, 2);

          return (
            <div
              key={p._id}
              className="bg-black/50 backdrop-blur-md rounded-xl p-4 border border-gray-700 space-y-3"
            >
              {/* Post Header */}
              <div className="flex items-center gap-3">
                <img
                  src={p.user?.avatar || "https://i.pravatar.cc/40"}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="text-sm font-semibold">{p.user?.name}</p>
                  <p className="text-xs text-gray-400">{timeAgo(p.createdAt)}</p>
                </div>
                <div className="ml-auto relative">
                  <button
                    onClick={() =>
                      setMenuOpen(menuOpen === p._id ? null : p._id)
                    }
                  >
                    <MoreHorizontal className="text-gray-400 cursor-pointer" />
                  </button>
                  {menuOpen === p._id && p.user?.id === currentUser.id && (
                    <div className="absolute right-0 top-5 bg-black/80 text-white shadow rounded p-2 z-10 text-sm">
                      <button
                        onClick={() => deletePost(p._id, p.user.id)}
                        className="hover:bg-gray-700 px-2 py-1 text-red-500 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Post Content */}
              {p.text && <p className="text-sm text-white">{p.text}</p>}
              {p.media &&
                (p.media.type === "video" ? (
                  <video
                    src={p.media.url}
                    controls
                    className="w-full rounded-lg mt-2"
                  />
                ) : (
                  <img
                    src={p.media.url}
                    className="w-full rounded-lg mt-2"
                    alt="post media"
                  />
                ))}

              {/* Post Stats */}
              <div className="text-sm text-gray-300 border-t border-gray-700 pt-2 flex gap-4">
                <span>{p.likes.length} Likes</span>
                <span>{p.comments.length} Comments</span>
              </div>

              {/* Post Actions */}
              <div className="flex gap-6 pt-2 text-gray-300">
                <button
                  onClick={() => toggleLike(p._id)}
                  className={`flex items-center gap-1 ${
                    liked ? "text-red-500" : "hover:text-red-500"
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" /> Like
                </button>
                <div className="flex items-center gap-1 hover:text-green-500 cursor-pointer">
                  <MessageCircle className="w-4 h-4" /> Comment
                </div>
              </div>

              {/* Comments */}
              <div className="space-y-2 mt-2">
                {visibleComments.map((c) => (
                  <div key={c.id} className="flex gap-2 items-start">
                    <img
                      src={c.user?.avatar || "https://i.pravatar.cc/40"}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="bg-gray-800/60 px-3 py-1 rounded-2xl flex-1">
                      <p className="text-sm font-semibold">{c.user?.name}</p>
                      <p className="text-sm text-white">{c.text}</p>
                      <p className="text-xs text-gray-400">{timeAgo(c.time)}</p>
                    </div>
                  </div>
                ))}
                {p.comments.length > 2 && !showAllComments[p._id] && (
                  <button
                    onClick={() =>
                      setShowAllComments({ ...showAllComments, [p._id]: true })
                    }
                    className="text-indigo-400 text-sm"
                  >
                    See more comments
                  </button>
                )}

                {/* Add Comment */}
                <div className="flex gap-2 items-center mt-2">
                  <img src={currentUser.avatar} className="w-8 h-8 rounded-full" />
                  <input
                    value={comments[p._id] || ""}
                    onChange={(e) =>
                      setComments({ ...comments, [p._id]: e.target.value })
                    }
                    onKeyDown={(e) => e.key === "Enter" && addComment(p._id)}
                    placeholder="Write a comment..."
                    className="flex-1 px-3 py-1 bg-black/30 text-white rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
                  />
                  <button
                    onClick={() => addComment(p._id)}
                    disabled={!comments[p._id]?.trim()}
                  >
                    <Send className="w-4 h-4 text-indigo-400" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

