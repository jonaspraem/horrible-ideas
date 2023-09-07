import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'
import stacking from "@/components/stacking";
import StackingGame from '@/components/stacking';

export default function Home() {

  return (
    <main className="page-layout">
      <StackingGame />
    </main>
  )
}
