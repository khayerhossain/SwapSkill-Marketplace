
"use client";

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
  { icon: Heart, label: "Loved", color: "text-pink-500" },
  { icon: Zap, label: "Excited", color: "text-orange-400" },
  { icon: Frown, label: "Sad", color: "text-blue-400" },
  { icon: Angry, label: "Angry", color: "text-red-500" },
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

  // 🔹 Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axiosInstance.get("/posts");
        // Sort newest posts first (Just now → Older)
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

  // 🔹 Handle file selection (convert to Base64 for Cloudinary)
  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setMedia({
        url: reader.result, // Base64 string
        type: f.type.startsWith("video") ? "video" : "image",
      });
    };
    reader.readAsDataURL(f);
  };

  // 🔹 Remove media before posting
  const removeMedia = () => {
    setMedia(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  // 🔹 Create a new post
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
      console.error("Error creating post:", err);
    }
  };

  // 🔹 Delete a post
  const deletePost = async (id, postUserId) => {
    if (postUserId !== currentUser.id) return;
    const result = await Swal.fire({
      title: "Delete Post?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      background: "#1e1e1e",
      color: "#fff",
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/posts?id=${id}&userId=${currentUser.id}`);
        setPosts((prev) => prev.filter((p) => p._id !== id));
      } catch (err) {
        console.error("Error deleting post:", err);
      }
    }
  };

  // 🔹 Toggle like/unlike
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
      console.error("Error updating likes:", err);
    }
  };

  // 🔹 Add comment
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
      await axiosInstance.patch(`/posts?id=${postId}`, {
        comment: newComment,
      });
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  // 🔹 Format time ago
  const timeAgo = (time) => {
    const diff = Math.floor((new Date() - new Date(time)) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  return (
    <div className="min-h-screen text-gray-200 space-y-6 rounded-2xl">
      {/* Create Post Section */}
      <div className="bg-black/60 border border-gray-800 rounded-2xl p-4 space-y-3 shadow-lg">
        <div className="flex items-center gap-3">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="text-sm font-semibold">{currentUser.name}</p>
            <p className="text-xs text-gray-400">Share something with the community</p>
          </div>
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full resize-none p-2 bg-[#111111] rounded-lg text-sm focus:ring-2 focus:ring-blue-500 text-gray-200"
        />

        {feeling && (
          <div className="flex items-center gap-2 bg-[#2b2b2b] p-2 rounded">
            <feeling.icon className={`w-5 h-5 ${feeling.color}`} /> Feeling {feeling.label}
            <button onClick={() => setFeeling(null)} className="ml-auto">
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          </div>
        )}

        {media && (
          <div className="relative">
            {media.type === "video" ? (
              <video src={media.url} controls className="w-full rounded-lg" />
            ) : (
              <img src={media.url} className="w-full rounded-lg" />
            )}
            <button
              onClick={removeMedia}
              className="absolute top-2 right-2 bg-black/70 p-1 rounded-full"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="flex gap-4 text-sm text-gray-400">
            <label className="flex items-center gap-1 cursor-pointer hover:text-gray-200">
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
              className="flex items-center gap-1 hover:text-gray-200"
            >
              <Video className="w-5 h-5" /> Video
            </button>
            <div className="relative">
              <button
                onClick={() => setShowFeeling(!showFeeling)}
                className="flex items-center gap-1 hover:text-gray-200"
              >
                <Smile className="w-5 h-5" /> Feeling
              </button>
              {showFeeling && (
                <div className="absolute mt-2 bg-[#1f1f1f] border border-gray-700 shadow rounded p-2 z-10">
                  {FEELINGS.map((f) => (
                    <button
                      key={f.label}
                      onClick={() => {
                        setFeeling(f);
                        setShowFeeling(false);
                      }}
                      className="flex items-center gap-2 p-1 hover:bg-[#2b2b2b] w-full text-sm text-gray-200"
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
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full text-sm"
          >
            Post
          </button>
        </div>
      </div>

      {/* Posts Feed */}
      {posts.map((p) => {
        const liked = p.likes.includes(currentUser.id);
        const visibleComments = showAllComments[p._id]
          ? p.comments
          : p.comments.slice(0, 2);

        return (
          <div
            key={p._id}
            className="bg-black/60 border border-gray-800 rounded-2xl p-4 space-y-3 shadow-md"
          >
            <div className="flex gap-3 items-center">
              <img
                src={p.user?.avatar || "https://i.pravatar.cc/40"}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="text-sm font-semibold text-gray-100">{p.user?.name}</p>
                <p className="text-xs text-gray-500">{timeAgo(p.createdAt)}</p>
              </div>
              <div className="ml-auto relative">
                <button onClick={() => setMenuOpen(menuOpen === p._id ? null : p._id)}>
                  <MoreHorizontal className="text-gray-400 cursor-pointer" />
                </button>
                {menuOpen === p._id && p.user?.id === currentUser.id && (
                  <div className="absolute right-0 top-5 bg-[#1f1f1f] border border-gray-700 shadow rounded p-2 z-10 text-sm">
                    <button
                      onClick={() => deletePost(p._id, p.user.id)}
                      className="hover:bg-[#2a2a2a] px-2 py-1 text-red-500"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>

            {p.text && <p className="text-sm text-gray-200">{p.text}</p>}
            {p.media &&
              (p.media.type === "video" ? (
                <video src={p.media.url} controls className="w-full rounded-lg" />
              ) : (
                <img src={p.media.url} className="w-full rounded-lg" />
              ))}

            <div className="text-sm text-gray-400 border-b border-gray-700 pb-2 flex gap-4">
              <span>{p.likes.length} Likes</span>
              <span>{p.comments.length} Comments</span>
            </div>

            <div className="flex gap-6 pt-2 text-gray-400">
              <button
                onClick={() => toggleLike(p._id)}
                className={`flex items-center gap-1 ${liked ? "text-blue-500" : "hover:text-blue-400"}`}
              >
                <ThumbsUp className="w-4 h-4" /> Like
              </button>
              <div className="flex items-center gap-1 hover:text-gray-200 cursor-pointer">
                <MessageCircle className="w-4 h-4" /> Comment
              </div>
            </div>

            <div className="space-y-2">
              {visibleComments.map((c, index) => (
                <div key={c._id || c.id || index} className="flex gap-2 items-start">
                  <img src={c.user?.avatar || "https://i.pravatar.cc/40"} className="w-8 h-8 rounded-full" />
                  <div className="bg-[#2a2a2a] rounded-2xl px-3 py-1 flex-1">
                    <p className="text-sm font-semibold text-gray-100">{c.user?.name}</p>
                    <p className="text-sm text-gray-300">{c.text}</p>
                    <p className="text-xs text-gray-500">{timeAgo(c.time)}</p>
                  </div>
                </div>
              ))}

              {p.comments.length > 2 && !showAllComments[p._id] && (
                <button
                  onClick={() => setShowAllComments({ ...showAllComments, [p._id]: true })}
                  className="text-blue-500 text-sm"
                >
                  See more comments
                </button>
              )}

              <div className="flex gap-2 items-center">
                <img src={currentUser.avatar} className="w-8 h-8 rounded-full" />
                <input
                  value={comments[p._id] || ""}
                  onChange={(e) => setComments({ ...comments, [p._id]: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && addComment(p._id)}
                  placeholder="Write a comment..."
                  className="flex-1 px-3 py-1 bg-[#2a2a2a] rounded-full text-sm text-gray-200"
                />
                <button onClick={() => addComment(p._id)} disabled={!comments[p._id]?.trim()}>
                  <Send className="w-4 h-4 text-blue-500" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
