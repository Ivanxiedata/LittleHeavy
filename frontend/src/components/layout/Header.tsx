import Link from "next/link";
import { Search, ShoppingCart, User, Menu } from "lucide-react";

export const Header = () => {
  return (
    <header className="w-full border-b border-gray-200 bg-white">
      {/* Announcement Bar */}
      <div className="bg-red-600 py-2 text-center text-sm font-medium text-white">
        Free shipping on all US orders over $24
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex flex-1 items-center">
            <Link href="/" className="text-2xl font-bold tracking-tighter text-red-600 uppercase">
              Little Heavy
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:space-x-8">
            {["Valentine's Day", "Stash Up", "Birthday", "Occasions", "Recipient", "Product Types"].map((item) => (
              <Link
                key={item}
                href={`/collections/${item.toLowerCase().replace(" ", "-")}`}
                className="text-sm font-medium text-gray-700 hover:text-red-600"
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex flex-1 items-center justify-end space-x-6">
            <div className="hidden lg:flex">
              <Search className="h-6 w-6 text-gray-400 hover:text-gray-500 cursor-pointer" />
            </div>
            <Link href="/login" className="text-gray-400 hover:text-gray-500">
              <User className="h-6 w-6" />
            </Link>
            <Link href="/cart" className="group -m-2 flex items-center p-2">
              <ShoppingCart className="h-6 w-6 text-gray-400 group-hover:text-gray-500" />
              <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">0</span>
            </Link>
            <div className="flex md:hidden">
              <Menu className="h-6 w-6 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
