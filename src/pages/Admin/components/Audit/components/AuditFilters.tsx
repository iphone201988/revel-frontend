import { Search } from "lucide-react";
import { Card } from "../../../../../components/Card";
import { Button } from "../../../../../components/Button";
import { Input } from "../../../../../components/Input";
import { Label } from "../../../../../components/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../components/Select";

type Props = {
  search: any;
  actionFilter: any;
  resourceFilter: any;
  startDate: string;
  endDate: string;
  setSearch: any;
  setActionFilter: any;
  setResourceFilter: any;
  setStartDate: React.Dispatch<React.SetStateAction<string>>;
  setEndDate: React.Dispatch<React.SetStateAction<string>>;
  onApply: any;
  onClear: any;
};

function AuditFilters({
  search,
  actionFilter,
  resourceFilter,
  startDate,
  endDate,
  setSearch,
  setActionFilter,
  setResourceFilter,
  setStartDate,
  setEndDate,
  onApply,
  onClear,
}: Props) {
  return (
    <Card className="p-6 bg-white mb-6">
      <h3 className="text-[#303630] mb-4">Filter Audit Logs</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="action">Action</Label>
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="All actions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All actions</SelectItem>
              <SelectItem value="Provider Login"> Login</SelectItem>
              <SelectItem value="Provider Logout"> Logout</SelectItem>
              <SelectItem value="View Client">View Client</SelectItem>
              <SelectItem value="Create Client">Create Client</SelectItem>
              <SelectItem value="Update Client">Update Client</SelectItem>
              <SelectItem value="Start Session">Start Session</SelectItem>
              <SelectItem value="View Audit Logs">View Audit Logs</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="resource">Resource</Label>
          <Select value={resourceFilter} onValueChange={setResourceFilter}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="All resources" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All resources</SelectItem>
              <SelectItem value="Auth">Authentication</SelectItem>
              <SelectItem value="Client">Client</SelectItem>
              <SelectItem value="Session">Session</SelectItem>
              <SelectItem value="Provider">Provider</SelectItem>
              <SelectItem value="Goal">Goal</SelectItem>
              <SelectItem value="Audit Logs">Audit Logs</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="h-12"
          />
        </div>

        <div className="flex items-end gap-2">
          <Button
            onClick={onApply}
            className="h-12 flex-1 bg-[#395159] hover:bg-[#303630] text-white"
          >
            <Search className="w-4 h-4 mr-2" />
            Apply Filters
          </Button>
          <Button onClick={onClear} variant="outline" className="h-12">
            Clear
          </Button>
        </div>
      </div>
    </Card>
  );
}
export default AuditFilters;
