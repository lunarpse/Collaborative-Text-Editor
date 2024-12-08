import { cn } from '@/lib/utils'
import { useThreads } from '@liveblocks/react'
import { useIsThreadActive } from '@liveblocks/react-lexical'
import { Composer, Thread } from '@liveblocks/react-ui'
import React from 'react'
const ThreadWrapper=({thread}:ThreadWrapperProps)=>{
    const isactive=useIsThreadActive(thread.id)
    return (
        <Thread thread={thread} className={cn('comment-thread-border',isactive && '!border-blue-500 shadow-md',
            thread.resolved && 'opacity-40'
        )}/>
    )
}

const Comments = () => {
    const threads=useThreads();
    console.log("jjjjjjjjjj")
    console.log(threads.threads)
  return (
    <div className="comments-container">
        <Composer className='comments-composer'/>
        {threads.threads?.map(thread=>(
            <ThreadWrapper key={thread.id} thread={thread} />
        ))}
    </div>
  )
}

export default Comments