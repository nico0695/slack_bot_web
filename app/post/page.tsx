import React from 'react'

const Post = () => {
  return (
    <>
      <style jsx>{`
        .prueba {
          color: green;
        }
      `}</style>
      <h2 className="prueba">Post</h2>
      <section className="border-red-500">
        <h2 className="text-8xl h-auto w-5/12 flex-auto  text-red-500 bg-white">Post T</h2>
      </section>
    </>
  )
}

export default Post
