import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Coins, DollarSign } from 'lucide-react';
import { useKarma } from '@/contexts/KarmaContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const KarmaModeToggle = () => {
  const { tradingMode, setTradingMode } = useKarma();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleToggle = (checked: boolean) => {
    if (checked && !user) {
      toast.error('Please sign in to use Karma trading');
      navigate('/auth');
      return;
    }
    setTradingMode(checked ? 'karma' : 'cash');
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
      <DollarSign className={`h-5 w-5 ${tradingMode === 'cash' ? 'text-primary' : 'text-muted-foreground'}`} />
      <Switch
        checked={tradingMode === 'karma'}
        onCheckedChange={handleToggle}
        id="trading-mode"
      />
      <Coins className={`h-5 w-5 ${tradingMode === 'karma' ? 'text-primary' : 'text-muted-foreground'}`} />
      <Label htmlFor="trading-mode" className="cursor-pointer">
        {tradingMode === 'karma' ? 'Karma Trading' : 'Cash Purchase'}
      </Label>
    </div>
  );
};

export default KarmaModeToggle;
