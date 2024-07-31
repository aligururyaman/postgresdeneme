'use client'
import { useState } from 'react';

export default function Home() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [data, setData] = useState([]);

  const handlePost = async () => {
    const response = await fetch('/api/usersRoute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ first_name: firstName, last_name: lastName }),
    });
    const result = await response.json();
    alert(result.message);
  };

  const handleGet = async () => {
    const response = await fetch('/api/usersRoute');
    const result = await response.json();
    setData(result.data);
  };

  return (
    <div className="flex w-full mt-10">
      <div className="flex flex-col gap-10 w-1/2 justify-center items-center">
        <div className="flex flex-col gap-5 border p-20 rounded-xl">
          <div className="flex items-center justify-center">
            <h1 className="text-3xl font-bold text-orange-400">POST İşlemi</h1>
          </div>
          <div className="flex flex-row gap-4 items-center">
            <p className="text-xl font-bold">İsim: </p>
            <input
              className="h-10 w-full rounded-lg text-black p-2 text-lg"
              placeholder="İsim"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="flex flex-row gap-4  items-center">
            <p className="text-xl font-bold">Soy İsim: </p>
            <input
              className="h-10 rounded-lg text-black p-2 text-lg"
              placeholder="Soy İsim"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="flex w-full bg-gray-300 items-center justify-center text-black h-10 rounded-xl hover:scale-105 hover:bg-gray-800 hover:cursor-pointer">
            <button className="text-lg font-bold" onClick={handlePost}>POST ET</button>
          </div>
        </div>
        <div className="flex flex-col gap-5 border p-20 rounded-xl">
          <div className="flex items-center justify-center">
            <h1 className="text-3xl font-bold text-orange-400">GET İşlemi</h1>
          </div>
          <div className="flex flex-row gap-4 justify-center items-center">
            <p className="text-xl font-bold">Verileri Göstermek İçin Tıklayın </p>
          </div>
          <div className="flex w-full bg-gray-300 items-center justify-center text-black h-10 rounded-xl hover:scale-105 hover:bg-gray-800 hover:cursor-pointer">
            <button className="text-lg font-bold" onClick={handleGet}>GET ET</button>
          </div>
        </div>
      </div>

      <div className="flex w-1/2 justify-center ">
        <div className="flex flex-col gap-5 border p-20 rounded-xl">
          <div className='flex justify-center'>
            <h1 className="text-xl font-bold">Veriler</h1>
          </div>
          <div>
            <div className='flex w-full h-0.5 bg-slate-300' />
          </div>
          <div>
            {data.map((person, index) => (
              <div key={index} className='flex flex-row gap-10 justify-center items-center'>
                <div className='flex justify-center flex-col text-2xl'>
                  {person.first_name}
                </div>
                <div className='flex justify-center flex-col text-2xl'>
                  {person.last_name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
