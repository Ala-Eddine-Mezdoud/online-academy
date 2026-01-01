"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Search, Video, ExternalLink } from "lucide-react";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/admin/ui/dialog";
import { Label } from "@/components/admin/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/admin/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/admin/ui/alert-dialog";
import { Badge } from "@/components/admin/ui/badge";
import { getAllSessions } from "@/app/models/live-session.model";
import {
  createSession,
  updateSession,
  deleteSession,
} from "@/app/actions/live-session.actions";
import { getAllCourses } from "@/app/models/course.model";
import { getAllProfiles } from "@/app/models/profile.model";

export default function LiveSessionsPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    session_title: "",
    course_id: "",
    teacher_id: "",
    session_link: "",
    start_time: "",
    end_time: "",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [sessionsData, coursesData, teachersData] = await Promise.all([
        getAllSessions(),
        getAllCourses(),
        getAllProfiles("teacher"),
      ]);
      setSessions(sessionsData || []);
      setCourses(coursesData || []);
      setTeachers(teachersData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  const filteredSessions = sessions.filter(
    (session) =>
      session.session_title
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      courses
        .find((c) => c.id === session.course_id)
        ?.title?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      teachers
        .find((t) => t.id === session.teacher_id)
        ?.first_name?.toLowerCase()
        .includes(searchQuery.toLowerCase())
  );


  const handleCreate = async () => {
    try {
      await createSession({
        session_title: formData.session_title,
        course_id: Number(formData.course_id),
        teacher_id: formData.teacher_id,
        session_link: formData.session_link,
        start_time: formData.start_time,
        end_time: formData.end_time,
      });
      await fetchData();
      setIsCreateOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error creating session:", error);
    }
  };

  const handleEdit = async () => {
    if (!selectedSession) return;
    try {
      await updateSession(selectedSession.id, {
        session_title: formData.session_title,
        course_id: Number(formData.course_id),
        teacher_id: formData.teacher_id,
        session_link: formData.session_link,
        start_time: formData.start_time,
        end_time: formData.end_time,
      });
      await fetchData();
      setIsEditOpen(false);
      setSelectedSession(null);
      resetForm();
    } catch (error) {
      console.error("Error updating session:", error);
    }
  };

  const handleDelete = async () => {
    if (!selectedSession) return;
    try {
      await deleteSession(selectedSession.id);
      await fetchData();
      setIsDeleteOpen(false);
      setSelectedSession(null);
    } catch (error) {
      console.error("Error deleting session:", error);
    }
  };

  const openEdit = (session: any) => {
    setSelectedSession(session);
    setFormData({
      session_title: session.session_title || "",
      course_id: String(session.course_id || ""),
      teacher_id: session.teacher_id || "",
      session_link: session.session_link || "",
      start_time: session.start_time
        ? formatDateTimeLocal(session.start_time)
        : "",
      end_time: session.end_time ? formatDateTimeLocal(session.end_time) : "",
    });
    setIsEditOpen(true);
  };

  const openDelete = (session: any) => {
    setSelectedSession(session);
    setIsDeleteOpen(true);
  };

  const resetForm = () => {
    setFormData({
      session_title: "",
      course_id: "",
      teacher_id: "",
      session_link: "",
      start_time: "",
      end_time: "",
    });
  };

  const getCourseName = (id: number) => {
    const course = courses.find((c) => c.id === id);
    return course ? course.title : "Unknown";
  };

  const getTeacherName = (id: string) => {

    const teacher = teachers.find(t => t.id === id);
    return teacher ? teacher.name : 'Unknown';

  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const formatDateTimeLocal = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  const getSessionStatus = (startTime: string, endTime: string) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (now < start) {
      return {
        label: "Upcoming",
        variant: "outline" as const,
        className: "bg-blue-50 text-blue-700 border-blue-200",
      };
    } else if (now >= start && now <= end) {
      return {
        label: "Live",
        variant: "outline" as const,
        className: "bg-green-50 text-green-700 border-green-200",
      };
    } else {
      return {
        label: "Ended",
        variant: "outline" as const,
        className: "bg-gray-50 text-gray-700 border-gray-200",
      };
    }
  };


  if (loading) return <div className="p-8">Loading live sessions...</div>;

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Live Sessions Management
          </h1>
          <p className="text-gray-500">Manage live sessions for courses</p>
        </div>
        <Button
          onClick={() => setIsCreateOpen(true)}
          className="bg-blue-500 hover:bg-blue-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Session
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search sessions by title, course, or teacher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="live">Live</SelectItem>
                <SelectItem value="ended">Ended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                  Session Title
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                  Teacher
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                  Start Time
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                  End Time
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                  Link
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSessions.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <Video className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No live sessions found</p>
                  </td>
                </tr>
              ) : (
                filteredSessions.map((session) => {
                  const status = getSessionStatus(
                    session.start_time,
                    session.end_time
                  );
                  return (
                    <tr key={session.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs">
                        <div className="truncate">{session.session_title}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                        <div className="truncate">
                          {getCourseName(session.course_id)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {getTeacherName(session.teacher_id)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDateTime(session.start_time)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDateTime(session.end_time)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <Badge
                          variant={status.variant}
                          className={status.className}
                        >
                          {status.label}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {session.session_link ? (
                          <a
                            href={session.session_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Join
                          </a>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEdit(session)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDelete(session)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Live Session</DialogTitle>
            <DialogDescription>
              Schedule a new live session for a course. Fill in all the details
              below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="session_title">Session Title *</Label>
              <Input
                id="session_title"
                value={formData.session_title}
                onChange={(e) =>
                  setFormData({ ...formData, session_title: e.target.value })
                }
                placeholder="Introduction to Web Development"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="course">Course *</Label>
                <Select
                  value={formData.course_id}
                  onValueChange={(value: string) =>
                    setFormData({ ...formData, course_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={String(course.id)}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="teacher">Teacher *</Label>
                <Select
                  value={formData.teacher_id}
                  onValueChange={(value: string) =>
                    setFormData({ ...formData, teacher_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.name || 'Unknown'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="session_link">Session Link</Label>
              <Input
                id="session_link"
                value={formData.session_link}
                onChange={(e) =>
                  setFormData({ ...formData, session_link: e.target.value })
                }
                placeholder="https://zoom.us/j/123456789"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_time">Start Time *</Label>
                <Input
                  id="start_time"
                  type="datetime-local"
                  value={formData.start_time}
                  onChange={(e) =>
                    setFormData({ ...formData, start_time: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_time">End Time *</Label>
                <Input
                  id="end_time"
                  type="datetime-local"
                  value={formData.end_time}
                  onChange={(e) =>
                    setFormData({ ...formData, end_time: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Create Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Live Session</DialogTitle>
            <DialogDescription>
              Update the session information below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-session_title">Session Title *</Label>
              <Input
                id="edit-session_title"
                value={formData.session_title}
                onChange={(e) =>
                  setFormData({ ...formData, session_title: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-course">Course *</Label>
                <Select
                  value={formData.course_id}
                  onValueChange={(value: string) =>
                    setFormData({ ...formData, course_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={String(course.id)}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-teacher">Teacher *</Label>
                <Select
                  value={formData.teacher_id}
                  onValueChange={(value: string) =>
                    setFormData({ ...formData, teacher_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.name || 'Unknown'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-session_link">Session Link</Label>
              <Input
                id="edit-session_link"
                value={formData.session_link}
                onChange={(e) =>
                  setFormData({ ...formData, session_link: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-start_time">Start Time *</Label>
                <Input
                  id="edit-start_time"
                  type="datetime-local"
                  value={formData.start_time}
                  onChange={(e) =>
                    setFormData({ ...formData, start_time: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-end_time">End Time *</Label>
                <Input
                  id="edit-end_time"
                  type="datetime-local"
                  value={formData.end_time}
                  onChange={(e) =>
                    setFormData({ ...formData, end_time: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditOpen(false);
                setSelectedSession(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEdit}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Update Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the session &quot;
              {selectedSession?.session_title}&quot;. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setIsDeleteOpen(false);
                setSelectedSession(null);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
