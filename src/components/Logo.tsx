'use client'

import { motion } from 'framer-motion';
import LogoImage from '../assets/logo.png';

export function Logo() {
  return (
    <motion.div className="flex items-center gap-3" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} >
      <motion.div whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 400, damping: 10 }} >
        <img width={40} height={40} alt="Rihlatech Logo" className="object-contain" src={LogoImage} />
      </motion.div>

      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.5 }} className="text-xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent" >
        Rihlatech Management Tool
      </motion.div>
    </motion.div>
  )
}
