import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Shield, UserCircle, Eye, Pencil, Trash2, Check, X } from 'lucide-react';

const Roles = () => {
  const { t } = useLanguage();

  const roles = [
    {
      name: t.users.admin,
      key: 'admin',
      description: t.roles.adminDesc,
      usersCount: '—',
      permissions: {
        dashboard: { read: true, write: true, delete: true },
        vehicles: { read: true, write: true, delete: true },
        users: { read: true, write: true, delete: true },
        settings: { read: true, write: true, delete: true },
        roles: { read: true, write: true, delete: true },
      },
    },
    {
      name: t.users.user,
      key: 'user',
      description: t.roles.userDesc,
      usersCount: '—',
      permissions: {
        dashboard: { read: true, write: false, delete: false },
        vehicles: { read: true, write: false, delete: false },
        users: { read: false, write: false, delete: false },
        settings: { read: true, write: false, delete: false },
        roles: { read: false, write: false, delete: false },
      },
    },
  ];

  const modules = [
    { key: 'dashboard', label: t.nav.dashboard },
    { key: 'vehicles', label: t.nav.vehicles },
    { key: 'users', label: t.users.title },
    { key: 'settings', label: t.nav.settings },
    { key: 'roles', label: t.roles.title },
  ];

  const PermIcon = ({ allowed }: { allowed: boolean }) =>
    allowed ? (
      <Check className="w-4 h-4 text-primary" />
    ) : (
      <X className="w-4 h-4 text-muted-foreground/40" />
    );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">{t.roles.title}</h1>
        <p className="text-muted-foreground">{t.roles.subtitle}</p>
      </div>

      {/* Role cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map((role) => (
          <Card key={role.key}>
            <CardContent className="p-5 flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                {role.key === 'admin' ? (
                  <Shield className="w-6 h-6 text-primary" />
                ) : (
                  <UserCircle className="w-6 h-6 text-primary" />
                )}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">{role.name}</h3>
                  <Badge variant={role.key === 'admin' ? 'default' : 'secondary'}>
                    {role.key}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{role.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Permissions matrix */}
      <Card>
        <CardHeader>
          <CardTitle>{t.roles.permissionsMatrix}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.roles.module}</TableHead>
                {roles.map((role) => (
                  <TableHead key={role.key} colSpan={3} className="text-center">
                    {role.name}
                  </TableHead>
                ))}
              </TableRow>
              <TableRow>
                <TableHead />
                {roles.map((role) => (
                  <>
                    <TableHead key={`${role.key}-r`} className="text-center px-2">
                      <Eye className="w-4 h-4 mx-auto" />
                    </TableHead>
                    <TableHead key={`${role.key}-w`} className="text-center px-2">
                      <Pencil className="w-4 h-4 mx-auto" />
                    </TableHead>
                    <TableHead key={`${role.key}-d`} className="text-center px-2">
                      <Trash2 className="w-4 h-4 mx-auto" />
                    </TableHead>
                  </>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {modules.map((mod) => (
                <TableRow key={mod.key}>
                  <TableCell className="font-medium">{mod.label}</TableCell>
                  {roles.map((role) => {
                    const perms = role.permissions[mod.key as keyof typeof role.permissions];
                    return (
                      <>
                        <TableCell key={`${role.key}-${mod.key}-r`} className="text-center">
                          <PermIcon allowed={perms.read} />
                        </TableCell>
                        <TableCell key={`${role.key}-${mod.key}-w`} className="text-center">
                          <PermIcon allowed={perms.write} />
                        </TableCell>
                        <TableCell key={`${role.key}-${mod.key}-d`} className="text-center">
                          <PermIcon allowed={perms.delete} />
                        </TableCell>
                      </>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Roles;
