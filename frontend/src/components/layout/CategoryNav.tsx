import Link from "next/link";
import { Gift, Heart, Calendar, Star, Flower, Smile } from "lucide-react";

const CATEGORIES = [
  { name: "Valentine's", icon: Heart, href: "/collections/valentines" },
  { name: "Birthday", icon: Gift, href: "/collections/birthday" },
  { name: "Anniversary", icon: Calendar, href: "/collections/anniversary" },
  { name: "New Arrivals", icon: Star, href: "/collections/new" },
  { name: "Flowers", icon: Flower, href: "/collections/flowers" },
  { name: "Just Because", icon: Smile, href: "/collections/just-because" },
];

export function CategoryNav() {
  return (
    <div className="py-12 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Shop by Occasion</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-8">
          {CATEGORIES.map((cat) => (
            <Link key={cat.name} href={cat.href} className="flex flex-col items-center group">
              <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-3 group-hover:bg-red-100 transition-colors">
                <cat.icon className="w-8 h-8 text-red-600" />
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-red-600">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
