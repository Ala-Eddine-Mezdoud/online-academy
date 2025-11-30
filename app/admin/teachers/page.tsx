'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Link as LinkIcon, X } from 'lucide-react';
import { Button } from '@/components/admin/ui/button';
import { Input } from '@/components/admin/ui/input';
import { Textarea } from '@/components/admin/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/admin/ui/dialog';
import { Label } from '@/components/admin/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/admin/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/admin/ui/alert-dialog';
import { teachers as initialTeachers, wilayas, Teacher } from '@/lib/mockData';

interface TeacherLink {
  id: number;
  platform: string;
  url: string;
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    wilaya: '',
    role_title: '',
    description: '',
  });
  const [links, setLinks] = useState<TeacherLink[]>([]);
  const [newLink, setNewLink] = useState({ platform: '', url: '' });

  const filteredTeachers = teachers.filter(teacher =>
    teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.role_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.wilaya?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = () => {
    const newTeacher: Teacher = {
      id: String(Date.now()),
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      role: 'teacher',
      phone_number: formData.phone_number,
      wilaya: formData.wilaya,
      role_title: formData.role_title,
      description: formData.description,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      links: links.length > 0 ? links : undefined,
    };
    setTeachers([...teachers, newTeacher]);
    setIsCreateOpen(false);
    resetForm();
  };

  const handleEdit = () => {
    if (!selectedTeacher) return;
    setTeachers(teachers.map(t => 
      t.id === selectedTeacher.id 
        ? { ...t, ...formData, links: links.length > 0 ? links : undefined, updated_at: new Date().toISOString() }
        : t
    ));
    setIsEditOpen(false);
    setSelectedTeacher(null);
    resetForm();
  };

  const handleDelete = () => {
    if (!selectedTeacher) return;
    setTeachers(teachers.filter(t => t.id !== selectedTeacher.id));
    setIsDeleteOpen(false);
    setSelectedTeacher(null);
  };

  const openEdit = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setFormData({
      first_name: teacher.first_name || '',
      last_name: teacher.last_name || '',
      email: teacher.email,
      phone_number: teacher.phone_number || '',
      wilaya: teacher.wilaya || '',
      role_title: teacher.role_title || '',
      description: teacher.description || '',
    });
    setLinks(teacher.links || []);
    setIsEditOpen(true);
  };

  const openDelete = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsDeleteOpen(true);
  };

  const addLink = () => {
    if (newLink.platform && newLink.url) {
      setLinks([...links, { id: Date.now(), ...newLink }]);
      setNewLink({ platform: '', url: '' });
    }
  };

  const removeLink = (id: number) => {
    setLinks(links.filter(link => link.id !== id));
  };

  const resetForm = () => {
    setFormData({ first_name: '', last_name: '', email: '', phone_number: '', wilaya: '', role_title: '', description: '' });
    setLinks([]);
    setNewLink({ platform: '', url: '' });
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Teachers Management</h1>
          <p className="text-gray-500">Manage your platform teachers</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="bg-blue-500 hover:bg-blue-600">
          <Plus className="w-4 h-4 mr-2" />
          Add Teacher
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search teachers by name, email, title, or wilaya..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Wilaya</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Links</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTeachers.map((teacher) => (
                <tr key={teacher.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {teacher.first_name && teacher.last_name ? `${teacher.first_name} ${teacher.last_name}` : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{teacher.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{teacher.role_title || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{teacher.phone_number || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{teacher.wilaya || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {teacher.links && teacher.links.length > 0 ? (
                      <div className="flex gap-1">
                        {teacher.links.map((link) => (
                          <a
                            key={link.id}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                            title={link.platform}
                          >
                            <LinkIcon className="w-4 h-4" />
                          </a>
                        ))}
                      </div>
                    ) : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEdit(teacher)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDelete(teacher)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Teacher</DialogTitle>
            <DialogDescription>
              Add a new teacher to the platform. Fill in the details and social links below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  placeholder="Ahmed"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name *</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  placeholder="Benali"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="teacher@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role_title">Role Title</Label>
              <Input
                id="role_title"
                value={formData.role_title}
                onChange={(e) => setFormData({ ...formData, role_title: e.target.value })}
                placeholder="Senior Software Engineer"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                placeholder="+213 555 123 456"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wilaya">Wilaya</Label>
              <Select value={formData.wilaya} onValueChange={(value: string) => setFormData({ ...formData, wilaya: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select wilaya" />
                </SelectTrigger>
                <SelectContent>
                  {wilayas.map((wilaya) => (
                    <SelectItem key={wilaya} value={wilaya}>
                      {wilaya}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief bio about the teacher"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Social Links</Label>
              <div className="space-y-2">
                {links.map((link) => (
                  <div key={link.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <span className="text-sm">{link.platform}:</span>
                    <span className="text-sm text-gray-600 flex-1 truncate">{link.url}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLink(link.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Platform (e.g., LinkedIn)"
                  value={newLink.platform}
                  onChange={(e) => setNewLink({ ...newLink, platform: e.target.value })}
                />
                <Input
                  placeholder="URL"
                  value={newLink.url}
                  onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                />
                <Button onClick={addLink} variant="outline" size="sm">
                  Add
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsCreateOpen(false); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleCreate} className="bg-blue-500 hover:bg-blue-600">
              Create Teacher
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Teacher</DialogTitle>
            <DialogDescription>
              Update the teacher information and social links below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-first_name">First Name *</Label>
                <Input
                  id="edit-first_name"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-last_name">Last Name *</Label>
                <Input
                  id="edit-last_name"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email *</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role_title">Role Title</Label>
              <Input
                id="edit-role_title"
                value={formData.role_title}
                onChange={(e) => setFormData({ ...formData, role_title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone Number</Label>
              <Input
                id="edit-phone"
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-wilaya">Wilaya</Label>
              <Select value={formData.wilaya} onValueChange={(value: string) => setFormData({ ...formData, wilaya: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select wilaya" />
                </SelectTrigger>
                <SelectContent>
                  {wilayas.map((wilaya) => (
                    <SelectItem key={wilaya} value={wilaya}>
                      {wilaya}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Social Links</Label>
              <div className="space-y-2">
                {links.map((link) => (
                  <div key={link.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <span className="text-sm">{link.platform}:</span>
                    <span className="text-sm text-gray-600 flex-1 truncate">{link.url}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLink(link.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Platform (e.g., LinkedIn)"
                  value={newLink.platform}
                  onChange={(e) => setNewLink({ ...newLink, platform: e.target.value })}
                />
                <Input
                  placeholder="URL"
                  value={newLink.url}
                  onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                />
                <Button onClick={addLink} variant="outline" size="sm">
                  Add
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsEditOpen(false); setSelectedTeacher(null); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleEdit} className="bg-blue-500 hover:bg-blue-600">
              Update Teacher
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
              This will permanently delete the teacher &quot;{selectedTeacher?.first_name} {selectedTeacher?.last_name}&quot;. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { setIsDeleteOpen(false); setSelectedTeacher(null); }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
