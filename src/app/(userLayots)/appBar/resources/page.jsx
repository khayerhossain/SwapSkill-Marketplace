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
import axiosInstance from "@/lib/axiosInstance";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [newPostText, setNewPostText] = useState("");
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [showEmojiModal, setShowEmojiModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredResources, setFilteredResources] = useState([]);
  const [expandedComments, setExpandedComments] = useState({}); 

  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const { data: session } = useSession();


// Fetch resources
const fetchResources = async () => {
  try {
    const res = await axiosInstance.get("/resources");
    setResources(res.data);
    setFilteredResources(res.data);
  } catch (error) {
    console.error("Error fetching resources:", error);
  }
};

// first reload
useEffect(() => {
  fetchResources();
}, []);


  // Delete Resource
  const removeResource = async (id) => {
    try {
      await axiosInstance.delete(`/resources/${id}`);
      setResources(resources.filter((res) => res._id !== id));
      setFilteredResources(filteredResources.filter((res) => res._id !== id));
    } catch (error) {
      console.error("Error deleting resource:", error);
    }
  };

  // Create Post
  const handleCreatePost = async () => {
    if (!newPostText.trim() && !selectedMedia) return;

    if (!session?.user?.email) {
      alert("Please log in before posting.");
      return;
    }

    let mediaData = null;

    if (selectedMedia?.file) {
      try {
        const reader = new FileReader();
        const file = selectedMedia.file;

        const base64 = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result);
          reader.onerror = (err) => reject(err);
          reader.readAsDataURL(file);
        });

        mediaData = { base64, type: selectedMedia.type };
      } catch (error) {
        console.error("Error reading file:", error);
        return;
      }
    }

    const newResource = {
      userEmail: session.user.email,
      userName: session.user.name,
      userAvatar: session.user.image || "https://i.pravatar.cc/40?img=10",
      title: newPostText,
      media: mediaData,
      likes: 0,
      comments: [],
      shares: 0,
    };

    try {
      const res = await axiosInstance.post("/resources", newResource);
      const added = { ...newResource, _id: res.data.insertedId };
      setResources([added, ...resources]);
      setFilteredResources([added, ...filteredResources]);
      setNewPostText("");
      setSelectedMedia(null);

      await fetchResources();

    } catch (error) {
      console.error("Error adding resource:", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setSelectedMedia({
      file,
      url,
      type: file.type.startsWith("video") ? "video" : "image",
    });
  };

  const addEmoji = (emojiData) => {
    setNewPostText((prev) => prev + emojiData.emoji);
    setShowEmojiModal(false);
  };

  const handleSearch = () => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      setFilteredResources(resources);
      return;
    }

    const filtered = resources.filter((res) =>
      res.title?.toLowerCase().includes(query)
    );
    setFilteredResources(filtered);
  };

  // Like
  const handleLike = async (id) => {
    if (!session?.user?.email)
      return Swal.fire(
        "Login First",
        "You must log in to like posts.",
        "info"
      );
    try {
      await axiosInstance.patch(`/resources/${id}`, {
        action: "like",
        userEmail: session.user.email,
      });
      setResources((prev) =>
        prev.map((r) =>
          r._id === id ? { ...r, likes: (r.likes || 0) + 1 } : r
        )
      );
      await fetchResources();
    } catch (error) {
      console.error("Like failed:", error);
    }
  };

  // Comment
  const handleComment = async (id, text) => {
    if (!session?.user?.name)
      return Swal.fire("Login Required", "Please log in to comment.", "info");
    try {
      await axiosInstance.patch(`/resources/${id}`, {
        action: "comment",
        userName: session.user.name,
        commentText: text,
      });

      setResources((prev) =>
        prev.map((r) =>
          r._id === id
            ? {
                ...r,
                comments: [...(r.comments || []), { userName: session.user.name, text }],
              }
            : r
        )
      );

      // Auto-expand comments after posting
      setExpandedComments((prev) => ({ ...prev, [id]: true }));

      
      await fetchResources();
    } catch (error) {
      Swal.fire("Error", "Failed to comment!", "error");
    }
  };

  // SweetAlert comment input
  const openCommentBox = (id) => {
    Swal.fire({
      title: "Write a comment",
      input: "text",
      inputPlaceholder: "Type your comment...",
      showCancelButton: true,
      confirmButtonText: "Post",
    }).then((result) => {
      if (result.isConfirmed && result.value.trim() !== "") {
        handleComment(id, result.value);
      }
    });
  };

 //Share
  const handleShare = async (id) => {
  const shareUrl = `${window.location.origin}/resources/${id}`;

  Swal.fire({
    title: "Share this post",
    html: `
      <div style="display:flex; flex-direction:column; gap:14px; text-align:left; font-size:16px;">
        <a href="https://www.facebook.com/sharer/sharer.php?u=${shareUrl}" target="_blank" style="display:flex; align-items:center; gap:8px; text-decoration:none; color:#1877F2;">
          <svg xmlns="http://www.w3.org/2000/svg" class="lucide lucide-facebook" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
          Share on Facebook
        </a>

        <a href="https://twitter.com/intent/tweet?url=${shareUrl}" target="_blank" style="display:flex; align-items:center; gap:8px; text-decoration:none; color:#1DA1F2;">
          <svg xmlns="http://www.w3.org/2000/svg" class="lucide lucide-twitter" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.43.36a9 9 0 0 1-2.83 1.08A4.48 4.48 0 0 0 16.11 0c-2.5 0-4.5 2.24-4.5 5a5.33 5.33 0 0 0 .11 1.14A12.94 12.94 0 0 1 1.67.89a5.22 5.22 0 0 0-.61 2.52c0 1.74.86 3.28 2.17 4.18A4.41 4.41 0 0 1 .8 7.3v.06c0 2.44 1.63 4.47 3.8 4.93a4.52 4.52 0 0 1-2.04.08c.58 1.9 2.24 3.29 4.2 3.33A9 9 0 0 1 0 18.54a12.94 12.94 0 0 0 7 2.06c8.39 0 13-7.42 13-13.86 0-.21 0-.42-.02-.63A9.4 9.4 0 0 0 23 3z"/></svg>
          Share on Twitter
        </a>

        <a href="https://api.whatsapp.com/send?text=${shareUrl}" target="_blank" style="display:flex; align-items:center; gap:8px; text-decoration:none; color:#25D366;">
          <svg xmlns="http://www.w3.org/2000/svg" class="lucide lucide-message-circle" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z"/></svg>
          Share on WhatsApp
        </a>

        <button id="copyLink" style="display:flex; align-items:center; gap:8px; padding:8px 12px; background:#f4f4f4; border:none; border-radius:6px; cursor:pointer; font-size:15px;">
          <svg xmlns="http://www.w3.org/2000/svg" class="lucide lucide-link" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 1 0-7l1-1a5 5 0 0 1 7 7l-1 1M14 11a5 5 0 0 1 0 7l-1 1a5 5 0 0 1-7-7l1-1"/></svg>
          Copy Link
        </button>
      </div>
    `,
    showConfirmButton: false,
    width: 400,
    background: "#fff",
  });

  //  Copy Link Handler
  Swal.getPopup().querySelector("#copyLink").addEventListener("click", async () => {
    await navigator.clipboard.writeText(shareUrl);
    
    Swal.fire({
  position: "top-end",
  icon: "success",
  title: "Successfully link copied",
  showConfirmButton: false,
  timer: 1500
});
  });

  //  backend share count update
  try {
    await axiosInstance.patch(`/resources/${id}`, { action: "share" });
    setResources((prev) =>
      prev.map((r) => (r._id === id ? { ...r, shares: (r.shares || 0) + 1 } : r))
    );
    await fetchResources();
  } catch (error) {
    console.error("Share count update failed:", error);
  }
};



  // Save
  const handleSave = async (id) => {
    if (!session?.user?.email)
      return Swal.fire(
        "Login First",
        "You must log in to save posts.",
        "info"
      );
    try {
      await axiosInstance.patch(`/resources/${id}`, {
        action: "save",
        userEmail: session.user.email,
      });

     Swal.fire({
    position: "top-end",
    icon: "success",
    title: "Post has been saved successfully",
    showConfirmButton: false,
    timer: 1500
    });

      await fetchResources();
    } catch (error) {
      Swal.fire("Error", "Save failed!", "error");
    }
  };

  // Toggle comment visibility
  const toggleComments = (id) => {
    setExpandedComments((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      {/* Hero */}
      <div className="text-left mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Resources
        </h1>
        <p className="text-gray-600  mt-2">
          Learn, Share, and Grow with the community
        </p>
      </div>

      {/* Search */}
      <div className="flex w-full md:w-1/2 mb-6 gap-2">
        <div className="relative flex-1">
          <Search className="absolute top-2.5 left-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-l-lg border border-gray-300 dark:border-gray-700 bg-white  text-gray-900  focus:ring-2 focus:ring-indigo-400"
          />
        </div>
        <button
          onClick={handleSearch}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 cursor-pointer"
        >
          Search
        </button>
      </div>

      {/* Create Post */}
      <div className="bg-white  rounded-xl shadow p-4 mb-8">
        <div className="flex items-start gap-3 py-3">
          <img
            src={session?.user?.image || "https://i.pravatar.cc/40?img=10"}
            alt={session?.user?.name || "User Avatar"}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="text-sm font-semibold ">
              {session?.user?.name || "Guest User"}
            </p>
            <p className="text-xs ">
              Share something with the resource
            </p>
          </div>
        </div>

        <div className="flex-1">
          <textarea
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full resize-none bg-gray-100  text-gray-800  rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm border border-gray-300"
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
            <div className="flex gap-4 text-gray-600 ">
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
                className="flex items-center gap-1 hover:text-indigo-600 cursor-pointer"
                onClick={() => imageInputRef.current.click()}
              >
                <ImageIcon className="w-5 h-5" /> Photo
              </button>

              <button
                className="flex items-center gap-1 hover:text-indigo-600 cursor-pointer"
                onClick={() => videoInputRef.current.click()}
              >
                <Video className="w-5 h-5" /> Video
              </button>

              <button
                type="button"
                className="flex items-center gap-1 hover:text-indigo-600 cursor-pointer"
                onClick={() => setShowEmojiModal(true)}
              >
                <Smile className="w-5 h-5" /> Feeling
              </button>
            </div>

            <button
              onClick={handleCreatePost}
              className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700 cursor-pointer"
            >
              Post
            </button>
          </div>
        </div>
      </div>

      {/* Emoji Picker */}
      {showEmojiModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
          <div className="bg-white  rounded-2xl p-4 shadow-lg relative border border-indigo-700">
            <button
              className="absolute top-0 right-0 text-gray-500 hover:text-gray-800  cursor-pointer"
              onClick={() => setShowEmojiModal(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <EmojiPicker onEmojiClick={addEmoji} height={350} width={300} />
          </div>
        </div>
      )}

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.length > 0 ? (
          filteredResources.map((res) => {
            const hasMedia =
              res.media?.url &&
              (res.media?.type?.startsWith("image") ||
                res.media?.type?.startsWith("video"));

            return (
              <div
                key={res._id}
                className="bg-white  rounded-xl shadow p-5 hover:shadow-lg transition relative border border-gray-300 flex flex-col"
              >
                {/* User Delete */}
                {session?.user?.email === res.userEmail && (
                 <button
                   onClick={() => removeResource(res._id)}
                   className="absolute top-3 right-3 text-red-500 hover:text-red-700 cursor-pointer"
                   >
                    <Trash2 className="w-5 h-5" />
                </button>
                 )}


                {/* User Info */}
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={res.userAvatar}
                    alt={res.userName}
                    className="w-10 h-10 rounded-full"
                  />
                  <span className="font-medium text-gray-900 ">
                    {res.userName}
                  </span>
                </div>

                {/* Title */}
                <div
                  className={`${
                    hasMedia
                      ? "text-lg font-semibold text-gray-900  mb-2"
                      : "flex-1 flex items-center justify-center text-center text-lg font-semibold text-gray-900 "
                  }`}
                >
                  {res.title}
                </div>

                {/* Media */}
                {hasMedia && (
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

                {/* Actions */}
                <div className="flex justify-between items-center text-gray-600  mt-auto min-h-[50px] border-t border-gray-200 dark:border-gray-700 pt-3">
                  <div className="flex gap-5">
                    <button
                      onClick={() => handleLike(res._id)}
                      className="flex items-center gap-1 hover:text-red-500 cursor-pointer"
                    >
                      <Heart className="w-5 h-5" /> {res.likes || 0}
                    </button>

                    <button
                      onClick={() => openCommentBox(res._id)}
                      className="flex items-center gap-1 hover:text-green-500 cursor-pointer"
                    >
                      <MessageCircle className="w-5 h-5" />{" "}
                      {res.comments?.length || 0}
                    </button>

                    <button
                      onClick={() => handleSave(res._id)}
                      className="flex items-center gap-1 hover:text-yellow-500 cursor-pointer"
                    >
                      <Bookmark className="w-5 h-5" />
                    </button>
                  </div>

                  <button
                    onClick={() => handleShare(res._id)}
                    className="flex items-center gap-1 hover:text-blue-500 cursor-pointer"
                  >
                    <Share2 className="w-5 h-5" /> {res.shares || 0}
                  </button>
                </div>

                {/* Toggle Comments */}
                {res.comments?.length > 0 && (
                  <div className="mt-2 text-sm">
                    <button
                      onClick={() => toggleComments(res._id)}
                      className="text-indigo-600 hover:underline cursor-pointer"
                    >
                      {expandedComments[res._id] ? "Hide Comments" : "View Comments"}
                    </button>
                  </div>
                )}

                {/* Show Comments */}
                {expandedComments[res._id] &&
                  res.comments?.length > 0 && (
                    <div className="mt-2 text-sm text-gray-600  border-t border-gray-200 dark:border-gray-700 pt-2">
                      {res.comments.map((c, i) => (
                        <p key={i} className="mb-1">
                          <strong>{c.userName}:</strong> {c.text}
                        </p>
                      ))}
                    </div>
                  )}
              </div>
            );
          })
        ) : (
          <p className="text-gray-900  col-span-full text-center">
            No resources found.
          </p>
        )}
      </div>
    </div>
  );
}
