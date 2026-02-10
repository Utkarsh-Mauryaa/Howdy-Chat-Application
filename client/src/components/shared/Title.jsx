import React from 'react'

const Title = ({title="Howdy!", description="This is the chat app called howdy"}) => {
  return (
    <>
    <title>{title}</title>
    <meta name="description" content={description}/>
    </>
  )
}

export default Title
