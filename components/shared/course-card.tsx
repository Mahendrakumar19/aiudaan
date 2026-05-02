'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
// import { GlassCard } from './glass-card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { cardVariants } from '@/lib/animationVariants';

interface CourseCardProps {
  id: string
  title: string
  description: string
  price: number
  image?: string
  instructor: string
  duration: string
  level: string
  rating: number
  students: number
}

export const CourseCard = ({
  id,
  title,
  description,
  price,
  image,
  instructor,
  duration,
  level,
  rating,
  students,
}: CourseCardProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: handle form submission (API call, etc.)
    setModalOpen(false);
  };

  if (isClosed) {
    return null;
  }

  return (
    <>
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="show"
        whileHover={{
          scale: 1.03,
          boxShadow: '0 8px 32px 0 rgba(0,0,0,0.18)',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="h-full flex flex-col rounded-2xl bg-white shadow-md hover:shadow-2xl transition-shadow duration-300 overflow-hidden"
      >
        <Link href={`/courses/${id}`} className="flex-1 flex flex-col">
          {/* Course Image */}
          <div className='relative h-48 w-full overflow-hidden bg-gradient-to-r from-pink-50 to-blue-50'>
            <div className='absolute left-3 top-3 z-10 rounded-full border border-slate-200 bg-white/95 px-3 py-1 text-xs font-medium text-slate-600'>
              {level}
            </div>
            {/* Close Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsClosed(true);
              }}
              className='absolute right-3 top-3 z-10 rounded-full bg-white/95 border border-slate-200 p-1.5 hover:bg-red-50 hover:border-red-300 transition-colors'
              title='Close card'
            >
              <svg className='w-4 h-4 text-slate-600 hover:text-red-600' fill='currentColor' viewBox='0 0 20 20'>
                <path fillRule='evenodd' d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z' clipRule='evenodd' />
              </svg>
            </button>
            {image ? (
              <Image
                src={image}
                alt={title}
                width={400}
                height={200}
                className='w-full h-full object-cover'
              />
            ) : (
              <div className='flex h-full w-full items-center justify-center'>
                <div className='text-5xl'>📚</div>
              </div>
            )}
          </div>

          {/* Course Info */}
          <div className='flex-1 flex flex-col px-5 pt-5 pb-2'>
            <h3 className='mb-2 line-clamp-2 text-lg font-semibold text-slate-900'>
              {title}
            </h3>
            <p className='mb-4 line-clamp-2 text-sm text-slate-500 flex-1'>
              {description}
            </p>

            {/* Instructor & Level */}
            <div className='mb-4 flex items-center justify-between border-b border-slate-100 pb-4'>
              <div>
                <p className='text-xs text-slate-400'>Instructor</p>
                <p className='text-sm font-medium text-slate-700'>{instructor}</p>
              </div>
              <div className='text-right'>
                <p className='text-xs text-slate-400'>Duration</p>
                <p className='text-sm font-medium text-slate-700'>{duration}</p>
              </div>
            </div>

            {/* Stats */}
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-1'>
                <span className='text-yellow-400'>⭐</span>
                <span className='text-sm text-slate-700'>{rating}</span>
                <span className='text-xs text-slate-400'>({students})</span>
              </div>
            </div>
          </div>
        </Link>

        {/* Price & CTA */}
        <div className='mt-auto flex items-center justify-between border-t border-slate-100 px-5 py-4 gap-4'>
          <div className='flex-shrink-0'>
            {price > 0 ? (
              <>
                <p className='text-xs text-slate-400'>Price</p>
                <p className='text-xl font-bold text-slate-900'>₹{price}</p>
              </>
            ) : (
              <p className='text-lg font-bold text-green-500'>Free</p>
            )}
          </div>
          <div className="flex gap-2 flex-wrap justify-end">
            <Button size='sm' variant='primary'>
              Enroll
            </Button>
            <Button size='sm' variant='secondary' onClick={() => setModalOpen(true)}>
              Apply Scholarship
            </Button>
          </div>
        </div>
      </motion.div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4 text-center">Apply for Scholarship</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            name="name"
            type="text"
            placeholder="Name"
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring"
            value={form.name}
            onChange={handleChange}
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring"
            value={form.email}
            onChange={handleChange}
          />
          <input
            name="phone"
            type="tel"
            placeholder="Phone"
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring"
            value={form.phone}
            onChange={handleChange}
          />
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </form>
      </Modal>
    </>
  );
}