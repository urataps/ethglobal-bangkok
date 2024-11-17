'use client';

import type { StrategyResult } from '@/lib/schemas';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';

// Function to generate a URL for protocol icons
export const getProtocolIcon = (protocolName: string): string => {
  if (!protocolName) {
    console.warn(
      'Protocol name is undefined or empty. Returning default icon.'
    );
    return '/fallback-icon.png'; // Fallback icon for undefined protocol names
  }

  // Convert protocol name to lowercase and remove spaces
  const formattedName = protocolName.toLowerCase().replace(/\s+/g, '-');
  return `https://icons.llamao.fi/icons/protocols/${formattedName}`;
};

// Function to handle image loading errors
export const handleImageError = (
  event: React.SyntheticEvent<HTMLImageElement, Event>
) => {
  const img = event.target as HTMLImageElement;
  img.src = '/fallback-icon.png'; // Make sure to add a fallback icon in your public folder
};

export default function Strategy({
  investments,
}: {
  investments: StrategyResult[];
}) {
  if (!investments || !Array.isArray(investments) || investments.length === 0) {
    console.log('STRATEGY', investments);
    return <Loader2 className='animate-spin' />;
  }

  // Calculate the total investment amount
  const totalAmount = investments.reduce(
    (sum, investment) => sum + (investment?.amount || 0),
    0
  );

  // Format amount as currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className={`grid gap-4 grid-cols-2`}>
      {investments.map((investment, index) => (
        <Card
          key={`${investment.protocol}-${index}`}
          className='flex flex-col justify-between'
        >
          <CardHeader>
            <CardTitle className='flex items-center justify-between'>
              <span className='flex items-center'>
                <img
                  src={getProtocolIcon(investment?.protocol || '')}
                  alt={`${investment?.protocol || 'Unknown'} icon`}
                  onError={handleImageError}
                  className='w-6 h-6 mr-2'
                />
                {(investment?.protocol || 'Unknown').charAt(0).toUpperCase() +
                  (investment?.protocol || 'Unknown').slice(1)}
              </span>
              <span className='text-2xl font-bold text-green-600'>
                {typeof investment?.APR === 'number'
                  ? investment.APR.toFixed(2)
                  : 'N/A'}
                %
              </span>
            </CardTitle>
            <CardDescription>
              {investment?.chain || 'Unknown'} Chain
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='mb-2 text-sm'>
              <div className='font-medium'>{investment?.pool || 'Unknown'}</div>
              <div>{formatCurrency(investment?.amount || 0)}</div>
            </div>
            <Progress
              value={
                totalAmount > 0 && investment?.amount
                  ? Number.parseFloat(
                      ((investment.amount / totalAmount) * 100).toFixed(1)
                    )
                  : 0.0
              }
              className='h-2'
            />
            <p className='mt-2 text-xs text-muted-foreground'>
              {totalAmount > 0 && investment?.amount
                ? ((investment.amount / totalAmount) * 100).toFixed(1)
                : 0}
              % of total investment
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
