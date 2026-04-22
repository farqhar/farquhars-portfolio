import { useEffect, useState } from "react";
import AdminLogin from "@/components/admin/AdminLogin";
import CMSShell from "@/components/admin/CMSShell";
import { cmsSession } from "@/lib/cmsSession";

const Admin = () => {
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    setAuthed(cmsSession.isAuthed());
  }, []);

  if (!authed) return <AdminLogin onSuccess={() => setAuthed(true)} />;
  return <CMSShell onLogout={() => setAuthed(false)} />;
};

export default Admin;