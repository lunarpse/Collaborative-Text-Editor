'use client';

import Theme from './plugins/Theme';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import { HeadingNode } from '@lexical/rich-text';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import React from 'react';

import {FloatingComposer, FloatingThreads, liveblocksConfig, LiveblocksPlugin, useEditorStatus, useIsEditorReady} from "@liveblocks/react-lexical";
import Loader from '../Loader';
import { read } from 'fs';
import FloatingToolbar from '../FloatingToolbarPlugin';
import { useThreads } from '@liveblocks/react/suspense';
import Comments from '../Comments';
import Deletemodal from '../Deletemodal';


function Placeholder() {
  return <div className="editor-placeholder">Enter some rich text...</div>;
}

export function Editor({currentUserType,roomId}:{roomId:string,currentUserType:string}) {
  console.log("lllllll"+currentUserType)
  const threads=useThreads();
  console.log('rrrrr')
  console.log(threads)
  const initialConfig = liveblocksConfig({
    namespace: 'Editor',
    nodes: [HeadingNode],
    onError: (error: Error) => {
      console.error(error);
      throw error;
    },
    theme: Theme,
    editable:currentUserType==="editor"
  });
  const ready=useEditorStatus();
  console.log(currentUserType)
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-container size-full">
        <div className="toolbar-wrapper flex min-w-ful justify-between">
        <ToolbarPlugin />
        {currentUserType==='editor' && <Deletemodal roomId={roomId}/>}

        </div>

        <div className="editor-wrapper flex flex-col items-center justify-start">
          {ready==='loading' || ready==='not-loaded'?<Loader/>:(
            <div className="editor-inner min-h-[1100px] relative mb-5 h-fit w-full max-w-[800px] shadow-md lg:mb-10">
            <RichTextPlugin
              contentEditable={
                <ContentEditable className="editor-input h-full" />
              }
              placeholder={<Placeholder />}
              ErrorBoundary={LexicalErrorBoundary}
            />
             {currentUserType==='editor'&& <FloatingToolbar/>}
            <HistoryPlugin />
            <AutoFocusPlugin />
          </div>
          )}
            {/* <div className="editor-inner min-h-[1100px] relative mb-5 h-fit w-full max-w-[800px] shadow-md lg:mb-10">
            <RichTextPlugin
              contentEditable={
                <ContentEditable className="editor-input h-full" />
              }
              placeholder={<Placeholder />}
              ErrorBoundary={LexicalErrorBoundary}
            />
           
            <HistoryPlugin />
            <AutoFocusPlugin />

          </div> */}

          <LiveblocksPlugin>
            <FloatingComposer className='w-[350px'/>
            <FloatingThreads threads={threads.threads}/>
            <Comments/>
          </LiveblocksPlugin>
        </div>
      </div>
    </LexicalComposer>
  );
}
