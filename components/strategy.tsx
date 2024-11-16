'use client';

import { StrategyResult } from '@/lib/schemas';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from './ui/skeleton';
import { Loader2 } from 'lucide-react';

export default function Strategy({
  strategies,
}: {
  strategies: StrategyResult[];
}) {
  if (!strategies || !Array.isArray(strategies)) {
    console.log('STRATEGY', strategies);
    return <Loader2 className='animate-spin' />;
  }

  const totalAmount = strategies.reduce(
    (sum, strategy) => sum + strategy.amount,
    0
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
      {strategies.map((strategy, index) => (
        <Card key={index} className='flex flex-col justify-between'>
          <CardHeader>
            <CardTitle className='flex items-center justify-between'>
              <div className='flex flex-col'>
                <span>{strategy.chain}</span>
                <span className='text-2xl font-bold text-green-600'>
                  {strategy.APR.toFixed(2)}%
                </span>
              </div>
            </CardTitle>
            <CardDescription>{strategy.protocol}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='mb-2 flex items-center justify-between text-sm'>
              <span className='font-medium'>{strategy.pool}</span>
              <span>{formatCurrency(strategy.amount)}</span>
            </div>
            <Progress
              value={(strategy.amount / totalAmount) * 100}
              className='h-2'
            />
            <p className='mt-2 text-xs text-muted-foreground'>
              {((strategy.amount / totalAmount) * 100).toFixed(1)}% of total
              investment
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
