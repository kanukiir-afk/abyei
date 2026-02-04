"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../components/AuthProvider";
import { api } from "../../lib/api";

type Tab = "dashboard" | "users" | "news" | "events" | "members";

interface Stats {
  users: number;
  events: number;
  news: number;
  members: number;
}

interface NewMember {
  fullName: string;
  phone: string;
  tribe: string;
  interests: string;
}

interface NewNewsForm {
  title: string;
  slug: string;
  content: string;
  image: string;
  categories: string;
  tags: string;
}

interface NewEventForm {
  title: string;
  description: string;
  location: string;
  address: string;
  startAt: string;
  endAt: string;
}

export default function AdminPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [stats, setStats] = useState<Stats>({ users: 0, events: 0, news: 0, members: 0 });
  const [users, setUsers] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showAddNews, setShowAddNews] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newMember, setNewMember] = useState<NewMember>({ fullName: "", phone: "", tribe: "", interests: "" });
  const [newNewsForm, setNewNewsForm] = useState<NewNewsForm>({ title: "", slug: "", content: "", image: "", categories: "", tags: "" });
  const [newEventForm, setNewEventForm] = useState<NewEventForm>({ title: "", description: "", location: "", address: "", startAt: "", endAt: "" });
  const [addingMember, setAddingMember] = useState(false);
  const [addingNews, setAddingNews] = useState(false);
  const [addingEvent, setAddingEvent] = useState(false);

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersRes, newsRes, eventsRes] = await Promise.all([
        api.get("/api/admin/users"),
        api.get("/api/news"),
        api.get("/api/events")
      ]);

      const usersData = usersRes.data.users || [];
      const newsData = newsRes.data.items || [];
      const eventsData = eventsRes.data.upcoming || [];
      const membersData = usersData.filter((u: any) => u.role === "MEMBER");

      setUsers(usersData);
      setNews(newsData);
      setEvents(eventsData);
      setMembers(membersData);
      setStats({
        users: usersData.length,
        events: eventsData.length,
        news: newsData.length,
        members: membersData.length
      });
    } catch (err) {
      console.error("Error loading admin data:", err);
    }
    setLoading(false);
  };

  const approveUser = async (userId: string) => {
    try {
      await api.post(`/api/admin/users/${userId}/approve`);
      await loadData();
    } catch (err) {
      console.error("Error approving user:", err);
    }
  };

  const updateUserRole = async (userId: string, role: string) => {
    try {
      await api.post(`/api/admin/users/${userId}/role`, { role });
      await loadData();
    } catch (err) {
      console.error("Error updating role:", err);
    }
  };

  const addNewMember = async () => {
    if (!newMember.fullName.trim()) {
      alert("Please enter a full name");
      return;
    }

    setAddingMember(true);
    try {
      await api.post("/api/members/register", {
        fullName: newMember.fullName,
        phone: newMember.phone || undefined,
        tribe: newMember.tribe || undefined,
        interests: newMember.interests || undefined
      });
      alert("Member added successfully!");
      setNewMember({ fullName: "", phone: "", tribe: "", interests: "" });
      setShowAddMember(false);
      await loadData();
    } catch (err: any) {
      alert(err?.response?.data?.error || "Error adding member");
    }
    setAddingMember(false);
  };

  const removeMember = async (memberId: string) => {
    if (!confirm("Are you sure you want to remove this member?")) return;

    try {
      // Since there's no delete endpoint, we can mark them as unapproved
      await api.post(`/api/admin/users/${memberId}/approve`, { approved: false });
      alert("Member removed!");
      await loadData();
    } catch (err) {
      console.error("Error removing member:", err);
      alert("Error removing member");
    }
  };

  const addNews = async () => {
    if (!newNewsForm.title.trim() || !newNewsForm.slug.trim() || !newNewsForm.content.trim()) {
      alert("Please fill in title, slug, and content");
      return;
    }

    setAddingNews(true);
    try {
      await api.post("/api/news", {
        title: newNewsForm.title,
        slug: newNewsForm.slug,
        content: newNewsForm.content,
        image: newNewsForm.image || undefined,
        categories: newNewsForm.categories ? newNewsForm.categories.split(",").map(c => c.trim()) : [],
        tags: newNewsForm.tags ? newNewsForm.tags.split(",").map(t => t.trim()) : [],
        published: true
      });
      alert("News article created successfully!");
      setNewNewsForm({ title: "", slug: "", content: "", image: "", categories: "", tags: "" });
      setShowAddNews(false);
      await loadData();
    } catch (err: any) {
      alert(err?.response?.data?.error || "Error creating news");
    }
    setAddingNews(false);
  };

  const addEvent = async () => {
    if (!newEventForm.title.trim() || !newEventForm.description.trim() || !newEventForm.startAt) {
      alert("Please fill in title, description, and start date");
      return;
    }

    setAddingEvent(true);
    try {
      await api.post("/api/events", {
        title: newEventForm.title,
        description: newEventForm.description,
        location: newEventForm.location || undefined,
        address: newEventForm.address || undefined,
        startAt: newEventForm.startAt,
        endAt: newEventForm.endAt || undefined,
        published: true
      });
      alert("Event created successfully!");
      setNewEventForm({ title: "", description: "", location: "", address: "", startAt: "", endAt: "" });
      setShowAddEvent(false);
      await loadData();
    } catch (err: any) {
      alert(err?.response?.data?.error || "Error creating event");
    }
    setAddingEvent(false);
  };

  const deleteNews = async (newsId: string) => {
    if (!confirm("Are you sure you want to delete this news article?")) return;

    try {
      await api.delete(`/api/news/${newsId}`);
      alert("News deleted!");
      await loadData();
    } catch (err) {
      console.error("Error deleting news:", err);
      alert("Error deleting news");
    }
  };

  const deleteEvent = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      await api.delete(`/api/events/${eventId}`);
      alert("Event deleted!");
      await loadData();
    } catch (err) {
      console.error("Error deleting event:", err);
      alert("Error deleting event");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="bg-white p-8 rounded-lg shadow-xl text-center">
          <h1 className="text-2xl font-bold mb-4">Admin Access Required</h1>
          <p className="text-slate-600 mb-6">Please log in to access the admin dashboard</p>
          <a href="/login" className="inline-block bg-sscAccent text-white px-6 py-2 rounded-lg font-medium hover:bg-opacity-90 transition">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-sm text-slate-600 mt-1">Manage your community site</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900">{user.email}</p>
              <p className="text-xs text-slate-500">{user.role}</p>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: "Total Users", value: stats.users, icon: "👥", color: "blue" },
              { label: "Members", value: stats.members, icon: "🙋", color: "green" },
              { label: "News Posts", value: stats.news, icon: "📰", color: "purple" },
              { label: "Events", value: stats.events, icon: "📅", color: "orange" }
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-sscAccent hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-slate-600 text-sm font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
                  </div>
                  <span className="text-3xl">{stat.icon}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-200">
          {(["dashboard", "users", "members", "news", "events"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-medium border-b-2 transition ${
                activeTab === tab
                  ? "border-sscAccent text-sscAccent"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content Sections */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin text-4xl">⏳</div>
            <p className="mt-4 text-slate-600">Loading...</p>
          </div>
        ) : (
          <>
            {/* Users Tab */}
            {activeTab === "users" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Manage Users</h2>
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {users.length === 0 ? (
                    <p className="text-slate-500 text-center py-8">No users yet</p>
                  ) : (
                    users.map((u) => (
                      <div
                        key={u.id}
                        className="flex justify-between items-center p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900">{u.name || u.email}</p>
                          <p className="text-sm text-slate-500">{u.email}</p>
                          <div className="flex gap-2 mt-2">
                            <span className="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded">
                              {u.role}
                            </span>
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                u.approved
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {u.approved ? "✓ Approved" : "⏳ Pending"}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {!u.approved && (
                            <button
                              onClick={() => approveUser(u.id)}
                              className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition"
                            >
                              Approve
                            </button>
                          )}
                          <select
                            defaultValue={u.role}
                            onChange={(e) => updateUserRole(u.id, e.target.value)}
                            className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm font-medium hover:border-slate-400 transition"
                          >
                            <option value="ADMIN">Admin</option>
                            <option value="EDITOR">Editor</option>
                            <option value="MEMBER">Member</option>
                          </select>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Members Tab */}
            {activeTab === "members" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">Community Members</h2>
                  <button
                    onClick={() => setShowAddMember(!showAddMember)}
                    className="px-4 py-2 bg-sscAccent text-white rounded-lg font-medium hover:bg-opacity-90 transition"
                  >
                    {showAddMember ? "✕ Cancel" : "+ Add Member"}
                  </button>
                </div>

                {/* Add Member Form */}
                {showAddMember && (
                  <div className="mb-6 p-6 bg-slate-50 rounded-lg border border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Add New Member</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
                        <input
                          type="text"
                          placeholder="Enter full name"
                          value={newMember.fullName}
                          onChange={(e) => setNewMember({ ...newMember, fullName: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sscAccent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                        <input
                          type="tel"
                          placeholder="Phone number"
                          value={newMember.phone}
                          onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sscAccent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Tribe</label>
                        <input
                          type="text"
                          placeholder="Tribe (optional)"
                          value={newMember.tribe}
                          onChange={(e) => setNewMember({ ...newMember, tribe: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sscAccent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Interests</label>
                        <input
                          type="text"
                          placeholder="Interests (optional)"
                          value={newMember.interests}
                          onChange={(e) => setNewMember({ ...newMember, interests: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sscAccent"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={addNewMember}
                        disabled={addingMember}
                        className="px-6 py-2 bg-sscAccent text-white rounded-lg font-medium hover:bg-opacity-90 transition disabled:opacity-50"
                      >
                        {addingMember ? "Adding..." : "Add Member"}
                      </button>
                      <button
                        onClick={() => setShowAddMember(false)}
                        className="px-6 py-2 bg-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-400 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Members List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto">
                  {members.length === 0 ? (
                    <p className="text-slate-500 col-span-full text-center py-8">No members yet</p>
                  ) : (
                    members.map((m) => (
                      <div key={m.id} className="p-5 bg-gradient-to-br from-blue-50 to-slate-50 rounded-lg border-2 border-slate-200 hover:border-sscAccent transition">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <p className="font-bold text-slate-900 text-lg">{m.name || "Unknown"}</p>
                            <p className="text-sm text-slate-600">{m.email}</p>
                          </div>
                          <button
                            onClick={() => removeMember(m.id)}
                            className="text-red-500 hover:text-red-700 font-bold text-xl hover:bg-red-100 w-8 h-8 rounded flex items-center justify-center transition"
                            title="Remove member"
                          >
                            ✕
                          </button>
                        </div>

                        <div className="space-y-2 text-sm">
                          {m.phone && (
                            <div className="flex items-center text-slate-700">
                              <span className="mr-2">📱</span>
                              <span>{m.phone}</span>
                            </div>
                          )}
                          {m.member?.tribe && (
                            <div className="flex items-center text-slate-700">
                              <span className="mr-2">🏛️</span>
                              <span>{m.member.tribe}</span>
                            </div>
                          )}
                          {m.member?.interests && (
                            <div className="flex items-center text-slate-700">
                              <span className="mr-2">⭐</span>
                              <span className="line-clamp-1">{m.member.interests}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2 mt-4">
                          <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                            👤 Member
                          </span>
                          {m.approved && (
                            <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                              ✓ Verified
                            </span>
                          )}
                          <span className="text-xs bg-slate-200 text-slate-700 px-3 py-1 rounded-full">
                            {new Date(m.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* News Tab */}
            {activeTab === "news" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">News & Articles</h2>
                  <a
                    href="#"
                    className="px-4 py-2 bg-sscAccent text-white rounded-lg font-medium hover:bg-opacity-90 transition"
                  >
                    + Create News
                  </a>
                </div>
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {news.length === 0 ? (
                    <p className="text-slate-500 text-center py-8">No news articles yet</p>
                  ) : (
                    news.map((article) => (
                      <div
                        key={article.id}
                        className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-semibold text-slate-900">{article.title}</p>
                            <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                              {article.excerpt || "No excerpt"}
                            </p>
                            <div className="flex gap-2 mt-3">
                              <span className="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded">
                                {new Date(article.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button className="text-sm px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                              Edit
                            </button>
                            <button className="text-sm px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition">
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Events Tab */}
            {activeTab === "events" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">Events</h2>
                  <button
                    onClick={() => setShowAddEvent(!showAddEvent)}
                    className="px-4 py-2 bg-sscAccent text-white rounded-lg font-medium hover:bg-opacity-90 transition"
                  >
                    {showAddEvent ? "✕ Cancel" : "+ Create Event"}
                  </button>
                </div>

                {/* Add Event Form */}
                {showAddEvent && (
                  <div className="mb-6 p-6 bg-slate-50 rounded-lg border border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Create New Event</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Event Title *</label>
                        <input
                          type="text"
                          placeholder="Event name"
                          value={newEventForm.title}
                          onChange={(e) => setNewEventForm({ ...newEventForm, title: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sscAccent"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Description *</label>
                        <textarea
                          placeholder="Event description"
                          rows={3}
                          value={newEventForm.description}
                          onChange={(e) => setNewEventForm({ ...newEventForm, description: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sscAccent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Start Date/Time *</label>
                        <input
                          type="datetime-local"
                          value={newEventForm.startAt}
                          onChange={(e) => setNewEventForm({ ...newEventForm, startAt: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sscAccent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">End Date/Time (optional)</label>
                        <input
                          type="datetime-local"
                          value={newEventForm.endAt}
                          onChange={(e) => setNewEventForm({ ...newEventForm, endAt: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sscAccent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                        <input
                          type="text"
                          placeholder="Event location (e.g., Community Center)"
                          value={newEventForm.location}
                          onChange={(e) => setNewEventForm({ ...newEventForm, location: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sscAccent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
                        <input
                          type="text"
                          placeholder="Full address"
                          value={newEventForm.address}
                          onChange={(e) => setNewEventForm({ ...newEventForm, address: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sscAccent"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={addEvent}
                        disabled={addingEvent}
                        className="px-6 py-2 bg-sscAccent text-white rounded-lg font-medium hover:bg-opacity-90 transition disabled:opacity-50"
                      >
                        {addingEvent ? "Creating..." : "Create Event"}
                      </button>
                      <button
                        onClick={() => setShowAddEvent(false)}
                        className="px-6 py-2 bg-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-400 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Events List */}
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {events.length === 0 ? (
                    <p className="text-slate-500 text-center py-8">No events scheduled</p>
                  ) : (
                    events.map((event) => (
                      <div
                        key={event.id}
                        className="p-5 bg-gradient-to-r from-orange-50 to-slate-50 rounded-lg border-2 border-slate-200 hover:border-sscAccent transition"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-bold text-slate-900 text-lg">{event.title}</p>
                            <p className="text-sm text-slate-600 mt-2 line-clamp-2">{event.description}</p>
                            <div className="flex gap-3 mt-3 text-sm flex-wrap">
                              <span className="flex items-center text-slate-700">
                                📅 {new Date(event.startAt).toLocaleDateString()}
                              </span>
                              {event.location && (
                                <span className="flex items-center text-slate-700">
                                  📍 {event.location}
                                </span>
                              )}
                              {event.address && (
                                <span className="flex items-center text-slate-700">
                                  🏠 {event.address}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button className="text-sm px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                              Edit
                            </button>
                            <button
                              onClick={() => deleteEvent(event.id)}
                              className="text-sm px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Dashboard Tab */}
            {activeTab === "dashboard" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Recent Users */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Users</h3>
                  <div className="space-y-3">
                    {users.slice(0, 5).map((u) => (
                      <div key={u.id} className="flex justify-between items-center p-3 bg-slate-50 rounded">
                        <div>
                          <p className="font-medium text-slate-900 text-sm">{u.name || u.email}</p>
                          <p className="text-xs text-slate-500">{u.role}</p>
                        </div>
                        {!u.approved && (
                          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                            Pending
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <a
                      href="#"
                      className="block w-full p-3 bg-sscAccent text-white rounded-lg text-center font-medium hover:bg-opacity-90 transition"
                    >
                      📰 Create News Article
                    </a>
                    <a
                      href="#"
                      className="block w-full p-3 bg-blue-500 text-white rounded-lg text-center font-medium hover:bg-blue-600 transition"
                    >
                      📅 Schedule Event
                    </a>
                    <a
                      href="#"
                      className="block w-full p-3 bg-green-500 text-white rounded-lg text-center font-medium hover:bg-green-600 transition"
                    >
                      📧 Send Newsletter
                    </a>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
