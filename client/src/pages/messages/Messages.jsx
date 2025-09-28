import moment from 'moment';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { axiosFetch } from '../../utils';
import { useRecoilValue } from 'recoil';
import { userState } from '../../atoms';
import { Loader } from '../../components';
import './Messages.scss';

const Messages = () => {
  const user = useRecoilValue(userState);
  const queryClient = useQueryClient();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { isLoading, error, data } = useQuery({
    queryKey: ['conversations'],
    queryFn: () =>
      axiosFetch.get('/conversations')
        .then(({ data }) => data)
        .catch((err) => {
          console.error("Error fetching conversations:", err.response?.data || err.message);
          throw new Error('Failed to load conversations');
        }),
  });

  const mutation = useMutation({
    mutationFn: (id) => axiosFetch.patch(`/conversations/${id}`),
    onSuccess: () => queryClient.invalidateQueries(['conversations']),
  });
  

  const handleMessageRead = (id) => {
    mutation.mutate(id);
  };

  return (
    <div className="messages">
      <div className="container">
        <div className="title">
          <h1>Messages</h1>
        </div>

        {isLoading ? (
          <div className="loader"><Loader /></div>
        ) : error ? (
          <div className="error">Something went wrong!</div>
        ) : data?.length === 0 ? (
          <div className="no-messages">No conversations yet.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>{user.isSeller ? 'Buyer' : 'Seller'}</th>
                <th>Last Message</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((conv) => (
                <tr
                  key={conv._id}
                  className={
                    (user.isSeller && !conv.readBySeller) ||
                    (!user.isSeller && !conv.readByBuyer)
                      ? 'active'
                      : ''
                  }
                >
                  <td className="user-info">
                    <img
                      src={
                        user.isSeller
                          ? conv.buyerID?.image || "/media/noavatar.png"
                          : conv.sellerID?.image || "/media/noavatar.png"
                      }
                      alt="profile"
                      className="avatar"
                    />
                    <span>
                      {user.isSeller ? conv.buyerID?.username : conv.sellerID?.username}
                    </span>
                  </td>

                  <td>
                    <Link className="link" to={`/message/${conv._id}`}>
                      {conv?.lastMessage?.slice(0, 100) || "No message yet"}...
                    </Link>
                  </td>
                  <td>{moment(conv.updatedAt).fromNow()}</td>
                  <td>
                    {((user.isSeller && !conv.readBySeller) ||
                      (!user.isSeller && !conv.readByBuyer)) && (
                        <button onClick={() => handleMessageRead(conv._id)}>
                          Mark as read
                        </button>

                      
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Messages;
