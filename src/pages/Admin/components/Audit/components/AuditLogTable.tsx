// components/AuditLogTable.tsx
import React, { useState } from 'react';
import { Badge } from '../../../../../components/Badge';
import { Button } from '../../../../../components/Button';
import { Card } from '../../../../../components/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../../components//Table';
import moment from 'moment';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '../../../../../components/Dailog';
import { Label } from '../../../../../components/Label';

type AuditLog = {
  _id: string;
  createdAt?: string;
  userName?: string;
  userEmail?: string;
  action?: string;
  resource?: string;
  status?: string;
  ipAddress?: string;
  details?: any;
  // other fields...
};

type Props = {
  logs: AuditLog[];
  loading?: boolean;
  page?: number;
  totalRecords?:number
  totalPages?: number;
  onPageChange?: (p: number) => void;
  formatDate?: (s: string) => string;
  getActionBadge?: (action: string) => React.ReactNode;
  getResourceIcon?: (resource: string) => React.ReactNode;
  onSelectLog?: (log: AuditLog) => void;
};

export function AuditLogTable({
  logs,
  loading = false,
  page ,
  totalRecords,
  totalPages ,
  onPageChange = () => {},
  formatDate,
  getActionBadge,
  getResourceIcon,
  onSelectLog = () => {},
}: Props) {
  console.log(logs,'??????????????????????????');
  
  
  return (
    <Card className="p-6 bg-white">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[#303630]">Activity History</h3>
        <Badge className="bg-[#efefef] text-[#395159] border border-[#ccc9c0]">{totalRecords} records</Badge>
      </div>

      {loading ? (
        <div className="text-center py-12 text-[#395159]">Loading audit logs...</div>
      ) : logs?.length === 0 ? (
        <div className="text-center py-12 text-[#395159]">No audit logs found</div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {logs && logs?.map((log) => (
                <TableRow key={log._id}>
                  <TableCell className="text-[#395159]">
                    {formatDate ? formatDate(log.createdAt || '') : moment(log.createdAt).format('DD-MM-YYYY hh:mm A')}
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-[#303630]">{log.userName || 'System'}</span>
                      <span className="text-xs text-[#395159]">{log.userEmail}</span>
                    </div>
                  </TableCell>

                  <TableCell>{log.action}</TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2 text-[#395159]">
                      {getResourceIcon ? getResourceIcon(log.resource || '') : null}
                      <span>{log.resource}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge className={log.status === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}>
                      {log.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-[#395159]">{log.ipAddress || 'N/A'}</TableCell>

                  <TableCell>
                    {log.details ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => onSelectLog(log)}>
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Audit Log Details</DialogTitle>
                            <DialogDescription>Detailed information about this audit event</DialogDescription>
                          </DialogHeader>

                          <div className="space-y-4">
                            <div>
                              <Label>Action</Label>
                              <p className="text-[#303630] mt-1">{log.action}</p>
                            </div>
                            <div>
                              <Label>Resource</Label>
                              <p className="text-[#303630] mt-1">{log.resource}</p>
                            </div>
                            <div>
                              <Label>Details</Label>
                              <pre className="mt-1 p-3 bg-[#efefef] rounded text-sm text-[#303630] overflow-auto">
                                {JSON.stringify(log.details, null, 2)}
                              </pre>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    ) : (
                      '—'
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

   {totalPages && totalPages > 1 && (
  <div className="flex items-center justify-center gap-2 mt-6">
    <Button
      onClick={() => page && onPageChange(Math.max(1, page - 1))}
      disabled={page === 1}
    >
      Previous
    </Button>

    <span>
      Page {page} of {totalPages}
    </span>

    <Button
      onClick={() => page && onPageChange(Math.min(totalPages, page + 1))}
      disabled={page === totalPages}
    >
      Next
    </Button>
  </div>
)}


    </Card>
  );
}
