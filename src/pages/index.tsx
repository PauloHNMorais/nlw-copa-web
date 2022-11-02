import Image from 'next/image';
import appPreviewImg from '../assets/app-nlw-copa-preview.png';
import logoImg from '../assets/logo.svg';
import usersAvatarExampleImg from '../assets/users-avatar-example.png';
import iconCheckImg from '../assets/icon-check.svg';
import { api } from '../lib/api';
import { User } from '../models/user';
import { FormEvent, useState } from 'react';
import { Pool } from '../models/pool';

interface HomeProps {
  poolsCount: number;
  usersCount: number;
  guessesCount: number;
  lastUsers: User[];
}

export default function Home(props: HomeProps) {
  const [poolTitle, setPoolTitle] = useState('');

  async function createPool(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();

    try {
      const response = await api.post<Pool>('pools', {
        title: poolTitle,
      });

      setPoolTitle('');

      const { code } = response.data;

      await navigator.clipboard.writeText(code);

      alert(
        'Bolão criado com sucesso! O código foi criado para a área de transferência'
      );
    } catch (error) {
      alert('Falha ao criar o bolão, tente novamente');
    }
  }

  return (
    <div className='max-w-[1124px] h-screen mx-auto grid grid-cols-2 items-center gap-28'>
      <main>
        <Image src={logoImg} alt='NLW Copa' />

        <h1 className='mt-14 text-white text-5xl font-bold leading-tight'>
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className='mt-10 flex items-center gap-2'>
          {/* <Image src={usersAvatarExampleImg} alt='' /> */}

          <div className='flex'>
            {props.lastUsers.map((user) => (
              <img
                src={
                  user.avatarURL ||
                  'https://openclipart.org/download/238968/user.svg'
                }
                alt={user.name}
                key={user.id}
                className='rounded-full w-12 h-12 mr-[-24px] border-gray-900 border-4 object-cover'
              />
            ))}
          </div>

          <strong className='text-gray-100 text-xl ml-5'>
            <span className='text-ignite-500'>+{props.usersCount}</span> pessoas
            já estão usando
          </strong>
        </div>

        <form className='mt-10 flex gap-2' onSubmit={createPool}>
          <input
            type='text'
            required
            placeholder='Qual o nome do seu bolão?'
            value={poolTitle}
            onChange={(e) => setPoolTitle(e.target.value)}
            className='flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100'
          />
          <button
            type='submit'
            className='bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700 transition-colors'
          >
            Criar meu bolão
          </button>
        </form>

        <p className='mt-4 text-sm text-gray-300 leading-relaxed'>
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas 🚀
        </p>

        <div className='mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100'>
          <div className='flex items-center gap-6'>
            <Image src={iconCheckImg} alt='' />
            <div className='flex flex-col'>
              <span className='font-bold text-2xl'>+{props.poolsCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>

          <div className='w-px h-14 bg-gray-600' />

          <div className='flex items-center gap-6'>
            <Image src={iconCheckImg} alt='' />
            <div className='flex flex-col'>
              <span className='font-bold text-2xl'>+{props.guessesCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>

      <Image
        src={appPreviewImg}
        alt='Dois celulares exibindo uma prévia da aplicação móvel do NLW Copa'
        quality={100}
      />
    </div>
  );
}

export async function getStaticProps() {
  const [
    poolsCountResponse,
    guessesCountResponse,
    usersCountResponse,
    lastUsersResponse,
  ] = await Promise.all([
    api.get('/pools/count'),
    api.get('/guesses/count'),
    api.get('/users/count'),
    api.get('/users/last/4'),
  ]);

  return {
    props: {
      poolsCount: poolsCountResponse.data.count,
      guessesCount: guessesCountResponse.data.count,
      usersCount: usersCountResponse.data.count,
      lastUsers: lastUsersResponse.data,
    },
  };
}
