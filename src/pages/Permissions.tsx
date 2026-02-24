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
import { Lock, Eye, Pencil } from 'lucide-react';

interface PermissionModules {
  dashboard: boolean;
  vehicles: boolean;
  users: boolean;
  settings: boolean;
  roles: boolean;
}

interface Permission {
  name: string;
  key: string;
  description: string;
  type: 'read' | 'write' | 'delete';
  createdAt: string;
  modules: PermissionModules;
}

const Permissions = () => {
  const { t } = useLanguage();
  const [selectedPerm, setSelectedPerm] = useState<string | null>(null);

  const permissions: Permission[] = [
    {
      name: t.perms.readName,
      key: 'read',
      description: t.perms.readDesc,
      type: 'read',
      createdAt: '2025-01-15',
      modules: { dashboard: true, vehicles: true, users: true, settings: true, roles: true },
    },
    {
      name: t.perms.writeName,
      key: 'write',
      description: t.perms.writeDesc,
      type: 'write',
      createdAt: '2025-01-15',
      modules: { dashboard: true, vehicles: true, users: true, settings: true, roles: true },
    },
    {
      name: t.perms.deleteName,
      key: 'delete',
      description: t.perms.deleteDesc,
      type: 'delete',
      createdAt: '2025-01-15',
      modules: { dashboard: false, vehicles: true, users: true, settings: false, roles: false },
    },
  ];

  const modules = [
    { key: 'dashboard', label: t.nav.dashboard },
    { key: 'vehicles', label: t.nav.vehicles },
    { key: 'users', label: t.users.title },
    { key: 'settings', label: t.nav.settings },
    { key: 'roles', label: t.roles.title },
  ];

  const countModules = (mods: PermissionModules) =>
    Object.values(mods).filter(Boolean).length;

  const currentPerm = permissions.find((p) => p.key === selectedPerm);

  const typeIcon = (type: string) => {
    switch (type) {
      case 'read': return <Eye className="w-4 h-4 text-primary" />;
      case 'write': return <Pencil className="w-4 h-4 text-primary" />;
      case 'delete': return <Lock className="w-4 h-4 text-destructive" />;
      default: return null;
    }
  };

  const typeBadgeVariant = (type: string) => {
    switch (type) {
      case 'read': return 'secondary' as const;
      case 'write': return 'default' as const;
      case 'delete': return 'destructive' as const;
      default: return 'outline' as const;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">{t.perms.title}</h1>
        <p className="text-muted-foreground">{t.perms.subtitle}</p>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.perms.permName}</TableHead>
              <TableHead>{t.perms.description}</TableHead>
              <TableHead className="text-center">{t.perms.type}</TableHead>
              <TableHead className="text-center">{t.perms.modulesCount}</TableHead>
              <TableHead>{t.perms.createdAt}</TableHead>
              <TableHead className="text-center">{t.perms.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {permissions.map((perm) => (
              <TableRow key={perm.key}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {typeIcon(perm.type)}
                    <span className="font-medium">{perm.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm max-w-xs truncate">
                  {perm.description}
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={typeBadgeVariant(perm.type)} className="text-xs">
                    {perm.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline">{countModules(perm.modules)} / 5</Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{perm.createdAt}</TableCell>
                <TableCell className="text-center">
                  <Button variant="ghost" size="icon" onClick={() => setSelectedPerm(perm.key)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedPerm} onOpenChange={(open) => !open && setSelectedPerm(null)}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {currentPerm && typeIcon(currentPerm.type)}
              {t.perms.editPerm} — {currentPerm?.name}
            </DialogTitle>
            <DialogDescription>{currentPerm?.description}</DialogDescription>
          </DialogHeader>

          <div className="space-y-3 mt-2">
            <h4 className="font-semibold text-sm">{t.perms.appliedModules}</h4>
            <div className="grid grid-cols-1 gap-2 pl-2">
              {modules.map((mod) => {
                const active = currentPerm?.modules[mod.key as keyof PermissionModules] ?? false;
                return (
                  <div key={mod.key} className="flex items-center justify-between py-1">
                    <Label className="text-sm text-muted-foreground">{mod.label}</Label>
                    <Switch checked={active} disabled />
                  </div>
                );
              })}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Permissions;
