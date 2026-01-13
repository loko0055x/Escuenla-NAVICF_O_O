import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface User {
  id: number;
  name: string;
  lastname: string;
  phone: string;
  email: string;
  created_at: string;
}

const UsersTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const usersPerPage = 10;

  useEffect(() => {
    loadUsers();
  }, [currentPage]);

  const loadUsers = async () => {
    const from = (currentPage - 1) * usersPerPage;
    const to = from + usersPerPage - 1;

    const { data, error, count } = await supabase
      .from("users" as any)
      .select("id, name, lastname, phone, email, created_at", {
        count: "exact",
      })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (!error && data) {
      setUsers(data);
      setTotalUsers(count || 0);
    }
  };

  const totalPages = Math.ceil(totalUsers / usersPerPage);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-PE", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h2 className="text-xl font-bold text-slate-800 mb-4">
        Usuarios del Sistema
      </h2>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="font-semibold">ID</TableHead>
              <TableHead className="font-semibold">Nombre</TableHead>
              <TableHead className="font-semibold">Apellido</TableHead>
              <TableHead className="font-semibold">Teléfono</TableHead>
              <TableHead className="font-semibold">Email</TableHead>
              <TableHead className="font-semibold">Fecha Registro</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.lastname}</TableCell>
                <TableCell>{user.phone || "-"}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{formatDate(user.created_at)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {users.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            No se encontraron usuarios
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-slate-600">
            Mostrando {(currentPage - 1) * usersPerPage + 1} a{" "}
            {Math.min(currentPage * usersPerPage, totalUsers)} de {totalUsers}{" "}
            usuarios
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTable;
