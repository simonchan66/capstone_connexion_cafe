"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserAuth } from '../_utils/auth-context';
import { Oval } from 'react-loader-spinner';

export default function AdminPage() {
  const [cards, setCards] = useState([]);
  const [newCardUsername, setNewCardUsername] = useState('');
  const [newCardRole, setNewCardRole] = useState('');
  const [registrationMessage, setRegistrationMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useUserAuth();
  const router = useRouter();

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    const response = await fetch('http://127.0.0.1:5000/api/get_all_cards');
    const data = await response.json();
    setCards(data);
  };

  const registerCard = async (e) => {
    e.preventDefault();
    setRegistrationMessage('Place the card on the reader...');
    if (!newCardUsername || !newCardRole) {
      console.error('Username and role are required');
      setRegistrationMessage('Username and role are required');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/api/register_card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: newCardUsername, role: newCardRole }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log('Card registered successfully:', data);
        setNewCardUsername('');
        setNewCardRole('');
        setRegistrationMessage(`Card registered successfully. UID: ${data.uid}`);
        fetchCards();
      } else {
        console.error('Failed to register card:', data.error);
        setRegistrationMessage(`Failed to register card: ${data.error}`);
      }
    } catch (error) {
      console.error('Error registering card:', error);
      setRegistrationMessage('Error registering card. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const deleteCard = async (uid) => {
    const response = await fetch('http://127.0.0.1:5000/api/delete_card', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid }),
    });
    if (response.ok) {
      fetchCards();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>
      
      <form onSubmit={registerCard} className="mb-8">
        <input
          type="text"
          value={newCardUsername}
          onChange={(e) => setNewCardUsername(e.target.value)}
          placeholder="Username"
          className="bg-gray-800 text-white p-2 rounded mr-2"
        />
        <select
          value={newCardRole}
          onChange={(e) => setNewCardRole(e.target.value)}
          className="bg-gray-800 text-white p-2 rounded mr-2"
        >
          <option value="">Select Role</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Register Card
        </button>
      </form>

      {registrationMessage && (
        <p className="mb-4 text-yellow-400">{registrationMessage}</p>
      )}

      <table className="w-full bg-gray-800 rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-700">
            <th className="p-3 text-left">UID</th>
            <th className="p-3 text-left">Username</th>
            <th className="p-3 text-left">Role</th>
            <th className="p-3 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {cards.map((card) => (
            <tr key={card.uid} className="border-t border-gray-700">
              <td className="p-3">{card.uid}</td>
              <td className="p-3">{card.username}</td>
              <td className="p-3">{card.role}</td>
              <td className="p-3">
                <button
                  onClick={() => deleteCard(card.uid)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Loading Modal */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg text-lg flex flex-col items-center">
            <Oval
              height={80}
              width={80}
              color="#00a2fa"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
              ariaLabel='oval-loading'
              secondaryColor="#00a2fa"
              strokeWidth={2}
              strokeWidthSecondary={2}
            />
            <h2 className="text-2xl font-semibold mt-4 text-gray-800">Waiting for NFC...</h2>
          </div>
        </div>
      )}
    </div>
  );
}