import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, ShoppingBag, Heart, ChevronDown, User, LogOut } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import MegaMenu from './MegaMenu';
import SearchOverlay from './SearchOverlay';
import WishlistDrawer from './WishlistDrawer';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { state } = useCart();
  const { state: wishlistState } = useWishlist();
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };
  const navLinks = [{
    name: 'New Arrivals',
    href: '/new-arrivals'
  }, {
    name: 'Women',
    href: '/women',
    hasDropdown: true
  }, {
    name: 'Men',
    href: '/men',
    hasDropdown: true
  }, {
    name: 'All Products',
    href: '/products'
  }, {
    name: 'Collections',
    href: '/collections'
  }, {
    name: 'About',
    href: '/about'
  }];
  const handleMegaMenuToggle = (isOpen: boolean, category?: string) => {
    setIsMegaMenuOpen(isOpen);
    if (isOpen && category) {
      setActiveCategory(category);
    } else if (!isOpen) {
      // Delay hiding category to allow for smooth transitions
      setTimeout(() => setActiveCategory(null), 100);
    }
  };
  return <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <h1 className="text-2xl font-black tracking-tight">
                FIT<span className="text-sky-500">FORGE</span>
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8 relative">
              {navLinks.map(link => (
                <div 
                  key={link.name} 
                  className="relative group"
                >
                  <Link 
                    to={link.href} 
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 relative flex items-center gap-1 story-link py-4"
                    onMouseEnter={() => link.hasDropdown && handleMegaMenuToggle(true, link.name.toLowerCase())}
                  >
                    {link.name}
                    {link.hasDropdown && <ChevronDown size={16} />}
                  </Link>
                  {/* Invisible hover bridge to prevent menu flicker */}
                  {link.hasDropdown && (
                    <div 
                      className="absolute top-full left-0 right-0 h-4 invisible group-hover:visible"
                      onMouseEnter={() => handleMegaMenuToggle(true, link.name.toLowerCase())}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-muted-foreground hover:text-foreground transition-colors duration-200" onClick={() => setIsSearchOpen(true)}>
                <Search size={20} />
              </button>
              <WishlistDrawer>
                <button className="p-2 text-muted-foreground hover:text-foreground transition-colors duration-200 relative">
                  <Heart size={20} />
                  {wishlistState.totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                      {wishlistState.totalItems > 9 ? '9+' : wishlistState.totalItems}
                    </span>
                  )}
                </button>
              </WishlistDrawer>
              <Link to="/cart" className="p-2 text-muted-foreground hover:text-foreground transition-colors duration-200 relative">
                <ShoppingBag size={20} />
                {state.totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-electric-blue text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                    {state.totalItems > 9 ? '9+' : state.totalItems}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.username} />
                        <AvatarFallback>{profile?.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{profile?.username}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/account')}>
                      <User className="mr-2 h-4 w-4" />
                      My Account
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="ghost" size="sm" onClick={() => navigate('/auth')}>
                  Sign In
                </Button>
              )}

              {/* Mobile Menu Button */}
              <button className="lg:hidden p-2 text-muted-foreground hover:text-foreground transition-colors duration-200" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && <div className="lg:hidden py-4 border-t border-border animate-fade-in">
              <div className="flex flex-col space-y-4">
                {navLinks.map(link => <Link key={link.name} to={link.href} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 py-2" onClick={() => setIsMenuOpen(false)}>
                    {link.name}
                  </Link>)}
              </div>
            </div>}
        </div>

        {/* Mega Menu */}
        <MegaMenu 
          isOpen={isMegaMenuOpen} 
          activeCategory={activeCategory}
          onClose={() => handleMegaMenuToggle(false)} 
          onMouseEnter={() => handleMegaMenuToggle(true, activeCategory)}
          onMouseLeave={() => handleMegaMenuToggle(false)}
        />
      </nav>

      {/* Search Overlay */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>;
};
export default Navigation;