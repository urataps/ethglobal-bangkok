"use client";

import { StrategyResult } from "@/lib/schemas";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "./ui/skeleton";
import { Loader2 } from "lucide-react";

// Function to generate a URL for protocol icons
export const getProtocolIcon = (protocolName: string): string => {
  if (!protocolName) {
    console.warn(
      "Protocol name is undefined or empty. Returning default icon."
    );
    return "/fallback-icon.png"; // Fallback icon for undefined protocol names
  }

  // Convert protocol name to lowercase and remove spaces
  const formattedName = protocolName.toLowerCase().replace(/\s+/g, "-");
  return `https://icons.llamao.fi/icons/protocols/${formattedName}`;
};

// Function to generate a URL for chain icons
export const getChainIcon = (chainName: string): string => {
  if (!chainName) {
    console.warn("Chain name is undefined or empty. Returning default icon.");
    return "/fallback-icon.png"; // Fallback icon for undefined chain names
  }

  // Convert chain name to lowercase and remove spaces
  const formattedName = chainName.toLowerCase().replace(/\s+/g, "-");
  return `https://icons.llamao.fi/icons/chains/rsz_${formattedName}`;
};

// Function to handle image loading errors
export const handleImageError = (
  event: React.SyntheticEvent<HTMLImageElement, Event>
) => {
  const img = event.target as HTMLImageElement;
  img.src = "/fallback-icon.png"; // Make sure to add a fallback icon in your public folder
};

export default function Strategy({
  strategies,
}: {
  strategies: StrategyResult[];
}) {
  if (!strategies || !Array.isArray(strategies)) {
    console.log("STRATEGY", strategies);
    return <Loader2 className="animate-spin" />;
  }

  const totalAmount = strategies.reduce(
    (sum, strategy) => sum + strategy.amount,
    0
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div
      className={`grid gap-4 ${
        strategies.length === 1
          ? "grid-cols-1"
          : strategies.length === 2
          ? "grid-cols-2"
          : strategies.length === 3
          ? "grid-cols-3"
          : "grid-cols-4"
      }`}
    >
      {" "}
      {strategies.map((strategy, index) => (
        <Card key={index} className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <img
                  src={getProtocolIcon(strategy.protocol)}
                  alt={`${strategy.protocol} icon`}
                  onError={handleImageError}
                  className="w-6 h-6 mr-2"
                />
                {strategy.protocol.charAt(0).toUpperCase() +
                  strategy.protocol.slice(1)}
              </span>
              <span className="text-2xl font-bold text-green-600">
                {strategy.APR.toFixed(2)}%
              </span>
            </CardTitle>
            <CardDescription>{strategy.chain} Chain</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-2 text-sm">
              <div className="font-medium">{strategy.pool}</div>
              <div>{formatCurrency((totalAmount / strategy.amount) * 100)}</div>
            </div>
            <Progress
              value={(strategy.amount / totalAmount) * 100}
              className="h-2"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              {((strategy.amount / totalAmount) * 100).toFixed(1)}% of total
              investment
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
