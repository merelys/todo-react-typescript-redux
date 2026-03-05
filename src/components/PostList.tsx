import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { setSelectedUserId } from "../redux/uiSlice";
import { getDataFromAPI } from "../utils/api";
import { setPosts, deletePosts } from "../redux/postsSlice";
import { IPost } from "../types";
import { Post } from "./Post";
import { useSearchParams } from "react-router-dom";

export const PostList = () => {
  const posts = useSelector((state: RootState) => state.posts.value);
  const selectedUserId = useSelector(
    (state: RootState) => state.ui.selectedUserId
  );

  const [searchParams, setSearchParams] = useSearchParams();

  const dispatch = useDispatch();

  const getPosts = (signal: AbortSignal) => {
    const url = "https://jsonplaceholder.typicode.com/posts";
    const userId = selectedUserId;
    getDataFromAPI<IPost>(url, signal, { userId }).then((data) => {
      if (data.length > 0) {
        dispatch(setPosts(data));
        console.log(data);
      }
    });
  };

  useEffect(() => {
    console.log(`useEffect []`);
    let controller = new AbortController();

    const userIdParam = searchParams.get("userId");

    if (userIdParam) {
      dispatch(setSelectedUserId(Number(userIdParam)));
    }

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (!selectedUserId) {
      dispatch(deletePosts());
      return;
    }
    let controller = new AbortController();

    getPosts(controller.signal);

    const currentUserId = searchParams.get("userId");

    if (currentUserId !== selectedUserId.toString()) {
      setSearchParams({
        userId: selectedUserId.toString(),
      });

      console.log(`записали параметр `);
    }
    return () => {
      controller.abort();
    };
  }, [selectedUserId]);

  return (
    <div>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};
