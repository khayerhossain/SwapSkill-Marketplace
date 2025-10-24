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
import Loading from "@/app/loading";

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

   const [loading, setLoading] = useState(true);

  // Fetch resources
  const fetchResources = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/resources");
      setResources(res.data);
      setFilteredResources(res.data);
    } catch (error) {
      console.error("Error fetching resources:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleLike = async (id) => {
    if (!session?.user?.email)
      return Swal.fire("Login First", "You must log in to like posts.", "info");
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
                comments: [
                  ...(r.comments || []),
                  { userName: session.user.name, text },
                ],
              }
            : r
        )
      );

      setExpandedComments((prev) => ({ ...prev, [id]: true }));
      await fetchResources();
    } catch (error) {
      Swal.fire("Error", "Failed to comment!", "error");
    }
  };

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

  const handleShare = async (id) => {
    const shareUrl = `${window.location.origin}/resources/${id}`;
    Swal.fire({
      title: "Share this post",
      html: `<div style="display:flex; flex-direction:column; gap:10px; text-align:left; font-size:16px;">
        <a href="https://www.facebook.com/sharer/sharer.php?u=${shareUrl}" target="_blank" style="color:#1877F2;">Facebook</a>
        <a href="https://twitter.com/intent/tweet?url=${shareUrl}" target="_blank" style="color:#1DA1F2;">Twitter</a>
        <a href="https://api.whatsapp.com/send?text=${shareUrl}" target="_blank" style="color:#25D366;">WhatsApp</a>
        <button id="copyLink" style="padding:8px; background:#f4f4f4; border-radius:6px; cursor:pointer;">Copy Link</button>
      </div>`,
      showConfirmButton: false,
      width: 400,
      background: "#111827",
      color: "#fff",
    });

    Swal.getPopup()
      .querySelector("#copyLink")
      .addEventListener("click", async () => {
        await navigator.clipboard.writeText(shareUrl);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Link copied",
          showConfirmButton: false,
          timer: 1500,
        });
      });

    try {
      await axiosInstance.patch(`/resources/${id}`, { action: "share" });
      setResources((prev) =>
        prev.map((r) =>
          r._id === id ? { ...r, shares: (r.shares || 0) + 1 } : r
        )
      );
      await fetchResources();
    } catch (error) {
      console.error("Share count update failed:", error);
    }
  };

  const handleSave = async (id) => {
    if (!session?.user?.email)
      return Swal.fire("Login First", "You must log in to save posts.", "info");
    try {
      await axiosInstance.patch(`/resources/${id}`, {
        action: "save",
        userEmail: session.user.email,
      });

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Post saved",
        showConfirmButton: false,
        timer: 1500,
      });

      await fetchResources();
    } catch (error) {
      Swal.fire("Error", "Save failed!", "error");
    }
  };

  const toggleComments = (id) => {
    setExpandedComments((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (loading) {
    return (
       <div className="min-h-screen">
         <Loading />
     </div>
   );
  }




  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-4 md:p-8 text-white">
      {/* Hero */}
      <div className="text-left mb-10">
        <h1 className="text-3xl md:text-4xl font-bold">Resources</h1>
        <p className="text-gray-300 mt-2">
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
            className="w-full pl-10 pr-4 py-2 rounded-l-lg border border-gray-700 bg-black/40 text-white focus:ring-2 focus:ring-indigo-400"
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
      <div className="bg-black/50 backdrop-blur-md rounded-xl p-4 mb-8 border border-gray-700">
        <div className="flex items-start gap-3 py-3">
          <img
            src={session?.user?.image || "https://i.pravatar.cc/40?img=10"}
            alt={session?.user?.name || "User Avatar"}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="text-sm font-semibold">
              {session?.user?.name || "Guest User"}
            </p>
            <p className="text-xs text-gray-300">
              Share something with the resource
            </p>
          </div>
        </div>

        <div className="flex-1">
          <textarea
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full resize-none bg-black/30 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm border border-gray-700"
            rows={2}
          />

          {selectedMedia && (
            <div className="mt-3 overflow-hidden rounded-lg h-48 w-full">
              {selectedMedia.type === "image" ? (
                <img
                  src={selectedMedia.url}
                  alt="preview"
                  className="w-40 h-full object-cover rounded-lg"
                />
              ) : (
                <video
                  src={selectedMedia.url}
                  controls
                  className="w-60 h-full object-cover rounded-lg"
                />
              )}
            </div>
          )}

          <div className="flex items-center justify-between mt-3">
            <div className="flex gap-4 text-gray-300">
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
                className="flex items-center gap-1 hover:text-indigo-400 cursor-pointer"
                onClick={() => imageInputRef.current.click()}
              >
                <ImageIcon className="w-5 h-5" /> Photo
              </button>

              <button
                className="flex items-center gap-1 hover:text-indigo-400 cursor-pointer"
                onClick={() => videoInputRef.current.click()}
              >
                <Video className="w-5 h-5" /> Video
              </button>

              <button
                type="button"
                className="flex items-center gap-1 hover:text-indigo-400 cursor-pointer"
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
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-black/70 backdrop-blur-md rounded-2xl p-4 shadow-lg relative border border-indigo-700">
            <button
              className="absolute top-0 right-0 text-gray-400 hover:text-white cursor-pointer"
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
            const hasMedia = res.media?.url;

            return (
              <div
                key={res._id}
                className="bg-black/50 backdrop-blur-md text-white rounded-xl p-5 flex flex-col border border-gray-700"
              >
                {/* Delete */}
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
                  <span className="font-medium">{res.userName}</span>
                </div>

                {/* Title */}
                <div className="min-h-[3rem] text-lg font-semibold mb-2">
                  {res.title || "\u00A0"}
                </div>

                {/* Media */}
                {hasMedia && (
                  <div className="mb-3 overflow-hidden rounded-lg h-48 w-full">
                    {res.media.type.startsWith("image") ? (
                      <img
                        src={res.media.url}
                        alt="post"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <video
                        src={res.media.url}
                        controls
                        className="w-full h-full object-cover rounded-lg"
                      />
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-between items-center mt-auto min-h-[50px] border-t border-gray-700 pt-3 text-gray-300">
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

                    {/*<button
                      onClick={() => handleSave(res._id)}
                      className="flex items-center gap-1 hover:text-yellow-500 cursor-pointer"
                    >
                      <Bookmark className="w-5 h-5" />
                    </button>*/}

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
                      className="text-indigo-400 hover:underline cursor-pointer"
                    >
                      {expandedComments[res._id]
                        ? "Hide Comments"
                        : "View Comments"}
                    </button>
                  </div>
                )}

                {/* Show Comments */}
                {expandedComments[res._id] && res.comments?.length > 0 && (
                  <div className="mt-2 text-sm text-gray-300 border-t border-gray-700 pt-2">
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
          <p className="text-white col-span-full text-center">
            No resources found.
          </p>
        )}
      </div>
    </div>
  );
}
