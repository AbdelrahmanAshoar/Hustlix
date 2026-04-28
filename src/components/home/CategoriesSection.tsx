"use client";

import { Card, CardContent } from "@/components/ui/card";

const categories = [
  "Development",
  "Design",
  "Marketing",
  "Writing",
  "Video",
  "Music",
];

type CategoriesSectionProps = {
  onCategoryClick: (category: string) => void;
};

export default function CategoriesSection({ onCategoryClick }: CategoriesSectionProps) {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-10 text-center">Explore by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Card
              key={category}
              className="hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group"
              onClick={() => onCategoryClick(category)}
            >
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-primary font-bold text-xl">{category[0]}</span>
                </div>
                <h3 className="font-semibold text-sm">{category}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
