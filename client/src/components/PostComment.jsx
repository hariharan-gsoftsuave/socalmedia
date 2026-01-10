import React from "react";
import { useSelector } from "react-redux";
import TimeAgo from "timeago-react";
import { FaRegTrashAlt } from "react-icons/fa";

const PostComment = ({ comment, onDeleteComment }) => {
    const userId = useSelector((state) => state?.user?.currentUser?._id);
    return (
        <li className="d-flex gap-3 justify-content-between singlePost_comment p-sm-2">
            <div className="SinglePost_comment-wrapper d-flex gap-3">
                <div className="singlePost_comment-author">
                    <img
                        src={comment?.creator?.creator_avatar || "/default-avatar.png"}
                        alt="Avatar"
                        className="rounded-5"
                        style={{ height: "30px", width: "30px", objectFit: "cover" }}
                    />

                </div>

                <div>
                    <div className="align-items-end d-flex gap-3">
                        <h5>{comment?.creator?.fullName || "User"}</h5>
                        <small>
                            <TimeAgo datetime={comment?.createdAt} />
                        </small>
                    </div>

                    <p>{comment?.comment}</p>
                </div>
            </div>

            {userId == comment?.creator?.creator_id && (
                <button
                    className="singlepost_comment_delete_btn h-100"
                    onClick={onDeleteComment}
                >
                    <FaRegTrashAlt />
                </button>
            )}
        </li>
    );
};

export default PostComment;
