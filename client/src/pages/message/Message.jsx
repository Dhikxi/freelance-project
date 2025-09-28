import toast from 'react-hot-toast';
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRecoilValue } from "recoil";
import { userState } from "../../atoms";
import { axiosFetch } from '../../utils';
import { Loader } from '../../components';
import "./Message.scss";

const Message = () => {
  const user = useRecoilValue(userState);
  const { conversationID } = useParams();
  const queryClient = useQueryClient();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { isLoading, error, data = [] } = useQuery({
    queryKey: ['messages', conversationID],
    queryFn: () =>
      axiosFetch.get(`/messages/${conversationID}`)
        .then(({ data }) => data)
        .catch((error) => {
          toast.error(error?.response?.data?.message || "Failed to load messages");
          throw error;
        })
  });

  const mutation = useMutation({
    mutationFn: (message) =>
      axiosFetch.post('/messages', message),
    onSuccess: () => {
      queryClient.invalidateQueries(['messages', conversationID]);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to send message");
    }
  });

  const handleMessageSubmit = (event) => {
    event.preventDefault();
    const messageText = event.target[0].value.trim();

    if (!messageText) {
      toast.error("Message cannot be empty");
      return;
    }

    mutation.mutate({
      conversationID,
      description: messageText
    });

    event.target.reset();
  };

  return (
    <div className="message">
      <div className="container">
        <span className="breadcrumbs">
          <Link to="/messages" className="link">Messages</Link>
        </span>

        {isLoading ? (
          <div className="loader"><Loader /></div>
        ) : error ? (
          <p>Something went wrong!</p>
        ) : (
          <div className="messages">
            {data.length === 0 ? (
              <p className="no-messages">No messages yet. Start the conversation!</p>
            ) : (
              data.map((message) => (
                <div
                    className={message.userID?._id === user._id ? 'owner item' : 'item'}
                    key={message._id}
                  >
                    <img
                      src={message.userID?.image || '/media/noavatar.png'}
                      alt="user"
                    />
                    <p>{message.description}</p>
                  </div>

              ))
            )}
          </div>
        )}

        <hr />

        <form className="write" onSubmit={handleMessageSubmit}>
          <textarea cols="30" rows="4" placeholder="Write a message" />
          <button type="submit" disabled={mutation.isLoading}>
            {mutation.isLoading ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Message;
