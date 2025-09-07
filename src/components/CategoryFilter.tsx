import { useState } from "react";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

const categories = [
  { id: "software", name: "Software", icon: "💻" },
  { id: "educational", name: "Educational", icon: "🎓" },
  { id: "architectural", name: "Architectural", icon: "🏗️" },
  { id: "mythological", name: "Mythological", icon: "🏛️" },
  { id: "healthcare", name: "Healthcare", icon: "🏥" },
  { id: "financial", name: "Financial", icon: "🏦" },
  { id: "creative", name: "Creative", icon: "🎨" },
  { id: "environmental", name: "Environmental", icon: "🌱" },
  { id: "research", name: "Research", icon: "🔬" },
  { id: "nonprofit", name: "Non-Profit", icon: "🤝" },
  { id: "startup", name: "Startup", icon: "🚀" },
  { id: "consulting", name: "Consulting", icon: "💼" },
];

const CategoryFilter = () => {
  const [selectedCategory, setSelectedCategory] = useState("software");

  return (
    <div className="border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center space-x-4">
          {/* Scroll Left Button */}
          <Button variant="ghost" size="icon" className="shrink-0 rounded-full">
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Categories */}
          <div className="flex-1 overflow-x-auto scrollbar-hide">
            <div className="flex space-x-8 min-w-max">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex flex-col items-center space-y-2 pb-3 border-b-2 transition-all min-w-0 ${
                    selectedCategory === category.id
                      ? "border-primary text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                  }`}
                >
                  <div className="text-xl">{category.icon}</div>
                  <span className="text-xs font-medium whitespace-nowrap">
                    {category.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Scroll Right Button */}
          <Button variant="ghost" size="icon" className="shrink-0 rounded-full">
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Filters Button */}
          <Button variant="outline" className="shrink-0 flex items-center space-x-2">
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filters</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;