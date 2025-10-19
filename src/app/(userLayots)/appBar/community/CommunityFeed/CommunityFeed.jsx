"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
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
  { icon: Smile, label: "Happy", color: "text-yellow-500" },
  { icon: Heart, label: "Loved", color: "text-red-500" },
  { icon: Zap, label: "Excited", color: "text-orange-500" },
  { icon: Frown, label: "Sad", color: "text-blue-500" },
  { icon: Angry, label: "Angry", color: "text-red-600" },
  { icon: Meh, label: "Thoughtful", color: "text-gray-500" },
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
      const res = await fetch("/api/posts");
      const data = await res.json();
      // Make sure posts is an array
      setPosts(Array.isArray(data) ? data : data.posts || []);
    } catch (err) {
      console.error(err);
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
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      });
      const savedPost = await res.json();
      setPosts((prev) => [savedPost, ...prev]);
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
        const res = await fetch(`/api/posts?id=${id}&userId=${currentUser.id}`, { method: "DELETE" });
        if (res.ok) setPosts((prev) => prev.filter((p) => p._id !== id));
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
      const updatedLikes = liked ? post.likes.filter((l) => l !== currentUser.id) : [...post.likes, currentUser.id];
      await fetch(`/api/posts?id=${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ likes: updatedLikes }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const addComment = async (postId) => {
    const txt = comments[postId]?.trim();
    if (!txt) return;
    const newComment = { id: Date.now(), user: currentUser, text: txt, time: new Date() };

    setPosts((prev) =>
      prev.map((p) => (p._id === postId ? { ...p, comments: [...p.comments, newComment] } : p))
    );
    setComments((prev) => ({ ...prev, [postId]: "" }));

    try {
      await fetch(`/api/posts?id=${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment: newComment }),
      });
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
    <div className="space-y-6">
      {/* Create Post */}
      <div className="bg-white shadow rounded-2xl p-4 space-y-3">
        <div className="flex items-center gap-3">
          <img src={currentUser.avatar} alt={currentUser.name} className="w-10 h-10 rounded-full" />
          <div>
            <p className="text-sm font-semibold">{currentUser.name}</p>
            <p className="text-xs text-gray-500">Share something with the community</p>
          </div>
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full resize-none p-2 bg-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-blue-300"
        />
        {feeling && (
          <div className="flex items-center gap-2 bg-blue-50 p-2 rounded">
            <feeling.icon className={`w-5 h-5 ${feeling.color}`} /> Feeling {feeling.label}
            <button onClick={() => setFeeling(null)} className="ml-auto">
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          </div>
        )}
        {media && (
          <div className="relative">
            {media.type === "video" ? <video src={media.url} controls className="w-full rounded-lg" /> : <img src={media.url} className="w-full rounded-lg" />}
            <button onClick={removeMedia} className="absolute top-2 right-2 bg-white/80 p-1 rounded-full">
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          </div>
        )}
        <div className="flex justify-between items-center">
          <div className="flex gap-4 text-sm text-gray-600">
            <label className="flex items-center gap-1 cursor-pointer">
              <ImageIcon className="w-5 h-5" /> Photo
              <input ref={fileRef} type="file" accept="image/*,video/*" onChange={handleFile} className="hidden" />
            </label>
            <button onClick={() => fileRef.current?.click()} className="flex items-center gap-1">
              <Video className="w-5 h-5" /> Video
            </button>
            <div className="relative">
              <button onClick={() => setShowFeeling(!showFeeling)} className="flex items-center gap-1">
                <Smile className="w-5 h-5" /> Feeling
              </button>
              {showFeeling && (
                <div className="absolute mt-2 bg-white shadow rounded p-2 z-10">
                  {FEELINGS.map((f) => (
                    <button key={f.label} onClick={() => { setFeeling(f); setShowFeeling(false); }} className="flex items-center gap-2 p-1 hover:bg-gray-100 w-full text-sm">
                      <f.icon className={`w-5 h-5 ${f.color}`} /> {f.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <button onClick={handlePost} disabled={!content.trim() && !media && !feeling} className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm">
            Post
          </button>
        </div>
      </div>

      {/* Posts */}
      {posts.map((p) => {
        const liked = p.likes.includes(currentUser.id);
        const showComments = showAllComments[p._id] ? p.comments : p.comments.slice(0, 2);

        return (
          <div key={p._id} className="bg-white shadow rounded-2xl p-4 space-y-3">
            <div className="flex gap-3 items-center">
              <img src={p.user?.avatar || "https://i.pravatar.cc/40"} className="w-10 h-10 rounded-full" />
              <div>
                <p className="text-sm font-semibold">{p.user?.name}</p>
                <p className="text-xs text-gray-500">{timeAgo(p.createdAt)}</p>
              </div>
              <div className="ml-auto relative">
                <button onClick={() => setMenuOpen(menuOpen === p._id ? null : p._id)}>
                  <MoreHorizontal className="text-gray-500 cursor-pointer" />
                </button>
                {menuOpen === p._id && p.user?.id === currentUser.id && (
                  <div className="absolute right-0 top-5 bg-white shadow rounded p-2 z-10 text-sm">
                    <button onClick={() => deletePost(p._id, p.user.id)} className="hover:bg-gray-100 px-2 py-1 text-red-500">Delete</button>
                  </div>
                )}
              </div>
            </div>

            {p.text && <p className="text-sm">{p.text}</p>}
            {p.media && (p.media.type === "video" ? <video src={p.media.url} controls className="w-full rounded-lg" /> : <img src={p.media.url} className="w-full rounded-lg" />)}

            {/* Like + Comment count */}
            <div className="text-sm text-gray-600 border-b pb-2 flex gap-4">
              <span>{p.likes.length} Likes</span>
              <span>{p.comments.length} Comments</span>
            </div>

            {/* Like + Comment buttons */}
            <div className="flex gap-6 pt-2 text-gray-600">
              <button onClick={() => toggleLike(p._id)} className={`flex items-center gap-1 ${liked ? "text-blue-600" : "hover:text-blue-600"}`}>
                <ThumbsUp className="w-4 h-4" /> Like
              </button>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" /> Comment
              </div>
            </div>

            {/* Comments */}
            <div className="space-y-2">
              {showComments.map((c) => (
                <div key={c.id} className="flex gap-2 items-start relative">
                  <img src={c.user?.avatar || "https://i.pravatar.cc/40"} className="w-8 h-8 rounded-full" />
                  <div className="bg-gray-100 rounded-2xl px-3 py-1 flex-1">
                    <p className="text-sm font-semibold">{c.user?.name}</p>
                    <p className="text-sm">{c.text}</p>
                    <p className="text-xs text-gray-500">{timeAgo(c.time)}</p>
                  </div>
                </div>
              ))}
              {p.comments.length > 2 && !showAllComments[p._id] && (
                <button onClick={() => setShowAllComments({ ...showAllComments, [p._id]: true })} className="text-blue-600 text-sm">
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
                  className="flex-1 px-3 py-1 bg-gray-100 rounded-full text-sm"
                />
                <button onClick={() => addComment(p._id)} disabled={!comments[p._id]?.trim()}>
                  <Send className="w-4 h-4 text-blue-600" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}


