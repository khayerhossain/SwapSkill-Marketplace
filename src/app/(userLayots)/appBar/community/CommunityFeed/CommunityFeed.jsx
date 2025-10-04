"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  MoreHorizontal,
  ThumbsUp,
  MessageCircle,
  Share2,
  Bookmark,
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

  const [posts, setPosts] = useState([
    {
      id: 1,
      user: { name: "John Doe", avatar: "https://i.pravatar.cc/40?img=1" },
      time: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hrs ago
      text: "This is my first post in the community! Excited to connect with everyone 🎉",
      media: { url: "https://i.ibb.co.com/rRmmppbQ/Gazprom-Space-systems.gif", type: "image" },
      likes: [],
      comments: [],
    },
    {
      id: 2,
      user: { name: "Sarah Khan", avatar: "https://i.pravatar.cc/40?img=2" },
      time: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hrs ago
      text: "Loving the new updates! 🚀",
      media: { url: "https://i.ibb.co.com/rRmmppbQ/Gazprom-Space-systems.gif", type: "image" },
      likes: [],
      comments: [],
    },
  ]);

  const [content, setContent] = useState("");
  const [media, setMedia] = useState(null);
  const [feeling, setFeeling] = useState(null);
  const [showFeeling, setShowFeeling] = useState(false);
  const [comments, setComments] = useState({});
  const [showAllComments, setShowAllComments] = useState({});
  const [commentMenu, setCommentMenu] = useState({});
  const [editModal, setEditModal] = useState({ open: false, postId: null, comment: null });
  const fileRef = useRef(null);

  // Media upload
  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setMedia({ url: URL.createObjectURL(f), type: f.type.startsWith("video") ? "video" : "image" });
  };
  const removeMedia = () => {
    if (media?.url) URL.revokeObjectURL(media.url);
    setMedia(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  // Create Post
  const handlePost = () => {
    if (!content.trim() && !media) return;
    const newPost = {
      id: Date.now(),
      user: currentUser,
      time: new Date(),
      text: content,
      media,
      likes: [],
      comments: [],
    };
    setPosts([newPost, ...posts]);
    setContent("");
    setMedia(null);
    setFeeling(null);
  };

  // Like toggle
  const toggleLike = (id) => {
    setPosts(posts.map((p) =>
      p.id === id
        ? { ...p, likes: p.likes.includes(currentUser.id) ? p.likes.filter((l) => l !== currentUser.id) : [...p.likes, currentUser.id] }
        : p
    ));
  };

  // Comment add
  const addComment = (postId) => {
    const txt = comments[postId]?.trim();
    if (!txt) return;
    const newComment = { id: Date.now(), user: currentUser, text: txt, time: new Date() };
    setPosts(posts.map((p) => (p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p)));
    setComments({ ...comments, [postId]: "" });
  };

  // Comment delete
  const deleteComment = (postId, commentId) => {
    setPosts(posts.map((p) => (p.id === postId ? { ...p, comments: p.comments.filter((c) => c.id !== commentId) } : p)));
  };

  // Comment edit modal
  const openEditModal = (postId, comment) => setEditModal({ open: true, postId, comment });
  const saveEdit = (newText) => {
    if (!newText.trim()) return;
    setPosts(posts.map((p) =>
      p.id === editModal.postId
        ? { ...p, comments: p.comments.map((c) => (c.id === editModal.comment.id ? { ...c, text: newText } : c)) }
        : p
    ));
    setEditModal({ open: false, postId: null, comment: null });
  };

  // Force update every minute for live time ago
  const [, forceUpdate] = useState(0);
  useEffect(() => { const interval = setInterval(() => forceUpdate(v => v + 1), 60000); return () => clearInterval(interval); }, []);

  const timeAgo = (time) => {
    const diff = Math.floor((new Date() - time) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  return (
    <div className="space-y-6">
      {/* Create Post */}
      <div className="bg-white shadow rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={currentUser.avatar} alt={currentUser.name} className="w-10 h-10 rounded-full" />
            <div>
              <p className="text-sm font-semibold">{currentUser.name}</p>
              <p className="text-xs text-gray-500">Share something with the community</p>
            </div>
          </div>
          <MoreHorizontal className="text-gray-500" />
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
            <button onClick={() => setFeeling(null)} className="ml-auto"><Trash2 className="w-4 h-4 text-red-500" /></button>
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
              <input ref={fileRef} type="file" accept="image/,video/" onChange={handleFile} className="hidden" />
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
          <button onClick={handlePost} disabled={!content.trim() && !media} className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm">
            Post
          </button>
        </div>
      </div>

      {/* Posts */}
      {posts.map((p) => {
        const liked = p.likes.includes(currentUser.id);
        const commentCount = p.comments.length;
        const showComments = showAllComments[p.id] ? p.comments : p.comments.slice(0, 2);

        return (
          <div key={p.id} className="bg-white shadow rounded-2xl p-4 space-y-3">
            <div className="flex gap-3">
              <img src={p.user.avatar} className="w-10 h-10 rounded-full" />
              <div>
                <p className="text-sm font-semibold">{p.user.name}</p>
                <p className="text-xs text-gray-500">{timeAgo(p.time)}</p>
              </div>
              <MoreHorizontal className="ml-auto text-gray-500" />
            </div>

            {p.text && <p className="text-sm text-gray-700">{p.text}</p>}
            {p.media && (p.media.type === "video" ? <video src={p.media.url} controls className="w-full rounded-lg" /> : <img src={p.media.url} className="w-full rounded-lg" />)}

            <div className="text-sm text-gray-600 border-b pb-2 flex gap-4">
              <span>{p.likes.length} Likes</span>
              <span>{p.comments.length} Comments</span>
            </div>

            <div className="flex gap-6 pt-2 text-gray-600">
              <button onClick={() => toggleLike(p.id)} className={`flex items-center gap-1 ${liked ? "text-blue-600" : "hover:text-blue-600"}`}>
                <ThumbsUp className="w-4 h-4" /> Like
              </button>
              <div className="flex items-center gap-1"><MessageCircle className="w-4 h-4" /> Comment</div>
              <div className="flex items-center gap-1"><Share2 className="w-4 h-4" /> Share</div>
              <div className="ml-auto flex items-center gap-1"><Bookmark className="w-4 h-4" /> Save</div>
            </div>

            {/* Comments */}
            <div className="space-y-2">
              {showComments.map((c) => (
                <div key={c.id} className="flex gap-2 items-start relative">
                  <img src={c.user.avatar} className="w-8 h-8 rounded-full" />
                  <div className="bg-gray-100 rounded-2xl px-3 py-1 flex-1">
                    <p className="text-sm font-semibold">{c.user.name}</p>
                    <p className="text-sm">{c.text}</p>
                    <p className="text-xs text-gray-500">{timeAgo(c.time)}</p>
                  </div>
                  {c.user.id === currentUser.id && (
                    <div className="relative">
                      <button onClick={() => setCommentMenu({ ...commentMenu, [c.id]: !commentMenu[c.id] })} className="ml-1 text-gray-500 text-sm">...</button>
                      {commentMenu[c.id] && (
                        <div className="absolute right-0 top-4 bg-white shadow rounded p-2 z-10 flex flex-col text-sm">
                          <button className="hover:bg-gray-100 px-2 py-1" onClick={() => openEditModal(p.id, c)}>Edit</button>
                          <button className="hover:bg-gray-100 px-2 py-1 text-red-500" onClick={() => deleteComment(p.id, c.id)}>Delete</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {commentCount > 2 && !showAllComments[p.id] && (
                <button onClick={() => setShowAllComments({ ...showAllComments, [p.id]: true })} className="text-blue-600 text-sm">See more comments</button>
              )}

              <div className="flex gap-2 items-center">
                <img src={currentUser.avatar} className="w-8 h-8 rounded-full" />
                <input
                  value={comments[p.id] || ""}
                  onChange={(e) => setComments({ ...comments, [p.id]: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && addComment(p.id)}
                  placeholder="Write a comment..."
                  className="flex-1 px-3 py-1 bg-gray-100 rounded-full text-sm"
                />
                <button onClick={() => addComment(p.id)} disabled={!comments[p.id]?.trim()}>
                  <Send className="w-4 h-4 text-blue-600" />
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {/* Edit Modal */}
      {editModal.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-4 rounded-lg w-80">
            <h3 className="font-semibold mb-2">Edit Comment</h3>
            <textarea
              className="w-full p-2 border rounded mb-2"
              value={editModal.comment.text}
              onChange={(e) => setEditModal({ ...editModal, comment: { ...editModal.comment, text: e.target.value } })}
            />
            <div className="flex justify-end gap-2">
              <button className="px-3 py-1 bg-gray-300 rounded" onClick={() => setEditModal({ open: false, postId: null, comment: null })}>Cancel</button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => saveEdit(editModal.comment.text)}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}