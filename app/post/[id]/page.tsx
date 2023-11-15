import React from 'react'

import ListOfPost from './ListOfPost'

const PostId = async ({ params }: { params: { id: string } }) => {
  const { id } = params

  return (
    <section>
      <h2>PostId: {id}</h2>
      {/* @ts-ignore */}
      <ListOfPost />
    </section>
  )
}

export default PostId
