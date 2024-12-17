"use client";

import React, { useState } from "react";

export default function Page() {
  const [posts, setPosts] = useState([]);

  const handlePostSubmit = (newPost) => {
    setPosts([...posts, newPost]);
  };

  const handleLikeToggle = (postId) => {
    const updatedPosts = posts.map((post) =>
        post.id === postId
            ? {
              ...post,
              likes: post.userLiked ? post.likes - 1 : post.likes + 1,
              userLiked: !post.userLiked,
            }
            : post
    );
    setPosts(updatedPosts);
  };

  const handleAddComment = (postId, newComment) => {
    const updatedPosts = posts.map((post) =>
        post.id === postId
            ? {
              ...post,
              comments: [...post.comments, newComment],
            }
            : post
    );
    setPosts(updatedPosts);
  };

  const handleAddReply = (postId, commentId, newReply) => {
    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        const updatedComments = post.comments.map((comment) => {
          if (comment.id === commentId) {
            return {
              ...comment,
              replies: [...comment.replies, newReply],
            };
          }
          return comment;
        });
        return {
          ...post,
          comments: updatedComments,
        };
      }
      return post;
    });
    setPosts(updatedPosts);
  };

  return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">익명 게시판</h1>

        <PostWriteSection onPostSubmit={handlePostSubmit} />

        <PostList
            posts={posts}
            onLikeToggle={handleLikeToggle}
            onAddComment={handleAddComment}
            onAddReply={handleAddReply}
        />
      </div>
  );
}

function PostWriteSection({ onPostSubmit }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    if (title.trim() && content.trim()) {
      const newPost = {
        id: Date.now(),
        title,
        content,
        createdAt: new Date(),
        likes: 0,
        userLiked: false,
        comments: [],
      };
      onPostSubmit(newPost);
      setTitle("");
      setContent("");
    }
  };

  return (
      <div className="border rounded mb-4 p-4">
        <h2 className="font-bold mb-2">새 글 작성</h2>
        <input
            className="border rounded w-full p-2 mb-2"
            placeholder="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
            className="border rounded w-full p-2 mb-2"
            placeholder="내용을 입력하세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
        />
        <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleSubmit}
        >
          글 등록
        </button>
      </div>
  );
}

function PostList({ posts, onLikeToggle, onAddComment, onAddReply }) {
  return (
      <div>
        {posts.map((post) => (
            <PostItem
                key={post.id}
                post={post}
                onLikeToggle={onLikeToggle}
                onAddComment={onAddComment}
                onAddReply={onAddReply}
            />
        ))}
      </div>
  );
}

function PostItem({ post, onLikeToggle, onAddComment, onAddReply }) {
  const [newComment, setNewComment] = useState("");

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now(),
        content: newComment,
        createdAt: new Date(),
        replies: [],
      };
      onAddComment(post.id, comment);
      setNewComment("");
    }
  };

  return (
      <div className="border rounded mb-2 p-4">
        <h3 className="font-bold mb-2">{post.title}</h3>
        <p>{post.content}</p>

        <div className="mt-4 space-y-2">
          <div>
            <button
                onClick={() => onLikeToggle(post.id)}
                className={`px-3 py-1 rounded border ${
                    post.userLiked ? "border-blue-500 text-blue-500" : "border-gray-300"
                }`}
            >
              좋아요 {post.likes}
            </button>
          </div>

          <div className="flex space-x-2 mt-2">
            <input
                placeholder="댓글을 입력하세요"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-grow border rounded p-2"
            />
            <button
                onClick={handleCommentSubmit}
                className="bg-green-500 text-white px-4 py-2 rounded"
            >
              등록
            </button>
          </div>

          <div className="mt-2 space-y-2">
            {post.comments.map((comment) => (
                <CommentItem
                    key={comment.id}
                    postId={post.id}
                    comment={comment}
                    onAddReply={onAddReply}
                />
            ))}
          </div>
        </div>

        <div className="flex justify-between mt-2 text-sm text-gray-500">
          <span>{post.createdAt.toLocaleString()}</span>
        </div>
      </div>
  );
}

function CommentItem({ postId, comment, onAddReply }) {
  const [showReplies, setShowReplies] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isReplyMode, setIsReplyMode] = useState(false);

  const handleReplySubmit = () => {
    if (replyContent.trim()) {
      const newReply = {
        id: Date.now(),
        content: replyContent,
        createdAt: new Date(),
      };
      onAddReply(postId, comment.id, newReply);
      setReplyContent("");
      setIsReplyMode(false);
    }
  };

  return (
      <div className="bg-gray-50 p-2 rounded">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm">{comment.content}</div>
            <div className="text-xs text-gray-500 mt-1">
              {comment.createdAt.toLocaleString()}
            </div>
          </div>
          <button
              className="text-sm text-blue-500"
              onClick={() => setIsReplyMode(!isReplyMode)}
          >
            답글
          </button>
        </div>

        {isReplyMode && (
            <div className="flex space-x-2 mt-2">
              <input
                  placeholder="답글 작성"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="flex-grow border rounded p-2"
              />
              <button
                  className="bg-blue-500 text-white px-4 py-1 rounded"
                  onClick={handleReplySubmit}
              >
                등록
              </button>
            </div>
        )}

        <div className="mt-2 space-y-2">
          <button
              className="text-sm text-gray-600"
              onClick={() => setShowReplies(!showReplies)}
          >
            답글 {comment.replies.length}개
          </button>

          {showReplies &&
              comment.replies.map((reply) => (
                  <div
                      key={reply.id}
                      className="pl-4 mt-2 border-l-2 border-gray-300 bg-gray-100 p-2 rounded"
                  >
                    <div className="text-sm">{reply.content}</div>
                    <div className="text-xs text-gray-500">
                      {reply.createdAt.toLocaleString()}
                    </div>
                  </div>
              ))}
        </div>
      </div>
  );
}



