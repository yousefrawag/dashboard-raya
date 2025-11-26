import React from 'react'

import Breadcrumb from '../../components/common/Breadcrumbs/Breadcrumb'
const GoogaleCalnder = () => {
  return (
    <div className='w-full h-fuul'>
        <Breadcrumb  pageName="تقويم- رايه - جوجل"/>
        <div className='shadow-lg w-full h-full'>
        <iframe
              src="https://calendar.google.com/calendar/embed?src=rayapalinfo%40gmail.com&ctz=Africa%2FCairo"
              style={{ border: 0 }}
              width="100%"
              height="600"
          
            ></iframe>
        </div>
    </div>
  )
}

export default GoogaleCalnder