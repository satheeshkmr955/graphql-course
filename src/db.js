let users = [
  { id: "1", name: "satheesh", email: "satheesh@gmail.com", age: 25 },
  { id: "2", name: "kumar", email: "kumar@gmail.com" },
  { id: "3", name: "zrish", email: "zrish@gmail.com" },
];

let posts = [
  { id: "1", title: "satheesh - 1", body: "1", published: true, author: "1" },
  { id: "2", title: "satheesh - 2", body: "2", published: false, author: "1" },
  { id: "3", title: "kumar - 1", body: "3", published: false, author: "2" },
];

let comments = [
  { id: "10", text: "great post", author: "1", post: "1" },
  { id: "11", text: "super post", author: "1", post: "1" },
  { id: "12", text: "nice post", author: "2", post: "2" },
  { id: "13", text: "good post", author: "3", post: "3" },
];

export default {
  users,
  posts,
  comments,
};
