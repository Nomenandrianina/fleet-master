import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Shield, UserCircle, Pencil } from 'lucide-react';

interface RolePermissions {
  dashboard: { read: boolean; write: boolean; delete: boolean };
  vehicles: { read: boolean; write: boolean; delete: boolean };
  users: { read: boolean; write: boolean; delete: boolean };
  settings: { read: boolean; write: boolean; delete: boolean };
  roles: { read: boolean; write: boolean; delete: boolean };
}

const Roles = () => {
  const { t } = useLanguage();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const roles = [
    {
      name: t.users.admin,
      key: 'admin',
      description: t.roles.adminDesc,
      createdAt: '2025-01-15',
      permissions: {
        dashboard: { read: true, write: true, delete: true },
        vehicles: { read: true, write: true, delete: true },
        users: { read: true, write: true, delete: true },
        settings: { read: true, write: true, delete: true },
        roles: { read: true, write: true, delete: true },
      } as RolePermissions,
    },
    {
      name: t.users.user,
      key: 'user',
      description: t.roles.userDesc,
      createdAt: '2025-01-15',
      permissions: {
        dashboard: { read: true, write: false, delete: false },
        vehicles: { read: true, write: false, delete: false },
        users: { read: false, write: false, delete: false },
        settings: { read: true, write: false, delete: false },
        roles: { read: false, write: false, delete: false },
      } as RolePermissions,
    },
  ];

  const modules = [
    { key: 'dashboard', label: t.nav.dashboard },
    { key: 'vehicles', label: t.nav.vehicles },
    { key: 'users', label: t.users.title },
    { key: 'settings', label: t.nav.settings },
    { key: 'roles', label: t.roles.title },
  ];

  const countPermissions = (perms: RolePermissions) => {
    let total = 0;
    Object.values(perms).forEach((mod) => {
      if (mod.read) total++;
      if (mod.write) total++;
      if (mod.delete) total++;
    });
    return total;
  };

  const currentRole = roles.find((r) => r.key === selectedRole);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">{t.roles.title}</h1>
        <p className="text-muted-foreground">{t.roles.subtitle}</p>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.roles.roleName}</TableHead>
              <TableHead>{t.roles.description}</TableHead>
              <TableHead className="text-center">{t.roles.totalPermissions}</TableHead>
              <TableHead>{t.roles.createdAt}</TableHead>
              <TableHead className="text-center">{t.roles.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.key}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {role.key === 'admin' ? (
                      <Shield className="w-4 h-4 text-primary" />
                    ) : (
                      <UserCircle className="w-4 h-4 text-primary" />
                    )}
                    <span className="font-medium">{role.name}</span>
                    <Badge variant={role.key === 'admin' ? 'default' : 'secondary'} className="text-xs">
                      {role.key}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm max-w-xs truncate">
                  {role.description}
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline">{countPermissions(role.permissions)} / 15</Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{role.createdAt}</TableCell>
                <TableCell className="text-center">
                  <Button variant="ghost" size="icon" onClick={() => setSelectedRole(role.key)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal détail rôle */}
      <Dialog open={!!selectedRole} onOpenChange={(open) => !open && setSelectedRole(null)}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {currentRole?.key === 'admin' ? (
                <Shield className="w-5 h-5 text-primary" />
              ) : (
                <UserCircle className="w-5 h-5 text-primary" />
              )}
              {t.roles.editRole} — {currentRole?.name}
            </DialogTitle>
            <DialogDescription>{currentRole?.description}</DialogDescription>
          </DialogHeader>

          <div className="space-y-5 mt-2">
            {modules.map((mod) => {
              const perms = currentRole?.permissions[mod.key as keyof RolePermissions];
              if (!perms) return null;
              return (
                <div key={mod.key} className="space-y-3">
                  <h4 className="font-semibold text-sm">{mod.label}</h4>
                  <div className="grid grid-cols-1 gap-2 pl-2">
                    {(['read', 'write', 'delete'] as const).map((perm) => (
                      <div key={perm} className="flex items-center justify-between py-1">
                        <Label className="text-sm text-muted-foreground">
                          {t.roles[perm === 'delete' ? 'delete' : perm]}
                        </Label>
                        <Switch checked={perms[perm]} disabled />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Roles;
