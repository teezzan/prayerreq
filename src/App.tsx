import { useState } from "react";
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
import { Plus, Heart, MapPin, Clock, CheckCircle } from "lucide-react";

interface PrayerRequest {
  id: string;
  name: string;
  request: string;
  location?: string;
  createdAt: Date;
  prayedFor: number;
  isUrgent?: boolean;
}

function App() {
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([
    {
      id: "1",
      name: "Sarah Ahmad",
      request:
        "Please pray for my mother's health. She is undergoing surgery next week. May Allah grant her quick recovery.",
      location: "Makkah, Saudi Arabia",
      createdAt: new Date("2024-01-15"),
      prayedFor: 42,
      isUrgent: true,
    },
    {
      id: "2",
      name: "Muhammad Ali",
      request:
        "Going for Umrah next month, please include me and my family in your prayers. May Allah accept our pilgrimage.",
      location: "Madinah, Saudi Arabia",
      createdAt: new Date("2024-01-14"),
      prayedFor: 28,
    },
    {
      id: "3",
      name: "Fatima Hassan",
      request:
        "Please pray for success in my studies and that Allah guides me to the right path in my career.",
      createdAt: new Date("2024-01-13"),
      prayedFor: 15,
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newRequest, setNewRequest] = useState({
    name: "",
    request: "",
    location: "",
    isUrgent: false,
  });
  const [showAlert, setShowAlert] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRequest.name.trim() && newRequest.request.trim()) {
      const request: PrayerRequest = {
        id: Date.now().toString(),
        name: newRequest.name,
        request: newRequest.request,
        location: newRequest.location || undefined,
        createdAt: new Date(),
        prayedFor: 0,
        isUrgent: newRequest.isUrgent,
      };
      setPrayerRequests([request, ...prayerRequests]);
      setNewRequest({ name: "", request: "", location: "", isUrgent: false });
      setIsDialogOpen(false);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  const handlePrayedFor = (id: string) => {
    setPrayerRequests((requests) =>
      requests.map((request) =>
        request.id === id
          ? { ...request, prayedFor: request.prayedFor + 1 }
          : request
      )
    );
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-green-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-green-800 mb-2">
              🕌 Prayer Requests Platform
            </h1>
            <p className="text-green-600 text-lg">
              Connect with your Muslim brothers and sisters in prayer
            </p>
            <p className="text-green-500 text-sm mt-1">
              "And when My servants ask you concerning Me, indeed I am near..."
              - Quran 2:186
            </p>
          </div>
        </div>
      </div>

      {/* Alert */}
      {showAlert && (
        <div className="max-w-4xl mx-auto px-4 pt-4">
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Your prayer request has been submitted. May Allah answer your
              prayers.
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Add Prayer Request Button */}
        <div className="text-center mb-8">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full text-lg">
                <Plus className="mr-2 h-5 w-5" />
                Submit Prayer Request
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="text-green-800">
                  Submit Your Prayer Request
                </DialogTitle>
                <DialogDescription>
                  Share your request with the community. Your Muslim brothers
                  and sisters will pray for you.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Your Name
                  </label>
                  <Input
                    value={newRequest.name}
                    onChange={(e) =>
                      setNewRequest({ ...newRequest, name: e.target.value })
                    }
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
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
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Location (Optional)
                  </label>
                  <Input
                    value={newRequest.location}
                    onChange={(e) =>
                      setNewRequest({ ...newRequest, location: e.target.value })
                    }
                    placeholder="e.g., Makkah, Madinah, or your city"
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
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="urgent" className="text-sm text-gray-700">
                    Mark as urgent
                  </label>
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Submit Request
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Prayer Requests */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-green-800 text-center mb-6">
            Current Prayer Requests
          </h2>

          {prayerRequests.map((request) => (
            <Card
              key={request.id}
              className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-green-500"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg text-green-800 flex items-center gap-2">
                      {request.name}
                      {request.isUrgent && (
                        <Badge variant="destructive" className="text-xs">
                          Urgent
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-1">
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
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {request.request}
                </p>
              </CardContent>
              <CardFooter className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-gray-600">
                    {request.prayedFor} people have prayed for this request
                  </span>
                </div>
                <Button
                  onClick={() => handlePrayedFor(request.id)}
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-50"
                >
                  <Heart className="mr-2 h-4 w-4" />I Prayed for This
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 py-8 border-t border-green-200">
          <p className="text-green-600 text-sm">
            "And whoever relies upon Allah - then He is sufficient for him.
            Indeed, Allah will accomplish His purpose." - Quran 65:3
          </p>
          <p className="text-green-500 text-xs mt-2">
            May Allah accept all prayers and grant what is best for everyone.
            Ameen.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
