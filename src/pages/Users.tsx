import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Users as UsersIcon, Shield, UserCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UserWithRole {
  id: string;
  user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  company: string | null;
  created_at: string;
  role: string;
}

const Users = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [user]);

  const fetchUsers = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Check if current user is admin
      const { data: roleData } = await (supabase as any)
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      const userIsAdmin = !!roleData;
      setIsAdmin(userIsAdmin);

      // Fetch profiles (RLS handles visibility)
      const { data: profiles, error } = await (supabase as any)
        .from('profiles')
        .select('*');

      if (error) {
        console.error('Error fetching profiles:', error);
        setUsers([]);
        setLoading(false);
        return;
      }

      // Fetch roles for visible users
      const userIds = (profiles || []).map((p: any) => p.user_id);
      const { data: roles } = await (supabase as any)
        .from('user_roles')
        .select('user_id, role')
        .in('user_id', userIds);

      const rolesMap: Record<string, string> = {};
      (roles || []).forEach((r: any) => {
        rolesMap[r.user_id] = r.role;
      });

      const usersWithRoles: UserWithRole[] = (profiles || []).map((p: any) => ({
        id: p.id,
        user_id: p.user_id,
        email: p.email || '',
        first_name: p.first_name,
        last_name: p.last_name,
        company: p.company,
        created_at: p.created_at,
        role: rolesMap[p.user_id] || 'user',
      }));

      setUsers(usersWithRoles);
    } catch (err) {
      console.error('Error:', err);
    }
    setLoading(false);
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!isAdmin) return;
    const { error } = await (supabase as any)
      .from('user_roles')
      .update({ role: newRole })
      .eq('user_id', userId);
    if (!error) {
      setUsers(prev => prev.map(u => u.user_id === userId ? { ...u, role: newRole } : u));
    }
  };

  const filteredUsers = users.filter(u =>
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.first_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.last_name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t.users.title}</h1>
          <p className="text-muted-foreground">{t.users.subtitle}</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={t.common.search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
              <UsersIcon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{users.length}</p>
              <p className="text-sm text-muted-foreground">{t.users.totalUsers}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-warning/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{users.filter(u => u.role === 'admin').length}</p>
              <p className="text-sm text-muted-foreground">{t.users.admins}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-success/20 flex items-center justify-center">
              <UserCircle className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{users.filter(u => u.role === 'user').length}</p>
              <p className="text-sm text-muted-foreground">{t.users.standardUsers}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.users.userList}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-8 text-muted-foreground">{t.common.loading}</p>
          ) : filteredUsers.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">{t.common.noData}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.users.name}</TableHead>
                  <TableHead>{t.users.email}</TableHead>
                  <TableHead>{t.users.company}</TableHead>
                  <TableHead>{t.users.role}</TableHead>
                  <TableHead>{t.users.joinDate}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">
                      {u.first_name || u.last_name
                        ? `${u.first_name || ''} ${u.last_name || ''}`.trim()
                        : '—'}
                    </TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.company || '—'}</TableCell>
                    <TableCell>
                      {isAdmin && u.user_id !== user?.id ? (
                        <Select value={u.role} onValueChange={(val) => handleRoleChange(u.user_id, val)}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">{t.users.admin}</SelectItem>
                            <SelectItem value="user">{t.users.user}</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge variant={u.role === 'admin' ? 'default' : 'secondary'}>
                          {u.role === 'admin' ? t.users.admin : t.users.user}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Users;
