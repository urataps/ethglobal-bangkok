'use client';

import type { Message } from 'ai';
import cx from 'classnames';
import { motion } from 'framer-motion';
import type { Dispatch, SetStateAction } from 'react';

import type { Vote } from '@/lib/db/schema';

import type { UIBlock } from './block';
import { DocumentToolCall, DocumentToolResult } from './document';
import { SparklesIcon } from './icons';
import { Markdown } from './markdown';
import { MessageActions } from './message-actions';
import { PreviewAttachment } from './preview-attachment';
import { Weather } from './weather';
import Strategy from './strategy';
import { Button } from './ui/button';
import { createWalletClient, custom, parseEther } from 'viem';
import { baseSepolia } from 'viem/chains';
import { IEthereum } from '@dynamic-labs/ethereum';
import { toast } from 'sonner';
import Link from 'next/link';

export const PreviewMessage = ({
  chatId,
  message,
  block,
  setBlock,
  vote,
  isLoading,
}: {
  chatId: string;
  message: Message;
  block: UIBlock;
  setBlock: Dispatch<SetStateAction<UIBlock>>;
  vote: Vote | undefined;
  isLoading: boolean;
}) => {
  const walletClient = createWalletClient({
    chain: baseSepolia,
    transport: custom<IEthereum>(window.ethereum!),
  });

  const onInvest = async () => {
    walletClient.switchChain({
      id: baseSepolia.id,
    });

    const address = await walletClient.getAddresses();
    const hash = await walletClient.writeContract({
      account: address[0],
      abi: [
        {
          type: 'function',
          name: 'addLiquidityWithETH',
          inputs: [
            {
              name: 'router',
              type: 'address',
              internalType: 'contract IUniswapV2Router02',
            },
            { name: 'tokenA', type: 'address', internalType: 'address' },
            { name: 'tokenB', type: 'address', internalType: 'address' },
          ],
          outputs: [
            { name: 'amountA', type: 'uint256', internalType: 'uint256' },
            { name: 'amountB', type: 'uint256', internalType: 'uint256' },
            { name: 'liquidity', type: 'uint256', internalType: 'uint256' },
          ],
          stateMutability: 'payable',
        },
      ],
      functionName: 'addLiquidityWithETH',
      args: [
        '0x926C2095204B000cFb9088A208aB0f742dEded0B',
        '0x25796265CBA4AE2AdbB3ED926ca4D981b66C2ef9',
        '0x4Dfe25A733c24b56FF40AcA91EFcc9eE260240E4',
      ],
      address: '0xaB470Aa6b1a8DDEfbA4096e189877694855171e0',
      value: parseEther('0.01'),
    });
    toast.success(
      <Link
        href={`https://base-sepolia.blockscout.com/tx/${hash}`}
        target='_blank'
      >
        Transaction sent
      </Link>
    );
  };

  return (
    <motion.div
      className='w-full mx-auto max-w-3xl px-4 group/message'
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      data-role={message.role}
    >
      <div
        className={cx(
          'group-data-[role=user]/message:bg-primary group-data-[role=user]/message:text-primary-foreground flex gap-4 group-data-[role=user]/message:px-3 w-full group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:py-2 rounded-xl'
        )}
      >
        {message.role === 'assistant' && (
          <div className='size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border'>
            <SparklesIcon size={14} />
          </div>
        )}

        <div className='flex flex-col gap-2 w-full'>
          {message.content && (
            <div className='flex flex-col gap-4'>
              <Markdown>{message.content as string}</Markdown>
            </div>
          )}

          {message.toolInvocations && message.toolInvocations.length > 0 && (
            <div className='flex flex-col gap-4'>
              {message.toolInvocations.map((toolInvocation) => {
                const { toolName, toolCallId, state, args } = toolInvocation;

                if (state === 'result') {
                  const { result } = toolInvocation;

                  return (
                    <div key={toolCallId}>
                      {toolName === 'getWeather' ? (
                        <Weather weatherAtLocation={result} />
                      ) : toolName === 'createDocument' ? (
                        <DocumentToolResult
                          type='create'
                          result={result}
                          block={block}
                          setBlock={setBlock}
                        />
                      ) : toolName === 'updateDocument' ? (
                        <DocumentToolResult
                          type='update'
                          result={result}
                          block={block}
                          setBlock={setBlock}
                        />
                      ) : toolName === 'requestSuggestions' ? (
                        <DocumentToolResult
                          type='request-suggestions'
                          result={result}
                          block={block}
                          setBlock={setBlock}
                        />
                      ) : toolName === 'getStrategies' ? (
                        <div>
                          <Strategy investments={result.strategies} />
                          <Button className='w-full' onClick={onInvest}>
                            Invest now
                          </Button>
                        </div>
                      ) : (
                        <pre>{JSON.stringify(result, null, 2)}</pre>
                      )}
                    </div>
                  );
                }
                return (
                  <div
                    key={toolCallId}
                    className={cx({
                      skeleton: ['getWeather'].includes(toolName),
                    })}
                  >
                    {toolName === 'getWeather' ? (
                      <Weather />
                    ) : toolName === 'createDocument' ? (
                      <DocumentToolCall type='create' args={args} />
                    ) : toolName === 'updateDocument' ? (
                      <DocumentToolCall type='update' args={args} />
                    ) : toolName === 'requestSuggestions' ? (
                      <DocumentToolCall
                        type='request-suggestions'
                        args={args}
                      />
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}

          {message.experimental_attachments && (
            <div className='flex flex-row gap-2'>
              {message.experimental_attachments.map((attachment) => (
                <PreviewAttachment
                  key={attachment.url}
                  attachment={attachment}
                />
              ))}
            </div>
          )}

          <MessageActions
            key={`action-${message.id}`}
            chatId={chatId}
            message={message}
            vote={vote}
            isLoading={isLoading}
          />
        </div>
      </div>
    </motion.div>
  );
};

export const ThinkingMessage = () => {
  const role = 'assistant';

  return (
    <motion.div
      className='w-full mx-auto max-w-3xl px-4 group/message '
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 1 } }}
      data-role={role}
    >
      <div
        className={cx(
          'flex gap-4 group-data-[role=user]/message:px-3 w-full group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:py-2 rounded-xl',
          {
            'group-data-[role=user]/message:bg-muted': true,
          }
        )}
      >
        <div className='size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border'>
          <SparklesIcon size={14} />
        </div>

        <div className='flex flex-col gap-2 w-full'>
          <div className='flex flex-col gap-4 text-muted-foreground'>
            Thinking...
          </div>
        </div>
      </div>
    </motion.div>
  );
};
