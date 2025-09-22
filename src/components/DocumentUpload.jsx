import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/use-auth';
import axios from 'axios';

export default function DocumentUpload() {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('training');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-User-ID': user.id, // Pass user ID for authentication
        },
        withCredentials: true,
      });
      setMessage(response.data.message);
      setFile(null);
      setTitle('');
      setDescription('');
      setCategory('training');
    } catch (err) {
      setError(err.response?.data?.error || 'An unexpected error occurred.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gold">Upload Document</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="file" className="text-gold">File</Label>
          <Input id="file" type="file" onChange={handleFileChange} className="bg-card text-white border-border" />
        </div>
        <div>
          <Label htmlFor="title" className="text-gold">Title</Label>
          <Input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="bg-card text-white border-border" />
        </div>
        <div>
          <Label htmlFor="description" className="text-gold">Description</Label>
          <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="bg-card text-white border-border" />
        </div>
        <div>
          <Label htmlFor="category" className="text-gold">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[180px] bg-card text-white border-border">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent className="bg-card text-white border-border">
              <SelectItem value="training">Training</SelectItem>
              <SelectItem value="policy">Policy</SelectItem>
              <SelectItem value="manual">Manual</SelectItem>
              <SelectItem value="procedure">Procedure</SelectItem>
              <SelectItem value="safety">Safety</SelectItem>
              <SelectItem value="menu">Menu</SelectItem>
              <SelectItem value="drinks">Drinks</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" className="bg-gold text-black hover:bg-yellow-600">Upload Document</Button>
      </form>
      {message && <p className="text-green-500 mt-4">{message}</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}

