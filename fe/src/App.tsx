import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AuthModals from "@/components/AuthModals";
import Pagination from "@/components/Pagination";
import {
  Plus,
  Heart,
  MapPin,
  Clock,
  CheckCircle,
  Moon,
  Sun,
  Users,
  HandHeart,
  TrendingUp,
  Search,
  Filter,
  X,
  Tag,
  UserX,
  Copy,
  Check,
  LogIn,
  UserPlus,
  LogOut,
  BookMarked,
  Edit3,
  Trash2,
  Star,
  BarChart3,
  Activity,
  Crown,
  Loader2,
} from "lucide-react";

// Import our custom hook
import { usePrayerRequests } from "@/hooks/usePrayerRequests";

interface User {
  id: string;
  name: string;
  email: string;
}

interface PrayerRequest {
  id: string;
  name: string;
  request: string;
  location?: string;
  createdAt: Date;
  prayedFor: number;
  isUrgent?: boolean;
  isAnonymous?: boolean;
  category: string;
  prayedByUser?: boolean;
  authorId?: string;
  savedBy?: string[];
}

const CATEGORIES = [
  {
    value: "health",
    label: "Health",
    color: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  },
  {
    value: "travel",
    label: "Travel",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  },
  {
    value: "marriage",
    label: "Marriage",
    color: "bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400",
  },
  {
    value: "work",
    label: "Work",
    color:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
  },
  {
    value: "studies",
    label: "Studies",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  },
  {
    value: "family",
    label: "Family",
    color:
      "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  },
  {
    value: "guidance",
    label: "Guidance",
    color:
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400",
  },
  {
    value: "other",
    label: "Other",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
  },
];

const ITEMS_PER_PAGE = 6;

function App() {
  // Use our custom hook for prayer requests
  const {
    prayerRequests,
    loading,
    error: apiError,
    createPrayerRequest,
    incrementPrayCount,
    deletePrayerRequest,
  } = usePrayerRequests();

  // Authentication state
  const [user, setUser] = useState<User | null>(null);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  // App state
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filterUrgent, setFilterUrgent] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showMyRequests, setShowMyRequests] = useState(false);
  const [showSavedRequests, setShowSavedRequests] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newRequest, setNewRequest] = useState({
    name: "",
    request: "",
    location: "",
    isUrgent: false,
    isAnonymous: false,
    category: "other",
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Show API errors
  useEffect(() => {
    if (apiError) {
      setAlertMessage(apiError);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 5000);
    }
  }, [apiError]);

  // Filter requests based on search and filters
  const filteredRequests = useMemo(() => {
    let filtered = prayerRequests.filter((request) => {
      const matchesSearch =
        request.request.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (!request.isAnonymous &&
          request.name.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === "all" || request.category === selectedCategory;
      const matchesUrgent = !filterUrgent || request.isUrgent;

      let matchesUserFilter = true;
      if (showMyRequests && user) {
        matchesUserFilter = request.authorId === user.id;
      } else if (showSavedRequests && user) {
        matchesUserFilter = request.savedBy?.includes(user.id) || false;
      }

      return (
        matchesSearch && matchesCategory && matchesUrgent && matchesUserFilter
      );
    });

    return filtered;
  }, [
    prayerRequests,
    searchQuery,
    selectedCategory,
    filterUrgent,
    showMyRequests,
    showSavedRequests,
    user,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    selectedCategory,
    filterUrgent,
    showMyRequests,
    showSavedRequests,
  ]);

  // Authentication functions
  const handleSignIn = (userData: User) => {
    setUser(userData);
  };

  const handleSignOut = () => {
    setUser(null);
    setShowMyRequests(false);
    setShowSavedRequests(false);
  };

  const handleSaveRequest = (requestId: string) => {
    if (!user) return;

    // This would need backend implementation for user favorites
    // For now, just local state management
    console.log(
      "Save request functionality needs backend implementation",
      requestId
    );
  };

  const handleDeleteRequest = async (requestId: string) => {
    const success = await deletePrayerRequest(requestId);
    if (success) {
      setAlertMessage("Prayer request has been deleted.");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      newRequest.request.trim() &&
      (newRequest.isAnonymous || newRequest.name.trim() || user)
    ) {
      setIsSubmitting(true);

      const success = await createPrayerRequest(newRequest);

      if (success) {
        setNewRequest({
          name: "",
          request: "",
          location: "",
          isUrgent: false,
          isAnonymous: false,
          category: "other",
        });
        setIsDialogOpen(false);
        setShowAlert(true);
        setAlertMessage(
          "Your prayer request has been submitted. May Allah answer your prayers. Ameen."
        );
        setTimeout(() => setShowAlert(false), 3000);
      }

      setIsSubmitting(false);
    }
  };

  const handlePrayedFor = async (id: string) => {
    const success = await incrementPrayCount(id);
    if (success) {
      setAlertMessage("May Allah accept your prayers. Ameen.");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
    }
  };

  const handleCopyRequest = async (request: PrayerRequest) => {
    const displayName = request.isAnonymous ? "Anonymous" : request.name;
    const text = `Prayer Request from ${displayName}:\n\n${
      request.request
    }\n\n${
      request.location ? `Location: ${request.location}\n` : ""
    }Please remember them in your prayers. 🤲`;

    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(request.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setFilterUrgent(false);
    setShowMyRequests(false);
    setShowSavedRequests(false);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const getCategoryInfo = (category: string) => {
    return (
      CATEGORIES.find((cat) => cat.value === category) ||
      CATEGORIES[CATEGORIES.length - 1]
    );
  };

  // Calculate metrics
  const totalRequests = prayerRequests.length;
  const totalPrayers = prayerRequests.reduce(
    (sum, req) => sum + req.prayedFor,
    0
  );
  const urgentRequests = prayerRequests.filter((req) => req.isUrgent).length;
  const userPrayedCount = prayerRequests.filter(
    (req) => req.prayedByUser
  ).length;
  const userRequestsCount = user
    ? prayerRequests.filter((req) => req.authorId === user.id).length
    : 0;
  const savedRequestsCount = user
    ? prayerRequests.filter((req) => req.savedBy?.includes(user.id)).length
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-background to-blue-50 dark:from-green-950/20 dark:via-background dark:to-blue-950/20 transition-colors duration-300">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="text-center lg:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-green-800 dark:text-green-400 mb-2">
                🕌 Prayer Requests Platform
              </h1>
              <p className="text-green-600 dark:text-green-300 text-base sm:text-lg">
                Connect with your Muslim brothers and sisters in prayer
              </p>
              <p className="text-green-500 dark:text-green-400 text-xs sm:text-sm mt-1 max-w-md mx-auto lg:mx-0">
                "And when My servants ask you concerning Me, indeed I am
                near..." - Quran 2:186
              </p>
            </div>

            <div className="flex flex-row items-center justify-center gap-3">
              {/* Dark Mode Toggle */}
              <div className="flex items-center gap-2 bg-background/50 dark:bg-background/50 rounded-full px-3 py-2 border border-border">
                <Sun className="h-4 w-4 text-yellow-500" />
                <Switch
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                  className="data-[state=checked]:bg-green-600"
                />
                <Moon className="h-4 w-4 text-blue-500" />
              </div>

              {/* Authentication */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full p-0"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-green-600 text-white">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setShowMyRequests(!showMyRequests)}
                    >
                      <Edit3 className="mr-2 h-4 w-4" />
                      <span>My Requests ({userRequestsCount})</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setShowSavedRequests(!showSavedRequests)}
                    >
                      <BookMarked className="mr-2 h-4 w-4" />
                      <span>Saved Requests ({savedRequestsCount})</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex flex-row items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsSignInOpen(true)}
                    className="h-9 px-3 text-sm font-medium flex items-center justify-center"
                  >
                    <LogIn className="h-4 w-4 mr-1.5 flex-shrink-0" />
                    <span>Sign In</span>
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setIsSignUpOpen(true)}
                    className="h-9 px-3 text-sm font-medium bg-green-600 hover:bg-green-700 text-white flex items-center justify-center"
                  >
                    <UserPlus className="h-4 w-4 mr-1.5 flex-shrink-0" />
                    <span>Sign Up</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Alert */}
      {showAlert && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <Alert className="bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-800 dark:text-green-300">
              {alertMessage}
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Metrics Dashboard */}
        <div className="space-y-6 mb-8">
          {/* Main Platform Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-green-600/5"></div>
              <CardContent className="relative p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                        <Users className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                        Total Requests
                      </span>
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-foreground">
                      {totalRequests}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-red-600/5"></div>
              <CardContent className="relative p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                        <HandHeart className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 dark:text-red-400" />
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                        Total Prayers
                      </span>
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-foreground">
                      {totalPrayers}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/5"></div>
              <CardContent className="relative p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                        <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                        Urgent
                      </span>
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-foreground">
                      {urgentRequests}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-blue-600/5"></div>
              <CardContent className="relative p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                        <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                        You Prayed
                      </span>
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-foreground">
                      {userPrayedCount}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* User-specific metrics when logged in */}
          {user && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <Card className="border-2 border-green-200 dark:border-green-800">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-xl">
                      <Crown className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Your Requests
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        {userRequestsCount}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-purple-200 dark:border-purple-800">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-xl">
                      <BookMarked className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Saved Requests
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        {savedRequestsCount}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-indigo-200 dark:border-indigo-800">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-indigo-100 dark:bg-indigo-900/20 rounded-xl">
                      <BarChart3 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Your Impact
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        {prayerRequests
                          .filter((req) => req.authorId === user.id)
                          .reduce((sum, req) => sum + req.prayedFor, 0)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Search and Filter Section */}
        <div className="bg-card/50 rounded-lg p-4 sm:p-6 mb-8 border border-border">
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search prayer requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filters:</span>
              </div>

              <div className="flex flex-wrap gap-2">
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  variant={filterUrgent ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterUrgent(!filterUrgent)}
                  className={
                    filterUrgent ? "bg-orange-600 hover:bg-orange-700" : ""
                  }
                >
                  Urgent Only
                </Button>

                {user && (
                  <>
                    <Button
                      variant={showMyRequests ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setShowMyRequests(!showMyRequests);
                        setShowSavedRequests(false);
                      }}
                      className={
                        showMyRequests ? "bg-green-600 hover:bg-green-700" : ""
                      }
                    >
                      <Edit3 className="h-4 w-4 mr-1" />
                      My Requests
                    </Button>

                    <Button
                      variant={showSavedRequests ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setShowSavedRequests(!showSavedRequests);
                        setShowMyRequests(false);
                      }}
                      className={
                        showSavedRequests
                          ? "bg-purple-600 hover:bg-purple-700"
                          : ""
                      }
                    >
                      <BookMarked className="h-4 w-4 mr-1" />
                      Saved
                    </Button>
                  </>
                )}

                {(searchQuery ||
                  selectedCategory !== "all" ||
                  filterUrgent ||
                  showMyRequests ||
                  showSavedRequests) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                    className="text-muted-foreground"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Add Prayer Request Button */}
        <div className="text-center mb-8">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white px-6 sm:px-8 py-3 rounded-full text-base sm:text-lg transition-all duration-200 hover:scale-105">
                <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Submit Prayer Request
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] mx-4 max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-green-800 dark:text-green-400 text-lg sm:text-xl">
                  Submit Your Prayer Request
                </DialogTitle>
                <DialogDescription className="text-sm sm:text-base">
                  Share your request with the community. Your Muslim brothers
                  and sisters will pray for you.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={newRequest.isAnonymous}
                    onChange={(e) =>
                      setNewRequest({
                        ...newRequest,
                        isAnonymous: e.target.checked,
                      })
                    }
                    className="rounded border-border"
                  />
                  <UserX className="h-4 w-4 text-muted-foreground" />
                  <label
                    htmlFor="anonymous"
                    className="text-sm text-foreground"
                  >
                    Post anonymously (your name won't be shown)
                  </label>
                </div>

                {!newRequest.isAnonymous && (
                  <div>
                    <label className="text-sm font-medium text-foreground">
                      Your Name
                    </label>
                    <Input
                      value={newRequest.name}
                      onChange={(e) =>
                        setNewRequest({ ...newRequest, name: e.target.value })
                      }
                      placeholder="Enter your name"
                      required
                      className="mt-1"
                    />
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-foreground">
                    Category
                  </label>
                  <Select
                    value={newRequest.category}
                    onValueChange={(value) =>
                      setNewRequest({ ...newRequest, category: value })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          <div className="flex items-center gap-2">
                            <Tag className="h-3 w-3" />
                            {category.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">
                    Prayer Request
                  </label>
                  <Textarea
                    value={newRequest.request}
                    onChange={(e) =>
                      setNewRequest({ ...newRequest, request: e.target.value })
                    }
                    placeholder="Please describe what you would like prayers for..."
                    rows={4}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Location (Optional)
                  </label>
                  <Input
                    value={newRequest.location}
                    onChange={(e) =>
                      setNewRequest({ ...newRequest, location: e.target.value })
                    }
                    placeholder="e.g., Makkah, Madinah, or your city"
                    className="mt-1"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="urgent"
                    checked={newRequest.isUrgent}
                    onChange={(e) =>
                      setNewRequest({
                        ...newRequest,
                        isUrgent: e.target.checked,
                      })
                    }
                    className="rounded border-border"
                  />
                  <label htmlFor="urgent" className="text-sm text-foreground">
                    Mark as urgent
                  </label>
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 w-full sm:w-auto"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Request"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Prayer Requests */}
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-semibold text-green-800 dark:text-green-400">
              Prayer Requests ({filteredRequests.length})
            </h2>
          </div>

          {loading ? (
            <Card className="p-8 text-center">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                <p className="text-muted-foreground">
                  Loading prayer requests...
                </p>
              </div>
            </Card>
          ) : filteredRequests.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">
                No prayer requests found matching your criteria.
              </p>
              <Button variant="outline" onClick={clearFilters} className="mt-4">
                Clear Filters
              </Button>
            </Card>
          ) : (
            <>
              <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
                {paginatedRequests.map((request) => {
                  const categoryInfo = getCategoryInfo(request.category);
                  const displayName = request.isAnonymous
                    ? "Anonymous"
                    : request.name;
                  const isOwnRequest = user && request.authorId === user.id;
                  const isSaved = user && request.savedBy?.includes(user.id);

                  return (
                    <Card
                      key={request.id}
                      className="shadow-lg hover:shadow-xl transition-all duration-200 border-l-4 border-l-green-500 dark:border-l-green-400 hover:scale-[1.02] bg-card"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex flex-col gap-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-base sm:text-lg text-green-800 dark:text-green-400 flex flex-wrap items-center gap-2">
                                <span className="flex items-center gap-1">
                                  {request.isAnonymous && (
                                    <UserX className="h-4 w-4" />
                                  )}
                                  {displayName}
                                  {isOwnRequest && (
                                    <Crown className="h-4 w-4 text-yellow-500" />
                                  )}
                                </span>
                                {request.isUrgent && (
                                  <Badge
                                    variant="destructive"
                                    className="text-xs"
                                  >
                                    Urgent
                                  </Badge>
                                )}
                              </CardTitle>
                              <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1 text-xs sm:text-sm">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatTimeAgo(request.createdAt)}
                                </span>
                                {request.location && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {request.location}
                                  </span>
                                )}
                              </CardDescription>
                            </div>

                            {/* Action buttons for logged in users */}
                            {user && (
                              <div className="flex items-center gap-1">
                                <Button
                                  onClick={() => handleSaveRequest(request.id)}
                                  variant="ghost"
                                  size="sm"
                                  className={`p-2 ${
                                    isSaved
                                      ? "text-purple-600 dark:text-purple-400"
                                      : "text-muted-foreground"
                                  }`}
                                >
                                  <Star
                                    className={`h-4 w-4 ${
                                      isSaved ? "fill-current" : ""
                                    }`}
                                  />
                                </Button>

                                {isOwnRequest && (
                                  <Button
                                    onClick={() =>
                                      handleDeleteRequest(request.id)
                                    }
                                    variant="ghost"
                                    size="sm"
                                    className="p-2 text-red-500 hover:text-red-700 dark:text-red-400"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Category Tag */}
                          <div className="flex items-center gap-2">
                            <Badge className={`text-xs ${categoryInfo.color}`}>
                              <Tag className="h-3 w-3 mr-1" />
                              {categoryInfo.label}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="py-3">
                        <p className="text-foreground leading-relaxed text-sm sm:text-base">
                          {request.request}
                        </p>
                      </CardContent>
                      <CardFooter className="flex flex-col gap-3 pt-3">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            <Heart className="h-4 w-4 text-red-500" />
                            <span className="text-xs sm:text-sm text-muted-foreground">
                              {request.prayedFor} prayers
                            </span>
                          </div>
                          <Button
                            onClick={() => handleCopyRequest(request)}
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-foreground"
                          >
                            {copiedId === request.id ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>

                        <Button
                          onClick={() => handlePrayedFor(request.id)}
                          variant={request.prayedByUser ? "default" : "outline"}
                          size="sm"
                          className={
                            request.prayedByUser
                              ? "bg-green-600 hover:bg-green-700 text-white w-full"
                              : "border-green-600 text-green-600 hover:bg-green-50 dark:border-green-400 dark:text-green-400 dark:hover:bg-green-950/20 w-full transition-colors"
                          }
                          disabled={request.prayedByUser}
                        >
                          {request.prayedByUser ? (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Prayed ✓
                            </>
                          ) : (
                            <>
                              <Heart className="mr-2 h-4 w-4" />I Prayed for
                              This
                            </>
                          )}
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 py-8 border-t border-border">
          <p className="text-green-600 dark:text-green-400 text-sm sm:text-base max-w-2xl mx-auto">
            "And whoever relies upon Allah - then He is sufficient for him.
            Indeed, Allah will accomplish His purpose." - Quran 65:3
          </p>
          <p className="text-green-500 dark:text-green-300 text-xs sm:text-sm mt-2">
            May Allah accept all prayers and grant what is best for everyone.
            Ameen.
          </p>
        </div>
      </div>

      {/* Authentication Modals */}
      <AuthModals
        isSignInOpen={isSignInOpen}
        isSignUpOpen={isSignUpOpen}
        onSignInClose={() => setIsSignInOpen(false)}
        onSignUpClose={() => setIsSignUpOpen(false)}
        onSignIn={handleSignIn}
        onSwitchToSignUp={() => {
          setIsSignInOpen(false);
          setIsSignUpOpen(true);
        }}
        onSwitchToSignIn={() => {
          setIsSignUpOpen(false);
          setIsSignInOpen(true);
        }}
      />
    </div>
  );
}

export default App;
