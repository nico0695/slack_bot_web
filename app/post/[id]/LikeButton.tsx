'use client'
import React, { useState } from 'react'

const LikeButton = () => {
  const [liked, setLiked] = useState(false)

  return <button onClick={() => setLiked(true)}>{liked ? 'Si' : 'No'}</button>
}

export default LikeButton
