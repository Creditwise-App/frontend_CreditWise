// src/pages/admin/ManageContentTips.tsx
import React, { useState } from 'react';
import { useCreditTips, CreditTip } from '../../context/CreditTipsContext';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

const ManageContentTips: React.FC = () => {
  const { tips, addTip, updateTip, deleteTip } = useCreditTips();
  const { user } = useAuth();

  // guard just in case, show message if not admin
  if (user?.role !== 'ADMIN') {
    return <Card><div className="text-red-600">Access denied — admin only.</div></Card>;
  }

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const startEdit = (t: CreditTip) => {
    setEditingId(t.id);
    setTitle(t.title);
    setDescription(t.description);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
  };

  const handleSave = () => {
    if (!title.trim() || !description.trim()) return;
    if (editingId) {
      updateTip(editingId, { title: title.trim(), description: description.trim() });
      cancelEdit();
    } else {
      addTip({ title: title.trim(), description: description.trim() });
      setTitle('');
      setDescription('');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Manage Credit Tips</h1>

      <Card>
        <div className="grid gap-3">
          <Input id="tip-title" label="Title" value={title} onChange={e => setTitle(e.target.value)} />
          <label className="block text-sm">Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 border rounded h-28" />
          <div className="flex gap-2">
            <Button onClick={handleSave}>{editingId ? 'Update Tip' : 'Add Tip'}</Button>
            {editingId && <Button variant="secondary" onClick={cancelEdit}>Cancel</Button>}
          </div>
        </div>
      </Card>

      <div className="space-y-2">
        {tips.length === 0 && <Card>No tips yet.</Card>}
        {tips.map(t => (
          <Card key={t.id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-semibold">{t.title}</div>
                <div className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{t.description}</div>
                <div className="text-xs text-gray-400 mt-2">Created: {new Date(t.createdAt).toLocaleString()}</div>
              </div>
              <div className="flex flex-col gap-2">
                <Button onClick={() => startEdit(t)}>Edit</Button>
                <Button variant="secondary" onClick={() => deleteTip(t.id)}>Delete</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ManageContentTips;
