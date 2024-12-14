import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ThumbsUp, MessageCircle, Reply } from 'lucide-react';

const MainBoard = () => {
  const [posts, setPosts] = useState([]);

  const handlePostSubmit = (newPost) => {
    setPosts([...posts, newPost]);
  };

  const handleLikeToggle = (postId) => {
    const updatedPosts = posts.map(post =>
        post.id === postId
            ? {
              ...post,
              likes: post.userLiked ? post.likes - 1 : post.likes + 1,
              userLiked: !post.userLiked
            }
            : post
    );
    setPosts(updatedPosts);
  };

  const handleAddComment = (postId, newComment) => {
    const updatedPosts = posts.map(post =>
        post.id === postId
            ? {
              ...post,
              comments: [...post.comments, newComment]
            }
            : post
    );
    setPosts(updatedPosts);
  };

  const handleAddReply = (postId, commentId, newReply) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const updatedComments = post.comments.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              replies: [...comment.replies, newReply]
            };
          }
          return comment;
        });
        return {
          ...post,
          comments: updatedComments
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
};

const PostWriteSection = ({ onPostSubmit }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    if (title.trim() && content.trim()) {
      const newPost = {
        id: Date.now(),
        title,
        content,
        createdAt: new Date(),
        likes: 0,
        userLiked: false,
        comments: []
      };
      onPostSubmit(newPost);
      setTitle('');
      setContent('');
    }
  };

  return (
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>새 글 작성</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
              placeholder="제목"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mb-2"
          />
          <textarea
              placeholder="내용을 입력하세요"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border rounded p-2 mb-2"
              rows={4}
          />
          <Button onClick={handleSubmit}>글 등록</Button>
        </CardContent>
      </Card>
  );
};

const PostList = ({ posts, onLikeToggle, onAddComment, onAddReply }) => {
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
};

const PostItem = ({ post, onLikeToggle, onAddComment, onAddReply }) => {
  const [newComment, setNewComment] = useState('');

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now(),
        content: newComment,
        createdAt: new Date(),
        replies: []
      };
      onAddComment(post.id, comment);
      setNewComment('');
    }
  };

  return (
      <Card className="mb-2">
        <CardHeader>
          <CardTitle>{post.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{post.content}</p>

          <div className="mt-4 space-y-2">
            <div className="flex items-center space-x-2">
              <Button
                  variant={post.userLiked ? "default" : "outline"}
                  onClick={() => onLikeToggle(post.id)}
                  className="flex items-center"
              >
                <ThumbsUp className="mr-2 h-4 w-4" />
                좋아요 {post.likes}
              </Button>
            </div>

            <div className="flex space-x-2 mt-2">
              <Input
                  placeholder="댓글을 입력하세요"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-grow"
              />
              <Button onClick={handleCommentSubmit}>
                <MessageCircle className="mr-2 h-4 w-4" />
                등록
              </Button>
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
        </CardContent>
      </Card>
  );
};

const CommentItem = ({ postId, comment, onAddReply }) => {
  const [showReplies, setShowReplies] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isReplyMode, setIsReplyMode] = useState(false);

  const handleReplySubmit = () => {
    if (replyContent.trim()) {
      const newReply = {
        id: Date.now(),
        content: replyContent,
        createdAt: new Date()
      };
      onAddReply(postId, comment.id, newReply);
      setReplyContent('');
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
          <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsReplyMode(!isReplyMode)}
          >
            <Reply className="mr-2 h-4 w-4" />
            답글
          </Button>
        </div>

        {/* 답글 작성 입력창 */}
        {isReplyMode && (
            <div className="flex space-x-2 mt-2">
              <Input
                  placeholder="답글 작성"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="flex-grow"
              />
              <Button size="sm" onClick={handleReplySubmit}>
                등록
              </Button>
            </div>
        )}

        {/* 답글 목록 */}
        <div className="mt-2 space-y-2">
          <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReplies(!showReplies)}
          >
            답글 {comment.replies.length}개
          </Button>

          {showReplies && comment.replies.map((reply) => (
              <div key={reply.id} className="pl-4 mt-2 border-l-2 bg-gray-100 p-2 rounded">
                <div className="text-sm">{reply.content}</div>
                <div className="text-xs text-gray-500">
                  {reply.createdAt.toLocaleString()}
                </div>
              </div>
          ))}
        </div>
      </div>
  );
};

export default MainBoard;