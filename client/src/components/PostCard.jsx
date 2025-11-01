const PostCard = ({ post }) => (
  <div className="border rounded-2xl p-4 shadow hover:shadow-md bg-white">
    <h3 className="font-semibold text-lg">{post.title}</h3>
    <p className="text-gray-600">{post.content}</p>
  </div>
);

export default PostCard;
