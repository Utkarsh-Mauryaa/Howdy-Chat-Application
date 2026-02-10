import {Skeleton} from '@mui/material'
export const LayoutLoader = () => {
   return <div className="grid grid-cols-3 border-2 border-red-500 gap-2">
           <div className="h-full border-2 col-span-3 min-[640px]:col-span-1">
            <Skeleton variant='rectangular'height={'100vh'} sx={{ bgcolor: 'grey.400' }}/>
           </div>
           <div className="h-full w-full border-2 col-span-2 min-[1024px]:col-span-1 hidden min-[640px]:block">
            {
            Array.from({length:13}).map((_, i) => (
              <Skeleton key={i} variant='rounded' height={'4.3rem'} sx={{ bgcolor: 'grey.400' }} className='m-4'/>  
            ))
            }
           </div>
           <div className="md:w-full hidden min-[1024px]:block"><Skeleton variant='rectangular'height={'100vh'} sx={{ bgcolor: 'grey.400' }}/></div>
          </div>
}
