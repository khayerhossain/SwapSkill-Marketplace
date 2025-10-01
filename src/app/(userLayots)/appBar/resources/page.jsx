"use client";
import { useState, useRef, useEffect } from "react";
import {
  Search,
  Heart,
  Bookmark,
  Share2,
  MessageCircle,
  Trash2,
  Image as ImageIcon,
  Video,
  Smile,
  X,
} from "lucide-react";
import EmojiPicker from "emoji-picker-react";

export default function Resources() {
  const [shareResource, setShareResource] = useState(null);
  const [resources, setResources] = useState([
  {
    id: 1,
    title: "React Best Practices 2025",
    tags: ["React", "JavaScript", "Frontend"],
    user: "John Doe",
    avatar: "https://i.pravatar.cc/40?img=1",
    likes: 120,
    link: "https://example.com/react-best-practices",
  },
  {
    id: 2,
    title: "Next.js 2025 Guide",
    tags: ["Next.js", "SSR", "Frontend"],
    user: "Raj",
    avatar: "https://i.pravatar.cc/40?img=2",
    likes: 95,
    link: "https://example.com/nextjs-guide",
  },
  {
    id: 3,
    title: "JavaScript ES2025 Features",
    tags: ["JavaScript", "ES2025", "Frontend"],
    user: "Alice",
    avatar: "https://i.pravatar.cc/40?img=3",
    likes: 80,
    link: "https://example.com/js-es2025",
  },
  {
    id: 4,
    title: "CSS Grid & Flexbox Tips",
    tags: ["CSS", "Flexbox", "Grid"],
    user: "Bob",
    avatar: "https://i.pravatar.cc/40?img=4",
    likes: 60,
    link: "https://example.com/css-grid-flexbox",
  },
  {
    id: 5,
    title: "TypeScript 2025 Deep Dive",
    tags: ["TypeScript", "JavaScript", "Frontend"],
    user: "Charlie",
    avatar: "https://i.pravatar.cc/40?img=5",
    likes: 110,
    link: "https://example.com/typescript-2025",
  },
  {
    id: 6,
    title: "Fullstack React & Node.js",
    tags: ["React", "Node.js", "Fullstack"],
    user: "David",
    avatar: "https://i.pravatar.cc/40?img=6",
    likes: 150,
    link: "https://example.com/fullstack-react-node",
  },
  ]);

  const [newPostText, setNewPostText] = useState("");
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [showEmojiModal, setShowEmojiModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredResources, setFilteredResources] = useState(resources);

  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  useEffect(() => {
    setFilteredResources(resources);
  }, [resources]);

  // Remove Resource
  const removeResource = (id) => {
    setResources(resources.filter((res) => res.id !== id));
  };

  // Add New Post
  const handleCreatePost = () => {
    if (!newPostText.trim() && !selectedMedia) return;

    const newResource = {
      id: resources.length + 1,
      title: newPostText,
      tags: ["New"],
      user: "A",
      avatar: "https://i.pravatar.cc/40?img=5",
      likes: 0,
      link: "#",
      media: selectedMedia,
    };

    setResources([newResource, ...resources]);
    setNewPostText("");
    setSelectedMedia(null);
  };

  // Handle File Select (image/video)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setSelectedMedia({
      url,
      type: file.type.startsWith("video") ? "video" : "image",
    });
  };

  // Handle Emoji Select
  const addEmoji = (emojiData) => {
    setNewPostText((prev) => prev + emojiData.emoji);
    setShowEmojiModal(false);
  };

  // Handle Search Button
  const handleSearch = () => {
    const query = searchQuery.toLowerCase();
    const filtered = resources.filter(
      (res) =>
        res.title.toLowerCase().includes(query) ||
        res.user.toLowerCase().includes(query) ||
        res.tags.some((tag) => tag.toLowerCase().includes(query))
    );
    setFilteredResources(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      {/* Hero Section */}
      <div className="text-left mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
          Resources
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Learn, Share, and Grow with the Community
        </p>
      </div>

      {/* Search Bar with Button */}
      <div className="flex w-full md:w-1/2 mb-6 gap-2">
        <div className="relative flex-1">
          <Search className="absolute top-2.5 left-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-l-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-400"
          />
        </div>
        <button
          onClick={handleSearch}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          Search
        </button>
      </div>

      {/* Post Create Box */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 mb-8">
        <div className="flex items-start gap-3 py-3">
          <img
            src="https://i.pravatar.cc/40?img=5"
            alt="User"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="text-sm font-semibold dark:text-white">A</p>
            <p className="text-xs dark:text-white">
              Share something with the community
            </p>
          </div>
        </div>

        <div className="flex-1">
          <textarea
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full resize-none bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
            rows={2}
          />

          {selectedMedia && (
            <div className="mt-3">
              {selectedMedia.type === "image" ? (
                <img
                  src={selectedMedia.url}
                  alt="preview"
                  className="w-40 rounded-lg"
                />
              ) : (
                <video
                  src={selectedMedia.url}
                  controls
                  className="w-60 rounded-lg"
                />
              )}
            </div>
          )}

          <div className="flex items-center justify-between mt-3">
            <div className="flex gap-4 text-gray-600 dark:text-gray-300">
              <input
                type="file"
                accept="image/*"
                ref={imageInputRef}
                className="hidden"
                onChange={handleFileChange}
              />
              <input
                type="file"
                accept="video/*"
                ref={videoInputRef}
                className="hidden"
                onChange={handleFileChange}
              />

              <button
                className="flex items-center gap-1 hover:text-indigo-600 cursor-pointer "
                onClick={() => imageInputRef.current.click()}
              >
                <ImageIcon className="w-5 h-5" /> Photo
              </button>

              <button
                className="flex items-center gap-1 hover:text-indigo-600 cursor-pointer "
                onClick={() => videoInputRef.current.click()}
              >
                <Video className="w-5 h-5" /> Video
              </button>

              <button
                type="button"
                className="flex items-center gap-1 hover:text-indigo-600 cursor-pointer "
                onClick={() => setShowEmojiModal(true)}
              >
                <Smile className="w-5 h-5" /> Feeling
              </button>
            </div>

            <button
              onClick={handleCreatePost}
              className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700 cursor-pointer "
            >
              Post
            </button>
          </div>
        </div>
      </div>

      {/* Emoji Modal */}
      {showEmojiModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50 ">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg relative ">
            <button
              className="absolute top-0 right-0 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer "
              onClick={() => setShowEmojiModal(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <EmojiPicker onEmojiClick={addEmoji} height={350} width={300} />
          </div>
        </div>
      )}

      {/* Resource Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.length > 0 ? (
          filteredResources.map((res) => (
            <div
              key={res.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 hover:shadow-lg transition relative"
            >
              <button
                onClick={() => removeResource(res.id)}
                className="absolute top-3 right-3 text-red-500 hover:text-red-700 cursor-pointer"
              >
                <Trash2 className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <img
                  src={res.avatar}
                  alt={res.user}
                  className="w-10 h-10 rounded-full"
                />
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {res.user}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {res.title}
              </h3>

              {res.media && (
                <div className="mb-3">
                  {res.media.type === "image" ? (
                    <img
                      src={res.media.url}
                      alt="post"
                      className="w-full rounded-lg"
                    />
                  ) : (
                    <video
                      src={res.media.url}
                      controls
                      className="w-full rounded-lg"
                    />
                  )}
                </div>
              )}

              <div className="flex flex-wrap gap-2 mb-4">
                {res.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="bg-indigo-100 text-indigo-600 dark:bg-indigo-800 dark:text-indigo-200 text-xs px-3 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">

                <div className="flex gap-5">
                <button className="flex items-center gap-1 hover:text-red-500 cursor-pointer">
                  <Heart className="w-5 h-5" /> {res.likes}
                </button>
                <button className="flex items-center gap-1 hover:text-green-500 cursor-pointer">
                  <MessageCircle className="w-5 h-5" />
                </button>
                <button className="flex items-center gap-1 hover:text-yellow-500 cursor-pointer ">
                  <Bookmark className="w-5 h-5" />
                </button>


                </div>

                <button
                  onClick={() => setShareResource(res)}
                  className="hover:text-blue-500 cursor-pointer"
                >
                  <Share2 className="w-5 h-5" />
                </button>

              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-300 col-span-full text-center">
            No resources found.
          </p>
        )}
      </div>
    </div>
  );
}
