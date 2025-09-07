import { useState } from "react";
import { Search, MapPin, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const SearchBar = () => {
  const [activeTab, setActiveTab] = useState("learning");

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="flex bg-muted rounded-full p-1">
          <button
            onClick={() => setActiveTab("learning")}
            className={`px-6 py-3 rounded-full font-medium transition-all ${
              activeTab === "learning"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            A Platform for Experiential Learning
          </button>
        </div>
      </div>

      {/* Search Form */}
      <div className="bg-background border border-border rounded-full shadow-lg p-2 flex items-center divide-x divide-border">
        {/* Where */}
        <div className="flex-1 px-6 py-4 cursor-pointer hover:bg-muted rounded-full transition-colors">
          <div className="flex items-center space-x-3">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="font-medium text-sm">Where</div>
              <div className="text-muted-foreground text-sm">Search organizations</div>
            </div>
          </div>
        </div>

        {/* Check in */}
        <div className="flex-1 px-6 py-4 cursor-pointer hover:bg-muted rounded-full transition-colors">
          <div className="flex items-center space-x-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="font-medium text-sm">From date</div>
              <div className="text-muted-foreground text-sm">Add dates</div>
            </div>
          </div>
        </div>

        {/* Check out */}
        <div className="flex-1 px-6 py-4 cursor-pointer hover:bg-muted rounded-full transition-colors">
          <div className="flex items-center space-x-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="font-medium text-sm">To date</div>
              <div className="text-muted-foreground text-sm">Add dates</div>
            </div>
          </div>
        </div>

        {/* Who */}
        <div className="flex-1 px-6 py-4 cursor-pointer hover:bg-muted rounded-full transition-colors">
          <div className="flex items-center space-x-3">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="font-medium text-sm">Skills</div>
              <div className="text-muted-foreground text-sm">Add skills</div>
            </div>
          </div>
        </div>

        {/* Search Button */}
        <div className="px-2">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-4">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;