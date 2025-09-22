import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/hooks/use-auth';
import axios from 'axios';

export default function DocumentList() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/documents/list`, {
        headers: {
          'X-User-ID': user.id,
        },
        withCredentials: true,
      });
      setDocuments(response.data.documents);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch documents.');
    }
  };

  useEffect(() => {
    if (user) {
      fetchDocuments();
    }
  }, [user]);

  const handleDownload = async (documentId, filename) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/documents/download/${documentId}`, {
        responseType: 'blob', // Important for downloading files
        headers: {
          'X-User-ID': user.id,
        },
        withCredentials: true,
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setMessage('Document downloaded successfully.');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to download document.');
    }
  };

  const handleDelete = async (documentId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/documents/delete/${documentId}`, {
        headers: {
          'X-User-ID': user.id,
        },
        withCredentials: true,
      });
      setMessage('Document deleted successfully.');
      fetchDocuments(); // Refresh the list
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete document.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gold">Document Management</h1>
      {message && <p className="text-green-500 mt-4">{message}</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}
      
      {documents.length === 0 ? (
        <p className="text-white">No documents uploaded yet.</p>
      ) : (
        <Table className="bg-card text-white border-border">
          <TableHeader>
            <TableRow>
              <TableHead className="text-gold">Title</TableHead>
              <TableHead className="text-gold">Filename</TableHead>
              <TableHead className="text-gold">Category</TableHead>
              <TableHead className="text-gold">Uploaded By</TableHead>
              <TableHead className="text-gold">Uploaded At</TableHead>
              <TableHead className="text-gold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell>{doc.title}</TableCell>
                <TableCell>{doc.filename}</TableCell>
                <TableCell>{doc.category}</TableCell>
                <TableCell>{doc.uploader_name}</TableCell>
                <TableCell>{new Date(doc.uploaded_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" onClick={() => handleDownload(doc.id, doc.filename)} className="mr-2 bg-gold text-black hover:bg-yellow-600">
                    Download
                  </Button>
                  {(user.role === 'master' || user.role === 'manager') && (
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(doc.id)} className="bg-red-600 text-white hover:bg-red-700">
                      Delete
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

