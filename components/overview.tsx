import { motion } from 'framer-motion';
import Link from 'next/link';

import LogoWhite from '@/public/images/logo-white.png';
import Image from 'next/image';

export const Overview = () => {
  return (
    <motion.div
      key='overview'
      className='max-w-3xl mx-auto md:mt-20'
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className='rounded-xl p-6 flex flex-col gap-8 leading-relaxed text-center max-w-xl'>
        <p className='flex flex-row justify-center gap-4 items-center'>
          <Image src={LogoWhite} alt='logo' width={180} height={40} />
        </p>
        <p>
          This is an AI Investment Chatbot Advisor that allows users to find the
          best possible yield opportunities around the DeFi space, offering live
          data about the highest earning yield pools, while taking into
          consideration risk levels and categories of investment.
        </p>
      </div>
    </motion.div>
  );
};
