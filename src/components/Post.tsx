import React from "react";
import { IPost } from "../types";
import styled from "styled-components";

interface PostProps {
  post: IPost;
}

const Wrapper = styled.div`
  padding: 16px;
  border-radius: 12px;
  background: #f9fafb;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);

  width: 620px;
  margin: 0 auto;

  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  }
`;
const PostTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #111827;
`;

const PostBody = styled.p`
  font-size: 14px;
  color: #4b5563;
  line-height: 1.6;
`;

export const Post: React.FC<PostProps> = ({ post }) => {
  return (
    <Wrapper>
      <p>user id: {post.userId}</p>
      <PostTitle>{post.title}</PostTitle>
      <PostBody>{post.body}</PostBody>
    </Wrapper>
  );
};
