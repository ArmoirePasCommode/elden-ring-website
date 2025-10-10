import React, { useMemo, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth, getStoredToken } from "@/hooks/use-auth";

type Demigod = {
  id?: string;
  name: string;
  title?: string | null;
  description?: string | null;
  mainImageUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

const apiBase = ""; // same origin

async function fetchDemigods(): Promise<Demigod[]> {
  const res = await fetch(`${apiBase}/api/demigods`);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

export default function Admin() {
  const qc = useQueryClient();
  const { token, login, logout, loading, isAuthed } = useAuth();
  const { data, isLoading } = useQuery({ queryKey: ["demigods"], queryFn: fetchDemigods });

  const [newName, setNewName] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const createMutation = useMutation({
    mutationFn: async (payload: Partial<Demigod>) => {
      const res = await fetch(`${apiBase}/api/demigods`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Create failed");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Created");
      qc.invalidateQueries({ queryKey: ["demigods"] });
      setNewName("");
      setNewTitle("");
      setNewDescription("");
    },
    onError: () => toast.error("Create failed"),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Demigod> }) => {
      const res = await fetch(`${apiBase}/api/demigods/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Update failed");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Updated");
      qc.invalidateQueries({ queryKey: ["demigods"] });
      qc.invalidateQueries({ queryKey: ["demigods-public"] });
    },
    onError: () => toast.error("Update failed"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${apiBase}/api/demigods/${id}`, { method: "DELETE", headers: token ? { Authorization: `Bearer ${token}` } : undefined });
      if (!res.ok) throw new Error("Delete failed");
    },
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["demigods"] });
    },
    onError: () => toast.error("Delete failed"),
  });

  const deleteAll = async () => {
    if (!data || data.length === 0) return;
    for (const d of data) {
      if (!d.id) continue;
      try {
        await fetch(`${apiBase}/api/demigods/${d.id}`, { method: "DELETE", headers: token ? { Authorization: `Bearer ${token}` } : undefined });
      } catch {}
    }
    toast.success("All deleted");
    qc.invalidateQueries({ queryKey: ["demigods"] });
  };

  const onCreate = () => {
    if (!newName.trim()) return toast.error("Name required");
    createMutation.mutate({ name: newName.trim(), title: newTitle || undefined, description: newDescription || undefined });
  };

  if (!isAuthed) {
    return (
      <div className="container mx-auto max-w-md p-6">
        <Card>
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Use credentials guest / guest</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <LoginForm onLogin={login} loading={loading} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl p-6 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Demigods Admin</CardTitle>
          <CardDescription>Manage demigods and main pictures</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-end">
            <Button variant="secondary" onClick={logout}>Logout</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Name" />
            </div>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Title" />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="desc">Description</Label>
              <Input id="desc" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} placeholder="Description" />
            </div>
            <div className="md:col-span-4 flex gap-2">
              <Button onClick={onCreate} disabled={createMutation.isPending}>Create</Button>
              <Button variant="destructive" onClick={deleteAll} disabled={isLoading}>Delete All</Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(data || []).map((d) => (
                  <Row
                    key={d.id || Math.random()}
                    d={d}
                    authToken={token}
                    onSave={(updates) => d.id && updateMutation.mutate({ id: d.id, updates })}
                    onDelete={() => d.id && deleteMutation.mutate(d.id)}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ d, onSave, onDelete, authToken }: { d: Demigod; onSave: (updates: Partial<Demigod>) => void; onDelete: () => void; authToken?: string | null }) {
  const [name, setName] = useState(d.name || "");
  const [title, setTitle] = useState(d.title || "");
  const [description, setDescription] = useState(d.description || "");
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const save = () => onSave({ name, title, description });

  const onPick = () => fileRef.current?.click();
  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !d.id) return;
    setUploading(true);
    try {
      // Show instant local preview
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      const base64 = await toBase64(file);
      const token = authToken || getStoredToken();
      if (!token) throw new Error("Not authenticated");
      const res = await fetch(`/api/media/main-picture`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ base64, filename: file.name, contentType: file.type || "image/jpeg", demigodId: d.id }),
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      onSave({ mainImageUrl: data.url });
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
      // Revoke any previously created object URLs to avoid leaks
      // Note: keep the latest previewUrl for immediate UI feedback; it will
      // be replaced by server URL after data refresh
    }
  };

  return (
    <TableRow>
      <TableCell className="min-w-[180px]"><Input value={name} onChange={(e) => setName(e.target.value)} /></TableCell>
      <TableCell className="min-w-[180px]"><Input value={title || ""} onChange={(e) => setTitle(e.target.value)} /></TableCell>
      <TableCell className="min-w-[240px]"><Input value={description || ""} onChange={(e) => setDescription(e.target.value)} /></TableCell>
      <TableCell className="min-w-[200px]">
        <div className="flex items-center gap-2">
          {previewUrl || d.mainImageUrl ? (
            <img src={previewUrl || d.mainImageUrl || undefined} alt={d.name} className="h-10 w-10 object-cover rounded" />
          ) : (
            <div className="h-10 w-10 bg-muted rounded" />
          )}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
          <Button variant="secondary" onClick={onPick} disabled={uploading}>Upload</Button>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex gap-2 justify-end">
          <Button onClick={save}>Save</Button>
          <Button variant="destructive" onClick={onDelete}>Delete</Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function LoginForm({ onLogin, loading }: { onLogin: (u: string, p: string) => Promise<boolean>; loading: boolean }) {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const submit = async () => {
    try {
      const ok = await onLogin(u, p);
      if (!ok) return toast.error("Invalid credentials");
    } catch {
      toast.error("Login failed");
    }
  };
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="u">Username</Label>
        <Input id="u" value={u} onChange={(e) => setU(e.target.value)} placeholder="username" />
      </div>
      <div>
        <Label htmlFor="p">Password</Label>
        <Input id="p" type="password" value={p} onChange={(e) => setP(e.target.value)} placeholder="password" />
      </div>
      <Button onClick={submit} disabled={loading}>Login</Button>
    </div>
  );
}


