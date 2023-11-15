import React from 'react'

import LikeButton from './LikeButton'

const fetchPosts = () => {
  return fetch('https://jsonplaceholder.typicode.com/posts', {
    next: {
      revalidate: 60,
    },
  }).then((response) => response.json())
}

const ListOfPost = async () => {
  const posts = await fetchPosts()
  return (
    <>
      {posts.slice(0, 5).map((post: any) => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.body}</p>
          <LikeButton />
        </div>
      ))}
    </>
  )
}

export default ListOfPost
