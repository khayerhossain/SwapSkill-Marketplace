"use client";

import { useState, useRef } from "react";
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
} from "lucide-react";

export default function CommunityFeed() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: { name: "John Doe", avatar: "https://i.pravatar.cc/40?img=1" },
      time: "2 hrs ago",
      text: "This is my first post in the community! Excited to connect with everyone 🎉",
      image: "https://i.ibb.co.com/rRmmppbQ/Gazprom-Space-systems.gif",
      reactions: 24,
    },
    {
      id: 2,
      user: { name: "Sarah Khan", avatar: "https://i.pravatar.cc/40?img=2" },
      time: "5 hrs ago",
      text: "Loving the new updates! 🚀",
      image: "https://i.ibb.co.com/rRmmppbQ/Gazprom-Space-systems.gif",
      reactions: 56,
    },
  ]);

  // Create post state
  const [content, setContent] = useState("");
  const [mediaPreview, setMediaPreview] = useState(null);
  const fileRef = useRef(null);

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return setMediaPreview(null);
    const url = URL.createObjectURL(file);
    setMediaPreview({ url, name: file.name, file });
  }

  function removeMedia() {
    if (mediaPreview?.url) URL.revokeObjectURL(mediaPreview.url);
    setMediaPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  function handlePost() {
    if (!content.trim() && !mediaPreview) return; // don't post empty
    const newPost = {
      id: Date.now(),
      user: { name: "You", avatar: "https://i.pravatar.cc/40?img=10" },
      time: "Just now",
      text: content,
      image: mediaPreview?.url || null,
      reactions: 0,
    };
    setPosts([newPost, ...posts]);
    setContent("");
    removeMedia();
  }

  return (
    <div className="space-y-6">
      {/* Create Post - Facebook-like card */}
      <div className="bg-white shadow rounded-2xl p-4 space-y-3">
        {/* top row: user + options */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://i.pravatar.cc/40?img=10"
              alt="you"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="text-sm font-semibold">You</p>
              <p className="text-xs text-gray-500">
                Share something with the community
              </p>
            </div>
          </div>

          <MoreHorizontal className="text-gray-500" />
        </div>

        {/* input area (textarea like) */}
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full min-h-[64px] resize-none px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
          />
        </div>

        {/* media preview (if any) */}
        {mediaPreview ? (
          <div className="relative">
            <img
              src={mediaPreview.url}
              alt={mediaPreview.name}
              className="w-full max-h-64 object-cover rounded-lg"
            />
            <button
              onClick={removeMedia}
              className="absolute top-2 right-2 bg-white/90 p-1 rounded-full shadow hover:bg-gray-100"
              aria-label="Remove media"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          </div>
        ) : null}

        {/* action row: icons left, Post button right */}
        <div className="flex items-center justify-between">
          {/* left icons */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <label className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
              <ImageIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Photo</span>
              <input
                ref={fileRef}
                onChange={handleFileChange}
                type="file"
                accept="image/*,video/*"
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={() => {
                // trigger file input for video as well (same input supports video)
                if (fileRef.current) fileRef.current.click();
              }}
              className="flex items-center gap-2 hover:text-green-600"
            >
              <Video className="w-5 h-5" />
              <span className="hidden sm:inline">Video</span>
            </button>

            <button className="flex items-center gap-2 hover:text-purple-600">
              <Smile className="w-5 h-5" />
              <span className="hidden sm:inline">Feeling</span>
            </button>
          </div>

          {/* Post button */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePost}
              className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
              disabled={!content.trim() && !mediaPreview}
            >
              Post
            </button>
          </div>
        </div>
      </div>

      {/* Posts list (existing posts) */}
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white shadow rounded-2xl p-4 space-y-3"
        >
          {/* header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={post.user.avatar}
                alt={post.user.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h4 className="font-semibold text-sm">{post.user.name}</h4>
                <p className="text-xs text-gray-500">{post.time}</p>
              </div>
            </div>

            <MoreHorizontal className="text-gray-500" />
          </div>

          {/* text */}
          {post.text && <p className="text-gray-700 text-sm">{post.text}</p>}

          {/* image */}
          {post.image && (
            <img
              src={post.image}
              alt="post"
              className="w-full rounded-lg object-cover"
            />
          )}

          {/* reaction count */}
          <div className="text-sm text-gray-600 border-b pb-2">
            <span className="inline-flex items-center gap-2">
              <ThumbsUp className="w-4 h-4" /> {post.reactions} reactions
            </span>
          </div>

          {/* actions */}
          <div className="flex gap-6 pt-2 text-gray-600">
            <button className="flex items-center gap-2 hover:text-blue-600">
              <ThumbsUp className="w-5 h-5" />{" "}
              <span className="hidden sm:inline">Like</span>
            </button>
            <button className="flex items-center gap-2 hover:text-green-600">
              <MessageCircle className="w-5 h-5" />{" "}
              <span className="hidden sm:inline">Comment</span>
            </button>
            <button className="flex items-center gap-2 hover:text-purple-600">
              <Share2 className="w-5 h-5" />{" "}
              <span className="hidden sm:inline">Share</span>
            </button>
            <button className="flex items-center gap-2 hover:text-pink-600 ml-auto">
              <Bookmark className="w-5 h-5" />{" "}
              <span className="hidden sm:inline">Save</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
