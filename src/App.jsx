import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
} from "@tanstack/react-query";
import axios from "axios";

function App() {
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: () =>
      fetch("https://jsonplaceholder.typicode.com/posts").then((res) =>
        res.json()
      ),
    // staleTime: 4000, //automatically refetch the data automatically if there are no changes happened
    // refetchInterval: 4000, //refetch the data every four seconds
    // gcTime: 6000, //once this query is unmounted after 6 seconds it will totally be deleted.
    refetchOnWindowFocus: false, //if you set this to false everytime you switch another windows it will not perform refetch
  });

  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: (newPost) =>
      fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        body: JSON.stringify(newPost),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      }).then((res) => res.json()),

    onSuccess: (newPost) => {
      // queryClient.invalidateQueries({ queryKey: ["posts"] }); //invalidate means refetching the data directly to the API
      queryClient.setQueryData(["posts"], (oldPosts) => [...oldPosts, newPost]); //fetching the data on cache but disappers when the page refreshed
    },
  });

  if (error) return <div>Something went wrong!</div>;
  if (isLoading) return <div>Loading...</div>;
  if (isPending) return <div>Pending...</div>;

  return (
    <>
      <button
        onClick={() =>
          mutate({
            userId: 1000,
            id: 1000,
            title: "Zaf",
            completed: false,
          })
        }
      >
        Add
      </button>
      {data.map((el) => (
        <>
          <p>{el.id}</p>
          <h1>{el.title}</h1>
          <p>{el.body}</p>
        </>
      ))}
    </>
  );
}

export default App;
