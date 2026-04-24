"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { api } from "@/convex/_generated/api";
import { HIGHWAY_SEQUENCE } from "@/lib/constants";
import { usePaginatedQuery, useQuery } from "convex/react";
import { format } from "date-fns";
import { ArrowRight, Bus, Car, Cloud, Filter, History, Loader2, RefreshCw, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";
const ITEMS_PER_PAGE = 10;
export default function RoutesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [vehicleFilter, setVehicleFilter] = useState<string>("all");
  const [weatherFilter, setWeatherFilter] = useState<string>("all");
  const [originFilter, setOriginFilter] = useState<string>("all");
  const [destinationFilter, setDestinationFilter] = useState<string>("all");
  const filterArgs = {
    vehicle: vehicleFilter === "all" ? undefined : vehicleFilter,
    weather: weatherFilter === "all" ? undefined : weatherFilter,
    origin: originFilter === "all" ? undefined : originFilter,
    destination: destinationFilter === "all" ? undefined : destinationFilter,
  };
  const totalCount = useQuery(api.routes.getTotalSimulationLogsCount, filterArgs) ?? 0;
  const { results, status, loadMore } = usePaginatedQuery(
    api.routes.getPaginatedSimulationLogs,
    filterArgs,
    { initialNumItems: ITEMS_PER_PAGE }
  );
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  useEffect(() => {
    setCurrentPage(1);
  }, [vehicleFilter, weatherFilter, originFilter, destinationFilter]);
  useEffect(() => {
    const neededItems = currentPage * ITEMS_PER_PAGE;
    if (results.length < neededItems && status === "CanLoadMore") {
      loadMore(neededItems - results.length);
    }
  }, [currentPage, results.length, status, loadMore]);
  const paginatedResults = results.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const clearFilters = () => {
    setVehicleFilter("all");
    setWeatherFilter("all");
    setOriginFilter("all");
    setDestinationFilter("all");
  };
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("ellipsis-1");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("ellipsis-2");
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };
  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-8 space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest text-xs">
            <History className="size-3" />
            Simulation History
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100">
            Route Logs
          </h1>
          <p className="text-slate-500 max-w-lg">
            A historical record of all Monte Carlo simulations performed along the MacArthur Highway transit sequence.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="px-4 py-2 rounded-lg bg-white dark:bg-slate-950 shadow-sm border border-slate-200 dark:border-slate-800 text-center min-w-24">
            <div className="text-[10px] font-bold text-slate-500 uppercase">Results</div>
            <div className="text-xl font-black text-emerald-600">{totalCount}</div>
          </div>
          <Button variant="ghost" size="icon" className="h-12 w-12 rounded-lg" onClick={() => window.location.reload()}>
            <RefreshCw className="size-4 text-slate-400" />
          </Button>
        </div>
      </div>
      { }
      <div className="bg-slate-50 dark:bg-slate-900/40 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          <Filter className="size-3" />
          Filter Simulations
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="vehicle-filter" className="text-[10px] font-bold text-slate-500 uppercase ml-1">Vehicle</Label>
            <Select value={vehicleFilter} onValueChange={setVehicleFilter}>
              <SelectTrigger id="vehicle-filter" className="bg-white dark:bg-slate-950">
                <SelectValue placeholder="All Vehicles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Vehicles</SelectItem>
                <SelectItem value="jeepney">Jeepney</SelectItem>
                <SelectItem value="uv">UV Express</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="weather-filter" className="text-[10px] font-bold text-slate-500 uppercase ml-1">Weather</Label>
            <Select value={weatherFilter} onValueChange={setWeatherFilter}>
              <SelectTrigger id="weather-filter" className="bg-white dark:bg-slate-950">
                <SelectValue placeholder="All Conditions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Conditions</SelectItem>
                <SelectItem value="clear">Clear Skies</SelectItem>
                <SelectItem value="rain">Rainy Weather</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="origin-filter" className="text-[10px] font-bold text-slate-500 uppercase ml-1">Origin</Label>
            <Select value={originFilter} onValueChange={setOriginFilter}>
              <SelectTrigger id="origin-filter" className="bg-white dark:bg-slate-950">
                <SelectValue placeholder="Any Origin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Origin</SelectItem>
                {HIGHWAY_SEQUENCE.map((name) => (
                  <SelectItem key={name} value={name}>{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="destination-filter" className="text-[10px] font-bold text-slate-500 uppercase ml-1">Destination</Label>
            <Select value={destinationFilter} onValueChange={setDestinationFilter}>
              <SelectTrigger id="destination-filter" className="bg-white dark:bg-slate-950">
                <SelectValue placeholder="Any Destination" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Destination</SelectItem>
                {HIGHWAY_SEQUENCE.map((name) => (
                  <SelectItem key={name} value={name}>{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {(vehicleFilter !== "all" || weatherFilter !== "all" || originFilter !== "all" || destinationFilter !== "all") && (
          <div className="flex justify-end pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-xs font-bold text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 gap-2"
            >
              <X className="size-3" />
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden shadow-sm">
        <div className="relative">
          {(status === "LoadingMore" || status === "LoadingFirstPage") && results.length < currentPage * ITEMS_PER_PAGE && (
            <div className="absolute inset-0 bg-white/50 dark:bg-slate-950/50 backdrop-blur-[1px] z-20 flex items-center justify-center">
              <div className="flex items-center gap-3 bg-white dark:bg-slate-900 px-4 py-2 rounded-full border shadow-lg">
                <Loader2 className="size-4 animate-spin text-emerald-600" />
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">Loading...</span>
              </div>
            </div>
          )}
          <Table>
            <TableHeader className="bg-slate-50/50 dark:bg-slate-900/50">
              <TableRow>
                <TableHead className="font-bold text-slate-900 dark:text-slate-100 py-4">Route</TableHead>
                <TableHead className="font-bold text-slate-900 dark:text-slate-100">Vehicle</TableHead>
                <TableHead className="font-bold text-slate-900 dark:text-slate-100">Condition</TableHead>
                <TableHead className="font-bold text-slate-900 dark:text-slate-100">Distance</TableHead>
                <TableHead className="font-bold text-slate-900 dark:text-slate-100 text-right">Forecast (Avg)</TableHead>
                <TableHead className="font-bold text-slate-900 dark:text-slate-100 text-right">Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedResults.map((log) => (
                <TableRow key={log._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{log.origin}</span>
                      <ArrowRight className="size-3 text-slate-400" />
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{log.destination}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="gap-1.5 font-bold uppercase text-[10px] border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400">
                      {log.vehicle === "jeepney" ? <Bus className="size-3" /> : <Car className="size-3" />}
                      {log.vehicle}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm">
                      {log.weather === "clear" ? <Sun className="size-4 text-amber-500" /> : <Cloud className="size-4 text-blue-400" />}
                      <span className="capitalize">{log.weather}</span>
                      <span className="text-xs opacity-60">•</span>
                      <span className="text-xs">{log.time}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-slate-500">
                    {log.distance_km.toFixed(2)} km
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="font-black text-slate-900 dark:text-slate-100">
                      {Math.round(log.result_avg)}<span className="text-[10px] ml-0.5 opacity-60 font-bold">MIN</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">
                      Range: {Math.round(log.result_min)}-{Math.round(log.result_max)}m
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-xs text-slate-400 font-medium">
                    {format(new Date(log._creationTime), "MMM d, h:mm a")}
                  </TableCell>
                </TableRow>
              ))}
              {totalCount === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2 opacity-40">
                      <History className="size-12 mb-2" />
                      <p className="font-bold uppercase tracking-widest text-sm">No simulations found</p>
                      <p className="text-xs">Try adjusting your filters or run a simulation on the dashboard.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {totalPages > 1 && (
          <div className="p-4 border-t bg-slate-50/50 dark:bg-slate-900/50">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(currentPage - 1);
                    }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                {getPageNumbers().map((page, i) => (
                  <PaginationItem key={i}>
                    {typeof page === "number" ? (
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(page);
                        }}
                        isActive={currentPage === page}
                        className="cursor-pointer font-bold"
                      >
                        {page}
                      </PaginationLink>
                    ) : (
                      <PaginationEllipsis />
                    )}
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(currentPage + 1);
                    }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}
